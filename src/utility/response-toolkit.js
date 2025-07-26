/*
 * This is a response toolkit designed to handle the response to an incoming request.
 * Use this toolkit where ever a response has to be returned
 *
 * Author: Aayush Gour
 */
const { Boom } = require('@hapi/boom');
const { Exception } = require('./error.toolkit');
const { logger } = require('./logger');

// eslint-disable-next-line default-param-last
const sendResponse = (serviceResponse, res) => (serviceResponse?.isBoom ? serviceResponse : res?.response(serviceResponse)?.code(serviceResponse?.statusCode));

const formatResponse = (data, code = 500) => {
    const options = {
        data,
        statusCode: code,
    };
    if (code >= 400) {
        const error = new Boom(data, options);
        logger.error(error);
        return error;
    }
    options.isBoom = false;
    return options;
};

const tokenValidationResponse = (isValid, error = {}) => {
    if (isValid) {
        return {
            isValid,
        };
    }
    const err = Exception(error?.message, 401);
    logger.error(err);
    return err;
};

module.exports = {
    sendResponse,
    tokenValidationResponse,
    formatResponse,
};
