'use strict';

const gulp = require('gulp');
const prettier = require('gulp-prettier');
const path = require('path');

const { PRETTIER_CONFIG, SRC } = require('./paths');

const CONFIG = require(PRETTIER_CONFIG);

module.exports = () => {
    const patterns = [
        path.join(SRC, '**', '*.ts'),
        path.join(SRC, '**', '*.tsx')
    ];
    return gulp.src(patterns)
        .pipe(prettier(CONFIG))
        .pipe(gulp.dest(SRC));
};
