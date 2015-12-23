'use strict';

var less = require('gulp-less');
var path = require('path');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var del = require('del');

gulp.task('less', function () {
  return gulp.src('./public/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('express', function () {
  nodemon({
    script: './index.js',
    ext: 'js',
    tasks: ['less']
  });
});

gulp.task('pre-test', function () {
  del.sync(['shippable']);
  return gulp.src(['lib/**/*.js'])
  // Covering files 
    .pipe(istanbul())
  // Force `require` to return covered files 
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  process.env['XUNIT_FILE'] = './shippable/testresults/result.xml';
  return gulp.src(['tests/*.js'])
    .pipe(mocha({
      globals: ["should"],
      timeout: 3000,
      ignoreLeaks: false,
      ui: "bdd",
      reporter: "xunit-file"      
    }))
  // Creating the reports after tests ran 
    .pipe(istanbul.writeReports({
      dir: './shippable/codecoverage'
    }))
  // Enforce a coverage of at least 90% 
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task('watch', function () {
  gulp.watch(['public/less/*.less', 'public/less/**/*.less'], ['less']);
  gulp.watch(['views/**/*.hbs'], ['less']);
});

gulp.task('default', ['less', 'express', 'watch']);