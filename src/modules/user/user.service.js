/*
 * This file contains all the services related to the user module
 *
 * Author: Aayush Gour
 */

const { User } = require('../../schema/user');
const { responseMessages, rolesList } = require('../../utility/constants');
const { Exception } = require('../../utility/error.toolkit');
const { formatResponse } = require('../../utility/response-toolkit');
const { hashPassword } = require('../auth/hashing.service');
const { signupInputValidator } = require('./user.validators');

const signupService = async (payload) => {
    /* Check if user exists,
     * true: user exists
     * false: create user
     */
    try {
        const payloadValidation = signupInputValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const userData = await User.findOne({ emailId: payload?.emailId });
        if (userData) {
            return formatResponse(responseMessages.USER_ALREADY_EXISTS, 400);
        }
        const userDetails = {
            password: await hashPassword(payload?.password),
            emailId: payload?.emailId,
            createdDate: new Date(),
            roles: payload?.roles,
        };
        const newUserObject = new User(userDetails);
        const newUser = await User.create(newUserObject);
        return formatResponse({ id: newUser?._id, message: responseMessages.USER_CREATED }, 201);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getUsersService = async (roles, userId) => {
    try {
        // const options = { roles: { $in: [rolesList.USER] } };
        const options = {};
        if (roles?.includes(rolesList.CLIENT)) {
            options.clientId = userId;
        }
        const usersList = await User.find(options).select('-password');
        if (usersList) {
            return formatResponse({ data: usersList }, 200);
        }
        return formatResponse({ data: [], message: responseMessages.NO_USERS_FOUND }, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

module.exports = {
    signupService,
    getUsersService,
};
