/*
 * This file contains all the services for the Authentication Module
 *
 * Author: Aayush Gour
 */
const Jwt = require('@hapi/jwt');
const { User } = require('../../schema/user');
const { responseMessages, rolesList } = require('../../utility/constants');
const { formatResponse } = require('../../utility/response-toolkit');
const { generateToken, verifyToken } = require('./token.service');
const { comparePassword } = require('./hashing.service');
const { loginInputValidator, refreshTokenValidator } = require('./auth.validators');
const { Exception } = require('../../utility/error.toolkit');
const { Client } = require('../../schema/client');
const { Agency } = require('../../schema/agency');

const { TOKEN_TIMEOUT } = process.env;
const { REFRESH_TOKEN_TIMEOUT } = process.env;
const { HASHING_KEY } = process.env;
const { REFRESH_TOKEN_KEY } = process.env;

const loginService = async (payload) => {
    try {
        const paramValidation = loginInputValidator.validate(payload);
        if (paramValidation?.error) {
            throw Exception(paramValidation?.error?.message, 400);
        }
        const userData = await User.findOne({ emailId: payload?.emailId });
        if (userData) {
            // check password and generate tokens
            const result = await comparePassword(payload?.password, userData?.password);
            if (result) {
                // generate tokens
                const creds = { id: userData?.id, emailId: userData?.emailId, roles: userData?.roles };
                const token = generateToken(creds, HASHING_KEY, TOKEN_TIMEOUT);
                const refreshToken = generateToken(creds, REFRESH_TOKEN_KEY, REFRESH_TOKEN_TIMEOUT);
                const responsePayload = {
                    token, refreshToken, roles: userData?.roles,
                };
                if (userData?.roles?.includes(rolesList.CLIENT)) {
                    const clientData = await Client.findOne({ userId: userData?.id });
                    responsePayload.clientId = clientData?._id;
                }
                if (userData?.roles?.includes(rolesList.ADMIN)) {
                    const agencyData = await Agency.findOne({ userId: userData?.id });
                    responsePayload.agencyId = agencyData?._id;
                }
                return formatResponse(responsePayload, 200);
            }
            return formatResponse(responseMessages.INVALID_CREDENTIALS, 401);
        }
        // User not found
        return formatResponse(responseMessages.USER_NOT_FOUND, 401);
    } catch (error) {
        return formatResponse(error, error?.statusCode || 400);
    }
};

const refreshTokenService = async (query) => {
    try {
        const queryValidation = refreshTokenValidator.validate(query);
        if (queryValidation?.error) {
            throw Exception(queryValidation.error?.message, 400);
        }
        const queryRefreshToken = query?.refreshToken;
        const decodedToken = Jwt.token.decode(queryRefreshToken);
        verifyToken(decodedToken, REFRESH_TOKEN_KEY);
        // generate new tokens
        const userData = await User?.findOne({ emailId: decodedToken?.decoded?.payload?.emailId });
        const creds = { id: userData?.id, emailId: userData?.emailId, roles: userData?.roles };
        const token = generateToken(creds, HASHING_KEY, TOKEN_TIMEOUT);
        const refreshToken = generateToken(creds, REFRESH_TOKEN_KEY, REFRESH_TOKEN_TIMEOUT);
        const responsePayload = {
            token, refreshToken,
        };
        return formatResponse(responsePayload, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode || 400);
    }
};

module.exports = {
    loginService,
    refreshTokenService,
};
