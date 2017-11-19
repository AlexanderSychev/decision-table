'use strict';
const webpack = require('webpack');

module.exports = {
    output: {
        filename: 'decision-table.prod.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};