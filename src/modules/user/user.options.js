/*
 * This file contains the options for all the user modules
 *
 * Author: Aayush Gour
 */

const { authName } = require('../../utility/constants');
const { signupInputValidator } = require('./user.validators');

const signupOptions = {
    auth: false,
    tags: ['api', 'user'],
    description: 'Signup API',
    validate: { payload: signupInputValidator },
};
const getAllUsersOptions = {
    auth: authName,
    tags: ['api', 'user'],
    description: 'Get all users API',
    // validate: { payload: signupInputValidator },
};

module.exports = {
    signupOptions,
    getAllUsersOptions,
};
