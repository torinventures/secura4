/*
 * This file contains all the input validations for the OTP Module
 *
 * Author: Aayush Gour
 */
const Joi = require('joi');

const otpGenerationValidator = Joi.object({
    emailId: Joi.string().email().required(),
});
module.exports = {
    otpGenerationValidator,
};
