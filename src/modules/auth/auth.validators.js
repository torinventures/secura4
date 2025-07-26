/*
 * This file contains all the input validations for the Authentication Module
 *
 * Author: Aayush Gour
 */
const Joi = require('joi');

const loginInputValidator = Joi.object({
    emailId: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
});

const refreshTokenValidator = Joi.object({
    refreshToken: Joi.string().min(3)
        .required(),
});

module.exports = {
    loginInputValidator,
    refreshTokenValidator,
};
