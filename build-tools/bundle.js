'use strict';

const webpack = require('webpack');
const path = require('path')

const { TS_CONFIG_WEBPACK, SRC, LIB, TEST } = require('./paths');

const ENV_DEV = 'development';
const ENV_PROD = 'production';

const makeBundleTask = (
    environment,
    entry = path.join(SRC, 'index.ts'),
    isTest = false
) => (cb) => {
    webpack(
        {
            entry,
            mode: environment,
            output: {
                library: isTest ? undefined : 'dt',
                path: isTest ? TEST : LIB,
                filename: isTest ? 'test.js' : `decision-table.${environment}.js`,
                libraryTarget: isTest ? undefined : 'window'
            },
            module: {
                rules: [
                    {
                        test: /\.tsx?/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                configFile: TS_CONFIG_WEBPACK,
                                onlyCompileBundledFiles: true
                            }
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js', '.json']
            },
            optimization: {
                minimize: environment === ENV_PROD
            },
            externals: (
                isTest ?
                {
                    '../dist': 'dt'
                } :
                undefined
            )
        },
        (err, stats) => {
            if (err) {
                console.err(err);
                cb();
            } else {
                console.log(stats.toString({ colors: true }));
                cb();
            }
        }
    );
};

exports.bundleDev = makeBundleTask(ENV_DEV);
exports.bundleProd = makeBundleTask(ENV_PROD);
exports.bundleTest = makeBundleTask(ENV_DEV, path.join(SRC, 'DecisionTable.test.ts'), true);
