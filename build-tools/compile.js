'use strict';

const gulp = require('gulp');
const typescript = require('typescript');
const ts = require('gulp-typescript');
const path = require('path');
const merge2 = require('merge2');

const { TS_CONFIG, TS_CONFIG_TEST, TEST, SRC, DIST } = require('./paths');

exports.compileLib = () => {
    const srcPattern = [
        path.join(SRC, '**/*.ts'),
        `!${path.join(SRC, '**', '*.test.ts')}`
    ];
    const project = ts.createProject(TS_CONFIG, { typescript });
    const tsResult = gulp.src(srcPattern).pipe(project());
    return merge2([
        tsResult.dts.pipe(gulp.dest(DIST)),
        tsResult.js.pipe(gulp.dest(DIST))
    ]);
}

exports.compileTest = () => {
    const srcPattern = path.join(SRC, '**', '*.test.ts');
    const project = ts.createProject(TS_CONFIG_TEST, { typescript });
    const tsResult = gulp.src(srcPattern).pipe(project());
    return merge2([
        tsResult.dts.pipe(gulp.dest(TEST)),
        tsResult.js.pipe(gulp.dest(TEST))
    ]);
};
