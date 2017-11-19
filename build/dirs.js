'use strict';
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const LIB = path.join(ROOT, 'lib');

module.exports = {
    ROOT,
    DIST,
    LIB,
    SRC
};