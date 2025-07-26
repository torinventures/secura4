/*
 * Controller for Common Modules in the Application
 *
 * Author: Aayush Gour
 */

const { httpProtocols, rolesList, responseMessages } = require('../../utility/constants');
const { checkUserAccess } = require('../../utility/helpers/login-helper');
const { sendResponse, formatResponse } = require('../../utility/response-toolkit');
const { versioned, v1 } = require('../router/routes.versions');
const { commonEndpoints } = require('./common.endpoints');
const { dashboardDataOptions } = require('./common.options');
const { dashboardDataService } = require('./common.service');

const getDashboardData = async (req, res) => {
    const { query } = req;
    const scopeList = req.auth?.credentials?.roles;
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN, rolesList.CLIENT]).hasPartialAccess) {
        const serviceResponse = await dashboardDataService(query, scopeList);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

// const getEmployeesHandler = async (req, res) => {
//     const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN, rolesList.CLIENT]);
//     if (userAccess?.hasPartialAccess) {
//         const { query } = req;
//         const scopeList = req.auth?.credentials?.roles;
//         const serviceResponse = await getEmployeesService(query, scopeList);
//         return sendResponse(serviceResponse, res);
//     }
//     return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
// };

// const getEmployeeByIdHandler = async (req, res) => {
//     if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN, rolesList.CLIENT]).hasPartialAccess) {
//         const query = req?.query;
//         const serviceResponse = await getEmployeeByIdService(query);
//         return sendResponse(serviceResponse, res);
//     }
//     return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
// };

module.exports = [
    {
        method: httpProtocols.GET, path: versioned(commonEndpoints.GET_DASHBOARD_DATA, v1), options: dashboardDataOptions, handler: getDashboardData,
    },
    // {
    //     method: httpProtocols.GET, path: versioned(commonEndpoints.GET_ALL_EMPLOYEES, v1), options: getAllEmployeeOptions, handler: getEmployeesHandler,
    // },
    // {
    //     method: httpProtocols.GET, path: versioned(employeeEndpoints.GET_EMPLOYEE_BY_ID, v1), options: getEmployeeByIdOptions, handler: getEmployeeByIdHandler,
    // },
];
