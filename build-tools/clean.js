'use strict';

const $rimraf = require('rimraf');
const $mkdirp = require('mkdirp');

const { DIST, LIB, TEST } = require('./paths');

/**
 * Promisified "rimraf"
 * @param {string} directory
 * @return {Promise<void>} 
 */
const rimraf = (directory) => new Promise(
    (resolve, reject) => $rimraf(directory, err => err ? reject(err) : resolve())
);

/**
 * Promisified "mkdirp"
 * @param {string} directory
 * @return {Promise<void>} 
 */
const mkdirp = (directory) => new Promise(
    (resolve, reject) => $mkdirp(directory, err => err ? reject(err) : resolve())
);

module.exports = async () => {
    const dirs = [ DIST, LIB, TEST ];
    await Promise.all(dirs.map(dir => rimraf(dir)));
    await Promise.all(dirs.map(dir => mkdirp(dir)));
};