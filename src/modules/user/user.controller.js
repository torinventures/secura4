/*
 * Controller for User Module for the Application
 *
 * Author: Aayush Gour
 */

const { httpProtocols, rolesList, responseMessages } = require('../../utility/constants');
const { checkUserAccess } = require('../../utility/helpers/login-helper');
const { sendResponse, formatResponse } = require('../../utility/response-toolkit');
const { versioned, v1 } = require('../router/routes.versions');
const { userEndpoints } = require('./user.endpoints');
const { signupOptions, getAllUsersOptions } = require('./user.options');
const { signupService, getUsersService } = require('./user.service');

const signupHandler = async (req, res) => {
    const payload = req?.payload;
    const serviceResponse = await signupService(payload);
    return sendResponse(serviceResponse, res);
};

const getUsersHandler = async (req, res) => {
    const { id, roles } = req.auth.credentials;
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN, rolesList.CLIENT]).hasPartialAccess) {
        const serviceResponse = await getUsersService(roles, id);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

module.exports = [
    {
        method: httpProtocols.POST, path: userEndpoints.SIGNUP, options: signupOptions, handler: signupHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(userEndpoints.GET_ALL_USERS, v1), options: getAllUsersOptions, handler: getUsersHandler,
    },
];
