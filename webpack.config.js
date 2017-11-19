const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./build/webpack.base');
const targetConfig = (
    process.env.NODE_ENV === 'production' ? require('./build/webpack.prod') : require('./build/webpack.dev')
);

module.exports = merge(baseConfig, targetConfig);