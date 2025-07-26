/*
 * This file contains the options for all the Client modules
 *
 * Author: Aayush Gour
 */

const { authName } = require('../../utility/constants');
const { getAllEmployeeValidator, getEmployeeByIdValidator, getDashboardDataValidator } = require('./common.validators');

const dashboardDataOptions = {
    auth: authName,
    tags: ['api', 'dashboard'],
    description: 'Get Dashboard stats API',
    validate: { query: getDashboardDataValidator },
};

const getAllEmployeeOptions = {
    auth: authName,
    tags: ['api', 'client'],
    description: 'Get all employee by client id API',
    validate: { query: getAllEmployeeValidator },
};
const getEmployeeByIdOptions = {
    auth: authName,
    tags: ['api', 'client'],
    description: 'Get employee by employee id API',
    validate: { query: getEmployeeByIdValidator },
};

module.exports = {
    dashboardDataOptions,
    getAllEmployeeOptions,
    getEmployeeByIdOptions,
};
