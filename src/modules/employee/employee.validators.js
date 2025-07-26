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
    panNumber: Joi.string().required(),
    idMarks: Joi.string().required(),
    maritalStatus: Joi.string().required(),
    // nomineeName: Joi.string().required(),
    // nomineeRelation: Joi.string().required(),
    // nomineeDob: Joi.string().required(),
    // nomineeAddress: Joi.string().required(),
    appointmentDate: Joi.string().required(),
    sex: Joi.string().required(),
    oldEsiNumber: Joi.string(),
    familyDetails: Joi.array(),
    references: Joi.array(), // .items(referenceValidatorSchema),
    leftThumb1: Joi.object().required(),
    leftThumb2: Joi.object().required(),
    leftThumb3: Joi.object().required(),
    rightThumb1: Joi.object().required(),
    rightThumb2: Joi.object().required(),
    rightThumb3: Joi.object().required(),
    agencyId: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.string().required(),
    uanNumber: Joi.string().required(),
    nomineeDetails: Joi.array().required(),
    // clientId: Joi.string().required(),
});

const getAllEmployeeValidator = Joi.object({
    agencyId: Joi.string(),
    allData: Joi.boolean(),
}).xor('agencyId', 'allData');

const getEmployeeByIdValidator = Joi.object({
    employeeId: Joi.string().required(),
});

const updateEmployeeInsuranceValidator = Joi.object({
    employeeId: Joi.string().required(),
    insuranceNo: Joi.string().required(),
    branchOffice: Joi.string().required(),
    dispensary: Joi.string().required(),
    employerCode: Joi.string().required(),
    employersNameAddress: Joi.string().required(),
});

const addEmployeeEngagementValidator = Joi.object({
    employeeId: Joi.string().required(),
    clientId: Joi.string().required(),
    agencyId: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    salaryDetails: Joi.any().required(),
});
const getEmployeeEngagementListValidator = Joi.object({
    employeeId: Joi.string().required(),
    agencyId: Joi.string().required(),
});

const getEmployeeSalaryDetailsValidator = Joi.object({
    // employeeId: Joi.string().required(),
    agencyId: Joi.string().required(),
});

const updateEmployeeSalaryDetailsValidator = Joi.object({
    agencyId: Joi.string().required(),
    salaryDetails: Joi.array().required(),
    // salary: Joi.string().required(),
    // earnedLeave: Joi.string().required(),
    // washingAllowance: Joi.string().required(),
    // esi: Joi.string().required(),
    // pf: Joi.string().required(),
    // uniformCharges: Joi.string().required(),
    // additionalAllowance: Joi.string().required(),
});

const updateEmployeeValidator = Joi.object({
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
    // nomineeName: Joi.string().required(),
    // nomineeRelation: Joi.string().required(),
    // nomineeDob: Joi.string().required(),
    // nomineeAddress: Joi.string().required(),
    nomineeDetails: Joi.array().required(),
    oldEsiNumber: Joi.string().allow(''),
    panNumber: Joi.string()?.required(),
    sex: Joi.string()?.required(),
    familyDetails: Joi.array(),
    references: Joi.array(), // .items(referenceValidatorSchema),
    _id: Joi.string().required(),
});// .options({ stripUnknown: true });

module.exports = {
    createEmployeeValidator,
    getEmployeeByIdValidator,
    getAllEmployeeValidator,
    updateEmployeeInsuranceValidator,
    updateEmployeeValidator,
    addEmployeeEngagementValidator,
    getEmployeeEngagementListValidator,
    getEmployeeSalaryDetailsValidator,
    updateEmployeeSalaryDetailsValidator,
};
