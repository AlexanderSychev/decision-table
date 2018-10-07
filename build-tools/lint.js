'use strict';

const path = require('path');
const gulp = require('gulp');
const lint = require('gulp-tslint');

const { TSLINT_CONFIG, SRC } = require('./paths');

module.exports = () => {
    const patterns = [
        path.join(SRC, '**', '*.ts'),
        path.join(SRC, '**', '*.tsx')
    ];
    return gulp.src(patterns)
        .pipe(lint(TSLINT_CONFIG))
        .pipe(lint.report({
            summarizeFailureOutput: true
        }));
}