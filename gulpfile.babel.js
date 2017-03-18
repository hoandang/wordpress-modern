/**************************************************
** If you read all the crap below, you're awesome
**         ______ ___ _______ ______
**        / _____|___|_______|_____ \
**       ( (____    _    _     ____) )
**        \____ \  | |  | |   / ____/
**        _____) )_| |_ | |  | (_____
**       (______/(_____)|_|  |_______)
**             https://s1t2.com.au
**************************************************/

import gulp from 'gulp';
import _ from 'lodash';
import browserify from 'browserify';
import vueify from 'vueify';
import plumber from 'gulp-plumber';
import prefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import minify from 'gulp-cssnano';
import filter from 'gulp-filter';
import merge from 'merge-stream';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import notify from 'gulp-notify';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import jpegtran from 'imagemin-jpegtran';
import gutil from 'gulp-util';
import notifier from 'node-notifier';
import {spawn} from 'child_process';
import {basename, extname, dirname} from 'path';
import {ls} from 'shelljs';
import {env} from 'process';

// ALL PLUGIN'S PATHS GO HERE
const targets = [

  'src/themes/s1t2',

].map(target => `${__dirname}/${target}`);

const targetBundles = targets.map(target => `${target}/resources/scripts/**/*`);
const targetStyles = targets.map(target => `${target}/resources/styles/**/*`);
const targetImages = targets.map(target => `${target}/resources/images/**/*`);

gulp.task('watch', watch);

gulp.task('build', build);

gulp.task('default', ['watch']);

// BUILD
function build()
{
  targets.forEach((target) => {

    if (isTargetFromTheme(target)) {
      const files = ls(`${target}/resources/scripts/**/*.*`).filter((path) => !path.includes('components'));

      files.forEach((filePath) => {

        bundleBrowserify({ 
          name : 's1t2', 
          type: extname(filePath) == '.js' ? 'js' : 'vue',
          path : target, 
          fullPath: filePath,
          filename: basename(filePath) 
        });
 
      });
    }
    else {
      bundleBrowserify({ name : 'plugin', type: 'vue', path : target, filename: 'app.vue' });
    }

    compileSass(triggerOther({path: target}));
    optimiseImages(triggerOther({path: target}));

  });
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

  // watch images
  gulp.watch(targetImages).on('change', (file) => {
    console.log('Optimizing ' + basename(file.path));
    optimiseImages(triggerOther(file)).on('end', doneMessage);
  });

  //watch phpunit test
  gulp.watch( 'tests/tests/*.php' ).on('change', (file) => {
    console.log('Testing ' + basename(file.path));
    execute(file.path, 'vendor/bin/./phpunit', 'Test Failed', 'OK');
  });

  //watch php lint
  gulp.watch(['src/plugins/**/*.php', 'src/themes/s1t2/**/*.php']).on('change', (file) => {
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
    gutil.log(data);
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
      name : 's1t2', 
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
    gutil.log(data);
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

function minifyJs()
{
  return env.APP_ENV == 'production' && env.APP_ENV ? uglify() : gutil.noop();
}

function minifyCss()
{
  return env.APP_ENV == 'production' && env.APP_ENV 
    ? minify({ convertValues: { length: false }, discardComments: { removeAll: true } })
    : gutil.noop();
}

function minifyImages()
{

  return env.APP_ENV == 'production' && env.APP_ENV
    ? imagemin({ progressive : true, use : [
          pngquant({ quality: '65-80', speed: 4 }),
          jpegtran({ progressive: true })
        ]
      })
    : gutil.noop();
}

function bundleBrowserify(target)
{
  const path = target.path;

  if (target.name == 's1t2' && target.type == 'js') {
    return gulp.src(`${path}/resources/scripts/${target.filename}`)
               .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
               .pipe(babel())
               .pipe(concat(target.filename))
               .pipe(minifyJs())
               .pipe(gulp.dest(`${path}/vendor`));
  }

  const entry = target.name == 's1t2'
    ? target.fullPath
    : `${path}/resources/scripts/index.vue`;

  const destination = target.name == 's1t2'
    ? `${path}/vendor/` + getVueEntryDir(target.fullPath)
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
    .pipe(gulp.dest(destination));
}

function getVueEntryIndex(path)
{
  if (path.includes('index.vue')) return path;

  return path.substr(0, path.indexOf('components')) + 'index.vue';
}

function getVueEntryDir(path)
{
  return dirname(path).match(/([^\/]*)\/*$/)[1];
}

function compileSass(target)
{
  const path = target.path;

  let [filename, dest] = ['index.css', `${path}/vendor`];

  if (target.name == 's1t2') {
    [filename, dest] = ['style.css', path];
  }

  return gulp.src(`${path}/resources/styles/index.scss`)
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(sass())
             .pipe(prefixer({ browsers: ['last 2 version'] }))
             .pipe(concat(filename))
             .pipe(minifyCss())
             .pipe(gulp.dest(dest));
}

function optimiseImages(target)
{
  const path = target.path;

  return gulp.src(`${path}/resources/images/**/*`)
             .pipe(minifyImages())
             .pipe(gulp.dest(`${path}/images/`));
}
