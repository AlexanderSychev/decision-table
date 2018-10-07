'use strict';

const { bundleDev, bundleProd, bundleTest } = require('./bundle');
const prettier = require('./prettier');
const clean = require('./clean');
const { compileLib, compileTest } = require('./compile');
const lint = require('./lint');
const tests = require('./tests');
const pug = require('./pug');

module.exports = {
    bundleDev,
    bundleProd,
    bundleTest,
    prettier,
    clean,
    compileLib,
    compileTest,
    lint,
    tests,
    pug
};
