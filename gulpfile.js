/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false, unused:true */
'use strict';

//  -- requirements --
var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var nib = require('nib');
var del = require('del');
var webserver = require('gulp-connect');

var config = {
  sources: {
    'jade': 'template/*.jade',
    'stylus': 'template/static/css/*.styl',
    'images': 'template/static/img/**/*'
  },
  outputs: {
    'base': 'output',
    'css': 'output/static/css',
    'img': 'output/static/img'
  }
};


//  -- cleaning output dir --
gulp.task('clean', function(cb) {
  del(['output', 'offline'], cb);
});


//  -- compiling jade files --
gulp.task('templates', function () {
  return gulp
    .src(config.sources.jade, {path: './'})
    .pipe( jade({ 'pretty': false }) )
      .on('error', function (err) {
        gutil.log('\n === jade error!! ===\n', gutil.colors.red(err));
        this.emit('end');
      })
    .pipe(gulp.dest(config.outputs.base));
});


//  -- compiling stylus files --
gulp.task('styles', function () {
  return gulp
    .src(config.sources.stylus, {path: './'})
    .pipe(stylus({ use: nib(), compress: true }))
      .on('error', function (err) {
        gutil.log('\n === stylus error!! ===\n', gutil.colors.cyan(err));
        this.emit('end');
      })
    .pipe(gulp.dest(config.outputs.css));
});


//  -- move images --
gulp.task('images', function () {
  return gulp
    .src(config.sources.images, {path: './'})
    .pipe(gulp.dest(config.outputs.img));
});


//  -- server --
gulp.task('server', function () {
  webserver.server({
    root: __dirname + '/output/',
    port: process.env.PORT || 3000,
    host: process.env.HOSTNAME || '0.0.0.0'
  });
});


//  -- watch file changes --
gulp.task('watch', function () {
  gulp.watch([config.sources.jade], ['templates']);
  gulp.watch([config.sources.stylus], ['styles']);
  gulp.watch([config.sources.images], ['images']);
});


//  -- magic! --
gulp.task('default', ['templates', 'styles', 'images', 'server', 'watch']);


//  -- deploy to gh-pages branch --
/*
  If you haven't yet a gh-pages branch:
  . git checkout --orphan gh-pages
  . git rm -rf .
  . touch README.md
  . git add README.md
  . git commit -m "Setup gh-pages branch"
  . git push --set-upstream origin gh-pages
  . git checkout master
*/
gulp.task('deploy', function () {
  gulp
    .src([
      __dirname + '/output/**/*',
      __dirname + '/CNAME'
    ])
    .pipe(
      deploy()
    );
});