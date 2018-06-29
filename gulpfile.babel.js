require('dotenv').config();
import gulp from 'gulp';
import browserify from 'browserify';
import vueify from 'vueify';
import babelify from 'babelify';
import plumber from 'gulp-plumber';
import prefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import minify from 'gulp-cssnano';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';
import notify from 'gulp-notify';
import through2 from 'through2';
import log from 'fancy-log';
import notifier from 'node-notifier';
import {spawn} from 'child_process';
import {basename, extname, dirname} from 'path';
import {ls} from 'shelljs';
import {env} from 'process';
import {argv} from 'yargs';
const browserSync = require('browser-sync').create();

const themeDir = 'src/themes/__';

// ALL PLUGIN'S PATHS GO HERE
const targets = [

  'src/themes/__'

].map(target => `${__dirname}/${target}`);

const targetBundles = targets.map(target => `${target}/resources/scripts/**/*`);
const targetStyles = targets.map(target => `${target}/resources/styles/**/*`);

gulp.task('watch', watch);

gulp.task('buildVendorJs', buildVendorJs);
gulp.task('buildVendorCss', buildVendorCss);

gulp.task('build', build);

gulp.task('dist', dist);

gulp.task('serve', () => {
  browserSync.init({
    proxy: env.WP_HOME,
    open: false
  });

  watch();
});

gulp.task('default', ['serve']);

// BUILD
function build()
{
  targets.forEach((target) => {

    if (isTargetFromTheme(target)) {
      const files = ls(`${target}/resources/scripts/**/*.*`).filter((path) => !path.includes('components'));

      files.forEach((filePath) => {

        bundleBrowserify({
          name : '__', 
          type: extname(filePath) == '.js' ? 'js' : 'vue',
          path : target, 
          fullPath: filePath,
          filename: basename(filePath) 
        });
 
      });
    }
    else {
      if (argv.plugins) {
        bundleBrowserify({ name : 'plugin', type: 'vue', path : target, filename: 'app.vue' });
      }
    }

    compileSass(triggerOther({path: target}));
  });
}

function dist()
{
  return gulp.src(`${themeDir}/vendor/**/*.js`)
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(concat('dist.min.js'))
             .pipe(minifyJs())
             .pipe(gulp.dest(`${themeDir}/dist`));
}

function isTargetFromTheme(target)
{
  return target.includes('src/themes');
}

// WATCH
function watch()
{
  // watch all js files
  gulp.watch(targetBundles).on('change', (file) => {
    console.log('Compiling ' + file.path);
    bundleBrowserify(triggerJs(file)).on('end', doneMessage);
  });

  // watch all sass files
  gulp.watch(targetStyles).on('change', (file) => {
    console.log('Compiling ' + file.path);
    compileSass(triggerOther(file)).on('end', doneMessage);
  });

  //watch php lint
  gulp.watch(['src/plugins/**/*.php', 'src/themes/__/**/*.php']).on('change', (file) => {
    console.log('Liniting ' + basename(file.path));
    execute(file.path, 'vendor/bin/./parallel-lint', 'Lint Failed', 'No syntax error found');
  });
}

function doneMessage()
{
  console.log('------ DONE ------');
}

function execute(file, command, message, cause)
{
  let child  = spawn(command, [file], {cwd: process.cwd()});
  let stdout = '';
  let stderr = '';

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', (data) => {
    stdout += data;
    log(data);
  });

  child.on('close', (code) => {

    if (!stdout.includes(cause)) {
      notifier.notify(message);
    }

  });
}

function triggerJs(file)
{
  const path = file.path;

  if (isTargetFromTheme(path)) {
    return {
      name : '__', 
      type: extname(path) == '.js' ? 'js' : 'vue',
      path : path.substr(0, path.indexOf('resources')), 
      fullPath: path,
      filename: basename(path)
    };
  }
  return { name : 'plugin', type: 'vue', path : path.substr(0, path.indexOf('resources')), filename: 'app.vue' };
}

function triggerOther(file)
{
  const filePath = targets.find(target => file.path.includes(target));
  return {
    path : filePath,
    name : basename(filePath)
  };
}

function phpunit(file)
{
  let child  = spawn('phpunit', [file], {cwd: process.cwd()}),
      stdout = '',
      stderr = '';

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', function (data) {
    stdout += data;
    log(data);
  });

  child.on('close', function(code) {

    if ( ! stdout.includes('OK') ) {
      notifier.notify("Test Failed");
    }

  });
}

function handleErrors()
{
  const args = Array.prototype.slice.call(arguments);
  notify.onError({ title: "Compile Error", message: "<%= error.message %>" }).apply(this, args);
  this.emit('end');
}

function notifyBuild()
{
  return isProduction() ? through2.noop() : notify('Build Complete');
}

function minifyJs()
{
  return isProduction() ? uglify() : through2.noop();
}

function minifyCss()
{
  return isProduction()
    ? minify({ convertValues: { length: false }, discardComments: { removeAll: true } })
    : through2.noop();
}

function isProduction()
{
  return env.WP_ENV == 'production';
}

function bundleBrowserify(target)
{
  const path = target.path;

  if (target.name == '__' && target.type == 'js') {
    return gulp.src(`${path}/resources/scripts/${target.filename}`)
               .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
               .pipe(babel())
               .pipe(concat(target.filename))
               .pipe(minifyJs())
               .pipe(gulp.dest(`${path}/vendor`));
  }

  const entry = target.name == '__'
    ? `${path}/resources/scripts/${getVueEntryDir(target)}/index.vue`
    : `${path}/resources/scripts/index.vue`;

  const destination = target.name == '__'
    ? `${path}/vendor/` + getVueEntryDir(target)
    : `${path}/vendor`;

  return browserify({
    entries: entry,
    debug: true,
    transform: [vueify]
  }).bundle().on('error', handleErrors)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(babel({presets: ['es2015']}))
    .pipe(minifyJs())
    .pipe(notifyBuild())
    .pipe(gulp.dest(destination));
}

function getVueEntryIndex(path)
{
  if (path.includes('index.vue')) return path;
  return path.substr(0, path.indexOf('components')) + 'index.vue';
}

function getVueEntryDir(target)
{
  const urlParts = dirname(target.fullPath).split('/');
  const length = urlParts.length;

  let entryDir = urlParts[length - 1];
  if (entryDir == 'components') {
    entryDir = urlParts[length - 2];
  }

  return entryDir;
}

function compileSass(target)
{
  const path = target.path;

  let [filename, dest] = ['index.css', `${path}/vendor`];

  if (target.name == '__') {
    [filename, dest] = ['style.css', path];
  }

  return gulp.src(`${path}/resources/styles/index.scss`)
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(sass())
             .pipe(prefixer({ browsers: ['last 2 version'] }))
             .pipe(concat(filename))
             .pipe(minifyCss())
             .pipe(gulp.dest(dest))
             .pipe(browserSync.reload({stream: true}));
}

function buildVendorJs()
{
  const vendors = [
    'node_modules/vue/dist/vue.min.js'
  ];

  return gulp.src(vendors) 
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(concat('vendor.js'))
             .pipe(gulp.dest(`${themeDir}/dist`));
}

function buildVendorCss() 
{
  const assets = [
  ];

  return gulp.src(assets) 
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(concat('vendor.css'))
             .pipe(gulp.dest(`${themeDir}/dist`));
}
