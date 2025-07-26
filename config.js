/*
 *   Configuration file for node environment file name/path
 *
 *   Author: Aayush
 */
const dotenv = require('dotenv');
const path = require('path');

const nodeEnv = process.env?.NODE_ENV ? process.env?.NODE_ENV : 'development';

dotenv.config({
    path: path.resolve(__dirname, `.${nodeEnv}.env`),
});

module.exports = {
    NODE_ENV: nodeEnv,
};
