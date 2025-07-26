/*
 * This file contains all the input validations for the User Module
 *
 * Author: Aayush Gour
 */
const Joi = require('joi');

const signupInputValidator = Joi.object({
    password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    emailId: Joi.string().email().required(),
    roles: Joi.array().required(),
});
module.exports = {
    signupInputValidator,
};
