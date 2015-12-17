var less = require('gulp-less');
var path = require('path');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');



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
})

gulp.task('watch', function () {  
  gulp.watch(['public/less/*.less', 'public/less/**/*.less'], ['less']);
  gulp.watch(['views/**/*.hbs'], ['less']);
})


gulp.task('default', ['less', 'express', 'watch'])