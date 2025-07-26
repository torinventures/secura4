/*
 * This file contains token generation, verification and validation services
 *
 * Author: Aayush Gour
 */
const Jwt = require('@hapi/jwt');
const { User } = require('../../schema/user');
const { tokenValidationResponse, sendResponse, formatResponse } = require('../../utility/response-toolkit');

const verifyToken = (decodedToken, secret, options) => {
    try {
        Jwt.token.verify(decodedToken, secret, options);
        return tokenValidationResponse(true);
    } catch (error) {
        return tokenValidationResponse(false, error);
    }
};

const generateToken = (payload, secretKey, ttl) => Jwt.token.generate(
    payload,
    {
        key: secretKey,
        algorithm: 'HS512',
    },
    {
        now: new Date().getTime(),
        ttlSec: Number(ttl),
    },
);

const validateToken = async (artifact) => {
    try {
        const { HASHING_KEY } = process.env;
        const decodedToken = Jwt.token.decode(artifact?.token);
        if (verifyToken(decodedToken, HASHING_KEY)) {
            const userData = await User?.findOne({ emailId: decodedToken?.decoded?.payload?.emailId });
            if (userData) {
                // const result = await comparePassword(payload?.password, userData?.password);
                const credentials = { id: userData?.id, name: userData?.emailId, roles: userData?.roles };
                return { isValid: true, credentials };
            }
        }
        return { credentials: null, isValid: false };
    } catch (error) {
        return sendResponse(formatResponse(error, error?.statusCode || 401), null);
    }
};

module.exports = {
    verifyToken,
    generateToken,
    validateToken,
};
