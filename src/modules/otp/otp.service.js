/*
 * This file contains all the services related to the user module
 *
 * Author: Aayush Gour
*/

const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const { responseMessages } = require('../../utility/constants');
const { formatResponse } = require('../../utility/response-toolkit');
const { User } = require('../../schema/user');
const { Exception } = require('../../utility/error.toolkit');
const { otpGenerationValidator } = require('./otp.service.validators');

const encryptionService = async (message) => {
    const initVector = Buffer.from(process.env.CIPHER_IV, 'hex');

    const Securitykey = Buffer.from(process.env.CIPHER_KEY, 'hex');

    const cipher = crypto.createCipheriv(process.env.CIPHER_ALGO, Securitykey, initVector);

    let encryptedData = cipher.update(message, 'utf-8', 'hex');

    encryptedData += cipher.final('hex');
    return encryptedData;
};

const decryptionService = async (encryptedData) => {
    const initVector = Buffer.from(process.env.CIPHER_IV, 'hex');

    const Securitykey = Buffer.from(process.env.CIPHER_KEY, 'hex');

    const decipher = crypto.createDecipheriv(process.env.CIPHER_ALGO, Securitykey, initVector);

    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');

    decryptedData += decipher.final('utf8');
    return decryptedData;
};

const otpGenerationService = async (payload) => {
    try {
        const payloadValidation = otpGenerationValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation?.error?.message);
        }
        const userData = await User.findOne({ emailId: payload?.emailId });
        if (userData) {
            const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            const otpObj = {
                // eslint-disable-next-line no-underscore-dangle
                id: userData?._id,
                otp,
                dt: new Date(),
                val: Number(process.env.CIPHER_VALIDITY),
            };
            const encrypted = await encryptionService(JSON.stringify(otpObj));
            return formatResponse(encrypted, 200);
        }
        return formatResponse(responseMessages?.USER_NOT_FOUND, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const otpValidationService = async (payload) => {
    const decrypted = await decryptionService(payload?.message);
    return formatResponse(decrypted, 200);
};
module.exports = {
    otpGenerationService, otpValidationService,
};
