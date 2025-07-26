/*
 * This file contains the options required for the endpoint configuration for the Authentication Module
 *
 * Author: Aayush Gour
 */
const { loginInputValidator, refreshTokenValidator } = require('./auth.validators');

const loginOptions = {
    auth: false,
    tags: ['api', 'auth'],
    description: 'Login API',
    validate: { payload: loginInputValidator },
};

const refreshTokenOptions = {
    auth: false,
    tags: ['api', 'auth'],
    description: 'Refresh Token API',
    validate: { query: refreshTokenValidator },
};

module.exports = {
    loginOptions, refreshTokenOptions,
};
