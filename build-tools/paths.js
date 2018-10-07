'use strict';

const { resolve, join } = require('path');

const ROOT = resolve(__dirname, '../');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const TEST = join(ROOT, 'test');
const LIB = join(ROOT, 'lib');
const TS_CONFIG = join(ROOT, 'tsconfig.json');
const TS_CONFIG_TEST = join(ROOT, 'tsconfig.test.json');
const TS_CONFIG_WEBPACK = join(ROOT, 'tsconfig.webpack.json');
const PRETTIER_CONFIG = join(ROOT, '.prettierrc.json');
const TSLINT_CONFIG = join(ROOT, 'tslint.json');

module.exports = {
    ROOT,
    SRC,
    DIST,
    TEST,
    LIB,
    TS_CONFIG,
    TS_CONFIG_TEST,
    TS_CONFIG_WEBPACK,
    PRETTIER_CONFIG,
    TSLINT_CONFIG,
};
