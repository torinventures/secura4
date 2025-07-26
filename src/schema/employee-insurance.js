/*
 * This file contains the employee insurance Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const employeeInsuranceSchema = new mongoose.Schema({
    employeeId: {
        type: ObjectId,
        required: true,
        ref: 'Employee',
        unique: true,
    },
    insuranceNo: {
        type: String,
        required: true,
    },
    branchOffice: {
        type: String,
        required: true,
    },
    dispensary: {
        type: String,
        required: true,
    },
    employerCode: {
        type: String,
        required: true,
    },
    employersNameAddress: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: new Date(),
    },
    editedDate: {
        type: Date,
        default: new Date(),
    },
});

const EmployeeInsurance = mongoose.model('employee_insurance', employeeInsuranceSchema, process.env?.EMPLOYEE_INSURANCE_COLLECTION);

module.exports = {
    EmployeeInsurance,
};
