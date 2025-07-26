/*
 * This file contains the options for all the Client modules
 *
 * Author: Aayush Gour
 */

const { authName } = require('../../utility/constants');
const {
    createClientValidator, getClientByIdValidator, getClientsListValidator, updateClientValidator, markAttendanceValidator, getAttendanceDataValidator, getPayoutDataValidator, getClientInvoiceDataValidator, updateEstimateDataValidator, saveInvoiceDataValidator, getClientEstimateDataValidator,
} = require('./client.validators');

const createClientOptions = {
    auth: authName,
    tags: ['api', 'client'],
    description: 'Create Client API',
    validate: {
        payload: createClientValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};
const getAllClientsOptions = {
    auth: authName,
    tags: ['api', 'client'],
    description: 'Get all clients API',
    validate: {
        query: getClientsListValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const getClientByIdOptions = {
    auth: authName,
    tags: ['api', 'client'],
    description: 'Get client by client id API',
    validate: { query: getClientByIdValidator },
};

const deleteClientByIdOptions = {
    auth: authName,
    tags: ['api', 'client'],
    description: 'Delete client by client id API',
    validate: { query: getClientByIdValidator },
};

const updateClientByIdOptions = {
    auth: authName,
    tags: ['api', 'client'],
    description: 'Update client by client id API',
    validate: {
        payload: updateClientValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const markAttendanceOptions = {
    auth: authName,
    tags: ['api', 'client', 'attendance'],
    description: 'Mark Employee Attendance',
    validate: {
        payload: markAttendanceValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const getAttendanceDataOptions = {
    auth: authName,
    tags: ['api', 'client', 'attendance'],
    description: 'Get Attendance Data',
    validate: {
        query: getAttendanceDataValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const getPayoutDataOptions = {
    auth: authName,
    tags: ['api', 'client', 'payout'],
    description: 'Get Payout Data',
    validate: {
        query: getPayoutDataValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const getClientInvoiceDataOptions = {
    auth: authName,
    tags: ['api', 'client', 'invoice'],
    description: 'Get Invoice Data',
    validate: {
        query: getClientInvoiceDataValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

const updateEstimateDataOptions = {
    auth: authName,
    tags: ['api', 'client', 'estimate'],
    description: 'update estimate data',
    validate: {
        payload: updateEstimateDataValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};


const saveInvoiceDataOptions = {
    auth: authName,
    tags: ['api', 'client', 'invoice'],
    description: 'save invoice data',
    validate: {
        payload: saveInvoiceDataValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};

module.exports = {
    createClientOptions,
    getAllClientsOptions,
    getClientByIdOptions,
    updateClientByIdOptions,
    deleteClientByIdOptions,
    markAttendanceOptions,
    getAttendanceDataOptions,
    getPayoutDataOptions,
    getClientInvoiceDataOptions,
    updateEstimateDataOptions,
    saveInvoiceDataOptions
};
