/*
 * This file contains all the input validations for the client Module
 *
 * Author: Aayush Gour
 */
const Joi = require('joi');

const createClientValidator = Joi.object({
    // password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
    //     .required(),
    designation: Joi.string().required(),
    clientName: Joi.string().required(),
    billingAddress: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.number().required(),
    country: Joi.string().required(),
    contactPerson: Joi.string().required(),
    contactEmail: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    panNumber: Joi.string().required(),
    gstin: Joi.string().required(),
    agencyId: Joi.string().required(),
    estimateData: Joi.any().optional(),
});

const updateClientValidator = Joi.object({
    clientName: Joi.string().required(),
    designation: Joi.string().required(),
    billingAddress: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
    ),
    panNumber: Joi.string().required(),
    gstin: Joi.string().required(),
    contactPerson: Joi.string().required(),
    contactNumber: Joi.string().required(),
    clientId: Joi.string().required(),
});

const getClientByIdValidator = Joi.object({
    clientId: Joi.string().required(),
});

const getClientsListValidator = Joi.object({
    agencyId: Joi.string().required(),
});

const markAttendanceValidator = Joi.object({
    // agencyId: Joi.string().required(),
    // clientId: Joi.string().required(),
    // employeeId: Joi.string().required(),
    // assignmentId: Joi.string().required(),
    // inTime: Joi.string().required(),
    // outTime: Joi.string().required(),
    // date: Joi.string().required(),
    attendanceData: Joi.array(),
});

const getAttendanceDataValidator = Joi.object({
    // agencyId: Joi.string().required(),
    clientId: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
});

const getPayoutDataValidator = Joi.object({
    agencyId: Joi.string().required(),
    clientId: Joi.string().required(),
});

const getClientInvoiceDataValidator = Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clientId: Joi.string().required(),
});

const updateEstimateDataValidator = Joi.object({
    clientId: Joi.string().required(),
    agencyId: Joi.string().required(),
    estimateData: Joi.any().required(),
});

const saveInvoiceDataValidator = Joi.object({
    invoiceData: Joi.array(),
});

module.exports = {
    createClientValidator,
    getClientByIdValidator,
    getClientsListValidator,
    updateClientValidator,
    markAttendanceValidator,
    getAttendanceDataValidator,
    getPayoutDataValidator,
    getClientInvoiceDataValidator,
    updateEstimateDataValidator,
    saveInvoiceDataValidator,
};
