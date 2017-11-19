'use strict';
const path = require('path');
const webpack = require('webpack');
const dirs = require('./dirs');

module.exports = {
    entry: path.join(dirs.DIST, 'DecisionTable.js'),
    output: {
        path: dirs.LIB,
        library: 'dt'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};