var less = require('gulp-less');
var path = require('path');
var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('express', function () {
  // Start the server at the beginning of the task 
  server.run(['index.js']);
})

gulp.task('less', function () {
  return gulp.src('./public/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function () {
  gulp.watch(['views/**/*'], server.notify);
  gulp.watch(['routes/*.js','routes/**/*.js'], server.notify);
  gulp.watch(['public/less/**/*.less'], function (event) {
    gulp.run('less');
    server.notify(event);
  });
})


gulp.task('default', ['less', 'express', 'watch'])