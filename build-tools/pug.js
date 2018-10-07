'use strict';

const pug = require('gulp-pug');
const path = require('path');
const gulp = require('gulp');

const { SRC, TEST } = require('./paths');

module.exports = () => {
    const srcFile = path.join(SRC, 'test.pug');
    return gulp.src(srcFile).pipe(pug()).pipe(gulp.dest(TEST));
};
