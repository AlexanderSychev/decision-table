const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, 'dist', 'DecisionTable.js'),
    output: {
        filename: 'decision-table.js',
        path: path.join(__dirname, 'lib'),
        library: 'dt'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};