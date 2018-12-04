require('dotenv').config();
import gulp from 'gulp';
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
import log from 'fancy-log';
import notifier from 'node-notifier';
import noop from 'gulp-noop';
import {spawn} from 'child_process';
import {basename, extname, dirname} from 'path';
import {ls} from 'shelljs';
import {env} from 'process';
import {argv} from 'yargs';

const themeDir = 'src/themes/__';

// ALL PLUGIN'S PATHS GO HERE
const targets = ['src/themes/__'].map(target => `${__dirname}/${target}`);
const targetBundles = targets.map(target => `${target}/resources/scripts/**/*`);
const targetStyles = targets.map(target => `${target}/resources/styles/**/*`);

gulp.task('watch', watch);

gulp.task('buildVendorJs', buildVendorJs);
gulp.task('buildVendorCss', buildVendorCss);

gulp.task('build', build);

gulp.task('dist', dist);

gulp.task('serve', watch);

gulp.task('default', ['serve']);

// BUILD
function build()
{
  buildVendorJs();
  buildVendorCss();

  targets.forEach(target => {

    const files = ls(`${target}/resources/scripts/**/*.*`).filter((path) => !path.includes('components'));

    files.forEach((filePath) => {

      bundleBrowserify({
        path : target,
        filename: basename(filePath)
      });

    });

    compileSass(triggerOther({path: target}));
  });
}

function dist()
{
  log('Minified to dist');
  return gulp.src([`${themeDir}/vendor/globals.js`])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(concat('dist.min.js'))
    .pipe(minifyJs())
    .pipe(gulp.dest(`${themeDir}/dist`));
}

// WATCH
function watch()
{
  // watch all js files
  gulp.watch(targetBundles).on('change', (file) => {
    log('Compiling ' + file.path);
    bundleBrowserify(triggerJs(file)).on('end', doneMessage);
    setTimeout(_ => dist(), 1000);
  });

  // watch all sass files
  gulp.watch(targetStyles).on('change', (file) => {
    log('Compiling ' + file.path);
    compileSass(triggerOther(file)).on('end', doneMessage);
  });
}

function doneMessage()
{
  log('------ DONE ------');
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
  return {
    path : path.substr(0, path.indexOf('resources')),
    filename: basename(path)
  };
}

function triggerOther(file)
{
  const filePath = targets.find(target => file.path.includes(target));
  return {
    path : filePath,
    name : basename(filePath)
  };
}

function handleErrors()
{
  const args = Array.prototype.slice.call(arguments);
  notify.onError({ title: "Compile Error", message: "<%= error.message %>" }).apply(this, args);
  this.emit('end');
}

function notifyBuild()
{
  return isProduction() ? noop() : notify('Build Complete');
}

function minifyJs()
{
  return isProduction() ? uglify() : noop();
}

function minifyCss()
{
  return isProduction()
    ? minify({ convertValues: { length: false }, discardComments: { removeAll: true } })
    : noop();
}

function isProduction()
{
  return env.WP_ENV == 'production';
}

function bundleBrowserify(target)
{
  const path = target.path;

  return gulp.src(`${path}/resources/scripts/${target.filename}`)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(babel())
    .pipe(concat(target.filename))
    .pipe(minifyJs())
    .pipe(gulp.dest(`${path}/vendor`));
}

function compileSass(target)
{
  const path = target.path;
  const [filename, dest] = ['index.css', `${path}/vendor`];

  return gulp.src(`${path}/resources/styles/index.scss`)
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(sass())
             .pipe(prefixer({ browsers: ['> 0.1%'] }))
             .pipe(concat(filename))
             .pipe(minifyCss())
             .pipe(gulp.dest(dest));
}

function buildVendorJs()
{
  const vendors = [
    'node_modules/vue/dist/vue.min.js'
  ];
 
  return gulp.src(vendors)
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(concat('vendor.js'))
             .pipe(minifyJs())
             .pipe(gulp.dest(`${themeDir}/dist`));
}

function buildVendorCss()
{
  const assets = [];

  return gulp.src(assets)
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(concat('vendor.css'))
             .pipe(gulp.dest(`${themeDir}/dist`));
}
