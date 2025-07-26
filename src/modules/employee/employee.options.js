/*
 * This file contains the options for all the Client modules
 *
 * Author: Aayush Gour
 */

const { authName } = require('../../utility/constants');
const {
    createEmployeeValidator, getAllEmployeeValidator, getEmployeeByIdValidator, updateEmployeeInsuranceValidator, updateEmployeeValidator, addEmployeeEngagementValidator, getEmployeeEngagementListValidator, getEmployeeSalaryDetailsValidator, updateEmployeeSalaryDetailsValidator,
} = require('./employee.validators');

const createEmployeeOptions = {
    auth: authName,
    tags: ['api', 'employee'],
    description: 'Create Employee API',
    payload: {
        allow: 'multipart/form-data',
        // output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 1000048576,
    },
    validate: {
        payload: createEmployeeValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};
const getAllEmployeeOptions = {
    auth: authName,
    tags: ['api', 'employee'],
    description: 'Get all employee by client id API',
    validate: { query: getAllEmployeeValidator },
};
const getEmployeeByIdOptions = {
    auth: authName,
    tags: ['api', 'employee'],
    description: 'Get employee by employee id API',
    validate: { query: getEmployeeByIdValidator },
};

const deleteEmployeeByIdOptions = {
    auth: authName,
    tags: ['api', 'employee'],
    description: 'Delete employee by employee id API',
    validate: { query: getEmployeeByIdValidator },
};

const updateEmployeeByIdOptions = {
    auth: authName,
    tags: ['api', 'employee'],
    description: 'Update employee by employee id API',
    validate: {
        payload: updateEmployeeValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const getEmployeeInsuranceByIdOptions = {
    auth: authName,
    tags: ['api', 'employee'],
    description: 'Get employee insurance details by employee id API',
    validate: {
        query: getEmployeeByIdValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const updateEmployeeInsuranceOptions = {
    auth: authName,
    tags: ['api', 'employee'],
    description: 'Update employee insurance details by employee id API',
    validate: {
        payload: updateEmployeeInsuranceValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const addEmployeeEngagementOptions = {
    auth: authName,
    tags: ['api', 'employee-assignment'],
    description: 'Assign employee to a client for a period of time',
    validate: {
        payload: addEmployeeEngagementValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const getEmployeeEngagementListOptions = {
    auth: authName,
    tags: ['api', 'employee-assignment'],
    description: 'Get employee Engagement history',
    validate: {
        query: getEmployeeEngagementListValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const getEmployeeSalaryDetailsOptions = {
    auth: authName,
    tags: ['api', 'employee-payroll'],
    description: 'Get employee Salary details',
    validate: {
        query: getEmployeeSalaryDetailsValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const updateEmployeeSalaryDetailsOptions = {
    auth: authName,
    tags: ['api', 'employee-payroll'],
    description: 'Update employee Salary details',
    validate: {
        payload: updateEmployeeSalaryDetailsValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

module.exports = {
    createEmployeeOptions,
    getAllEmployeeOptions,
    getEmployeeByIdOptions,
    getEmployeeInsuranceByIdOptions,
    updateEmployeeInsuranceOptions,
    updateEmployeeByIdOptions,
    deleteEmployeeByIdOptions,
    addEmployeeEngagementOptions,
    getEmployeeEngagementListOptions,
    getEmployeeSalaryDetailsOptions,
    updateEmployeeSalaryDetailsOptions,
};
