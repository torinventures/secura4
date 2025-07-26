/*
 * Controller for Employee Module for the Application
 *
 * Author: Aayush Gour
 */

const { httpProtocols, rolesList, responseMessages } = require('../../utility/constants');
const { checkUserAccess } = require('../../utility/helpers/login-helper');
const { sendResponse, formatResponse } = require('../../utility/response-toolkit');
const { versioned, v1 } = require('../router/routes.versions');
const { employeeEndpoints } = require('./employee.endpoints');
const {
    createEmployeeOptions, getAllEmployeeOptions, getEmployeeByIdOptions, getEmployeeInsuranceByIdOptions, updateEmployeeInsuranceOptions, updateEmployeeByIdOptions, deleteEmployeeByIdOptions, addEmployeeEngagementOptions, getEmployeeEngagementListOptions, getEmployeeSalaryDetailsOptions, updateEmployeeSalaryDetailsOptions,
} = require('./employee.options');
const {
    createEmployeeService, getEmployeesService, getEmployeeByIdService, getEmployeeInsuranceDetailsService, updateEmployeeInsuranceFormService, updateEmployeeDetailsService, deleteEmployeeByIdService, addEmployeeEngagementService, getEmployeeEngagementListService, getEmployeesSalaryDetailsService, updateSalaryDetailsService,
} = require('./employee.service');

const createEmployeeHandler = async (req, res) => {
    const payload = req?.payload;
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN, rolesList.CLIENT]).hasPartialAccess) {
        const serviceResponse = await createEmployeeService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getEmployeesHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN, rolesList.CLIENT]);
    if (userAccess?.hasPartialAccess) {
        const { query } = req;
        const scopeList = req.auth?.credentials?.roles;
        const serviceResponse = await getEmployeesService(query, scopeList);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const updateEmployeeDetailsHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]);
    if (userAccess?.hasPartialAccess) {
        const { payload } = req;
        const serviceResponse = await updateEmployeeDetailsService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getEmployeeByIdHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN, rolesList.CLIENT]).hasPartialAccess) {
        const query = req?.query;
        const serviceResponse = await getEmployeeByIdService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const deleteEmployeeByIdHandler = async (req, res) => {
    if (checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]).hasPartialAccess) {
        const query = req?.query;
        const serviceResponse = await deleteEmployeeByIdService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getEmployeeInsuranceHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]);
    if (userAccess?.hasPartialAccess) {
        const { query } = req;
        const serviceResponse = await getEmployeeInsuranceDetailsService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const updateEmployeeInsuranceHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]);
    if (userAccess?.hasPartialAccess) {
        const { payload } = req;
        const serviceResponse = await updateEmployeeInsuranceFormService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const addEmployeeEngagementHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]);
    if (userAccess?.hasPartialAccess) {
        const { payload } = req;
        const serviceResponse = await addEmployeeEngagementService(payload);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getEmployeeEngagementListHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.SUPERADMIN]);
    if (userAccess?.hasPartialAccess) {
        const { query } = req;
        const serviceResponse = await getEmployeeEngagementListService(query);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const getEmployeeSalaryDetailsHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.CLIENT]);
    if (userAccess?.hasPartialAccess) {
        const { query } = req;
        const serviceResponse = await getEmployeesSalaryDetailsService(query, userAccess?.accessList);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

const updateEmployeeSalaryDetailsHandler = async (req, res) => {
    const userAccess = checkUserAccess(req, [rolesList.ADMIN, rolesList.CLIENT]);
    if (userAccess?.hasPartialAccess) {
        const { payload } = req;
        const serviceResponse = await updateSalaryDetailsService(payload, userAccess?.accessList);
        return sendResponse(serviceResponse, res);
    }
    return sendResponse(formatResponse(responseMessages.USER_DOES_NOT_HAVE_ACCESS, 403));
};

module.exports = [
    {
        method: httpProtocols.POST, path: versioned(employeeEndpoints.CREATE_EMPLOYEE, v1), options: createEmployeeOptions, handler: createEmployeeHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(employeeEndpoints.GET_ALL_EMPLOYEES, v1), options: getAllEmployeeOptions, handler: getEmployeesHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(employeeEndpoints.GET_EMPLOYEE_BY_ID, v1), options: getEmployeeByIdOptions, handler: getEmployeeByIdHandler,
    },
    {
        method: httpProtocols.POST, path: versioned(employeeEndpoints.UPDATE_EMPLOYEE_BY_ID, v1), options: updateEmployeeByIdOptions, handler: updateEmployeeDetailsHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(employeeEndpoints.GET_EMPLOYEE_INSURANCE_BY_ID, v1), options: getEmployeeInsuranceByIdOptions, handler: getEmployeeInsuranceHandler,
    },
    {
        method: httpProtocols.POST, path: versioned(employeeEndpoints.UPDATE_EMPLOYEE_INSURANCE_BY_ID, v1), options: updateEmployeeInsuranceOptions, handler: updateEmployeeInsuranceHandler,
    },
    {
        method: httpProtocols.DELETE, path: versioned(employeeEndpoints.DELETE_EMPLOYEE_BY_ID, v1), options: deleteEmployeeByIdOptions, handler: deleteEmployeeByIdHandler,
    },
    {
        method: httpProtocols.POST, path: versioned(employeeEndpoints.ADD_EMPLOYEE_ENGAGEMENT, v1), options: addEmployeeEngagementOptions, handler: addEmployeeEngagementHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(employeeEndpoints.GET_EMPLOYEE_ENGAGEMENT_LIST, v1), options: getEmployeeEngagementListOptions, handler: getEmployeeEngagementListHandler,
    },
    {
        method: httpProtocols.GET, path: versioned(employeeEndpoints.GET_EMPLOYEES_SALARY_DETAILS, v1), options: getEmployeeSalaryDetailsOptions, handler: getEmployeeSalaryDetailsHandler,
    },
    {
        method: httpProtocols.PUT, path: versioned(employeeEndpoints.UPDATE_EMPLOYEES_SALARY_DETAILS, v1), options: updateEmployeeSalaryDetailsOptions, handler: updateEmployeeSalaryDetailsHandler,
    },
];
