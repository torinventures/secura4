/*
 * Controller for Client Module for the Application
 *
 * Author: Aayush Gour
 */

const { httpProtocols, rolesList, responseMessages } = require('../../utility/constants');
const { checkUserAccess } = require('../../utility/helpers/login-helper');
const { sendResponse, formatResponse } = require('../../utility/response-toolkit');
const { versioned, v1 } = require('../router/routes.versions');
const { clientEndpoints } = require('./client.endpoints');
const {
    createClientOptions, getAllClientsOptions, getClientByIdOptions, updateClientByIdOptions, deleteClientByIdOptions, markAttendanceOptions, getAttendanceDataOptions, getPayoutDataOptions, getClientInvoiceDataOptions, updateEstimateDataOptions, saveInvoiceDataOptions,
} = require('./client.options');
const {
    createClientService, getClientsService, getClientByIdService, updateClientDetailsService, deleteClientByIdService, markAttendanceService, getAttendanceDataService, getClientPayoutDetailsService, getClientInvoiceDataService, updateEstimateDataService, saveInvoiceDataService,
} = require('./client.service');

const createClientHandler = async (req, res) => {
    const payload = req?.payload;
    const serviceResponse = await createClientService(payload);
    return sendResponse(serviceResponse, res);
};

const getClientsHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const { query } = req;
        const serviceResponse = await getClientsService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getClientByIdHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const query = req?.query;
        const serviceResponse = await getClientByIdService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const updateClientByIdHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const payload = req?.payload;
        const serviceResponse = await updateClientDetailsService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const deleteClientByIdHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const query = req?.query;
        const serviceResponse = await deleteClientByIdService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const markEmployeeAttendanceHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.CLIENT]).hasPartialAccess) {
        const { payload } = req;
        const serviceResponse = await markAttendanceService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getAttendanceDataHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.CLIENT]).hasPartialAccess) {
        const { query } = req;
        const serviceResponse = await getAttendanceDataService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getClientPayoutDetailsHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.CLIENT]).hasPartialAccess) {
        const { query } = req;
        const serviceResponse = await getClientPayoutDetailsService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getClientInvoiceDataHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN]).hasStrictAccess) {
        const { query } = req;
        const serviceResponse = await getClientInvoiceDataService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const updateEstimateDataHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN]).hasStrictAccess) {
        const { payload } = req;
        const serviceResponse = await updateEstimateDataService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const saveInvoiceDataHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN]).hasStrictAccess) {
        const { payload } = req;
        const serviceResponse = await saveInvoiceDataService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

module.exports = [
    {
        method: httpProtocols.POST, path: versioned(clientEndpoints.CREATE_CLIENT, v1), options: createClientOptions, handler: createClientHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(clientEndpoints.GET_ALL_CLIENTS, v1), options: getAllClientsOptions, handler: getClientsHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(clientEndpoints.GET_CLIENT_BY_ID, v1), options: getClientByIdOptions, handler: getClientByIdHandler,
    },
    {
        method: httpProtocols.PUT, path: versioned(clientEndpoints.UPDATE_CLIENT_BY_ID, v1), options: updateClientByIdOptions, handler: updateClientByIdHandler,
    },
    {
        method: httpProtocols.DELETE, path: versioned(clientEndpoints.DELETE_CLIENT_BY_ID, v1), options: deleteClientByIdOptions, handler: deleteClientByIdHandler,
    },
    {
        method: httpProtocols.POST, path: versioned(clientEndpoints.MARK_ATTENDANCE, v1), options: markAttendanceOptions, handler: markEmployeeAttendanceHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(clientEndpoints.GET_ATTENDANCE_DATA, v1), options: getAttendanceDataOptions, handler: getAttendanceDataHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(clientEndpoints.GET_PAYMENT_DATA, v1), options: getPayoutDataOptions, handler: getClientPayoutDetailsHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(clientEndpoints.GET_INVOICE_DATA, v1), options: getClientInvoiceDataOptions, handler: getClientInvoiceDataHandler,
    },
    {
        method: httpProtocols.POST, path: versioned(clientEndpoints.UPDATE_ESTIMATE_DATA, v1), options: updateEstimateDataOptions, handler: updateEstimateDataHandler,
    },
    {
        method: httpProtocols.POST, path: versioned(clientEndpoints.SAVE_INVOICE_DATA, v1), options: saveInvoiceDataOptions, handler: saveInvoiceDataHandler,
    },
];
