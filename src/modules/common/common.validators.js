/*
 * This file contains all the input validations for the client Module
 *
 * Author: Aayush Gour
 */
const Joi = require('joi');

// const referenceValidatorSchema = Joi.object({
//     index: Joi.number().integer(),
//     name: Joi.string().required(),
//     occupation: Joi.string().required(),
//     address: Joi.string().required(),
// });

const createEmployeeValidator = Joi.object({
    name: Joi.string().required(),
    guardian: Joi.string().required(),
    contactNumber: Joi.string().required(),
    dob: Joi.string().required(),
    designation: Joi.string().required(),
    qualification: Joi.string().required(),
    experience: Joi.string().required(),
    permanentAddress: Joi.string().required(),
    presentAddress: Joi.string().required(),
    languages: Joi.string().required(),
    aadharNumber: Joi.string().required(),
    idMarks: Joi.string().required(),
    maritalStatus: Joi.string().required(),
    nomineeName: Joi.string().required(),
    nomineeRelation: Joi.string().required(),
    references: Joi.array(), // .items(referenceValidatorSchema),
    leftThumb1: Joi.object().required(),
    leftThumb2: Joi.object().required(),
    leftThumb3: Joi.object().required(),
    rightThumb1: Joi.object().required(),
    rightThumb2: Joi.object().required(),
    rightThumb3: Joi.object().required(),
    clientId: Joi.string().required(),
});

const getDashboardDataValidator = Joi.object({
    agencyId: Joi.string(),
    allData: Joi.boolean(),
}).xor('agencyId', 'allData');

const getEmployeeByIdValidator = Joi.object({
    employeeId: Joi.string().required(),
});
module.exports = {
    createEmployeeValidator,
    getEmployeeByIdValidator,
    getDashboardDataValidator,
};
