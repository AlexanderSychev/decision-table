'use strict';

const gulp = require('gulp');
const sequence = require('gulp-sequence');

const {
    bundleDev,
    bundleProd,
    bundleTest,
    clean,
    compileLib,
    compileTest,
    lint,
    prettier,
    tests,
    pug
} = require('./build-tools');

gulp.task('bundle:dev', bundleDev);
gulp.task('bundle:prod', bundleProd);
gulp.task('bundle:test', bundleTest);
gulp.task('clean', clean);
gulp.task('compile:lib', compileLib);
gulp.task('compile:test', compileTest);
gulp.task('lint', lint);
gulp.task('prettier', prettier);
gulp.task('pug', pug);
gulp.task('tests', tests);

gulp.task('comb', sequence('prettier', 'lint'));
gulp.task('build-lib', ['compile:lib', 'bundle:dev', 'bundle:prod']);
gulp.task('build-test', ['compile:test', 'bundle:test', 'pug']);
gulp.task('build', sequence('build-lib', 'build-test'));
gulp.task('clean-and-comb', ['comb', 'clean'])
gulp.task('main', sequence('clean-and-comb', 'build'));
