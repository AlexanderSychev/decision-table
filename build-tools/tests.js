'use strict';

const path = require('path');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

const { TEST } = require('./paths');

module.exports = () => {
    const patterns = path.join(TEST, '**', '*.test.js');
    return gulp.src(patterns, { read: false }).pipe(mocha());
};
