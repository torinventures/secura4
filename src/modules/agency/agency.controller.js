/*
 * Controller for Agency Module for the Application
 *
 * Author: Aayush Gour
 */

const { httpProtocols, rolesList, responseMessages } = require('../../utility/constants');
const { checkUserAccess } = require('../../utility/helpers/login-helper');
const { sendResponse, formatResponse } = require('../../utility/response-toolkit');
const { versioned, v1 } = require('../router/routes.versions');
const { agencyEndpoints } = require('./agency.endpoints');
const {
    createAgencyOptions, getAllAgencysOptions, getAgencyByIdOptions, updateAgencyByIdOptions,
} = require('./agency.options');
const {
    createAgencyService, getAgenciesService, getAgencyByIdService, updateAgencyByIdService,
} = require('./agency.service');

const createAgencyHandler = async (req, res) => {
    const payload = req?.payload;
    const serviceResponse = await createAgencyService(payload);
    return sendResponse(serviceResponse, res);
};

const getAgenciesHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const serviceResponse = await getAgenciesService();
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getAgencyByIdHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const query = req?.query;
        const serviceResponse = await getAgencyByIdService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const updateAgencyByIdHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const payload = req?.payload;
        const serviceResponse = await updateAgencyByIdService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

module.exports = [
    {
        method: httpProtocols.POST, path: versioned(agencyEndpoints.CREATE_AGENCY, v1), options: createAgencyOptions, handler: createAgencyHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(agencyEndpoints.GET_ALL_AGENCYS, v1), options: getAllAgencysOptions, handler: getAgenciesHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(agencyEndpoints.GET_AGENCY_BY_ID, v1), options: getAgencyByIdOptions, handler: getAgencyByIdHandler,
    },
    {
        method: httpProtocols.PUT, path: versioned(agencyEndpoints.UPDATE_AGENCY_BY_ID, v1), options: updateAgencyByIdOptions, handler: updateAgencyByIdHandler,
    },
];
