/*
 * This file contains helpers for Error management
 *
 * Author: Aayush Gour
 */

const Exception = (errorObj, statusCode = 500) => {
    const error = new Error(errorObj);
    error.statusCode = statusCode;
    throw error;
};

module.exports = {
    Exception,
};
