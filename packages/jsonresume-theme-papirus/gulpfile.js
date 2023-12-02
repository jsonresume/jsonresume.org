'use strict'

const gulp = require('gulp')
const requireDir = require('require-dir')

requireDir('./gulp/', {recurse: true})

gulp.task('default', ['clean'], function () {
  gulp.start('build')
})
