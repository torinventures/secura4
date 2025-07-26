/*
 * This file contains the Salary Schema and validations
 *
 * Author: Aayush Gour
 */

const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: ObjectId,
        required: true,
    },
    assignmentId: {
        type: ObjectId,
        ref: 'employee_engagement',
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    additionalAllowance: {
        type: Number,
        required: true,
    },
    washingAllowance: {
        type: Number,
        required: true,
    },
    uniformCharges: {
        type: Number,
        required: true,
    },
    esi: {
        type: Number,
        required: true,
    },
    earnedLeave: {
        type: Number,
        required: true,
    },
    nfh: {
        type: Number,
        required: true,
    },
    bonus: {
        type: Number,
        required: true,
    },
    // relievingCharges: {
    //     type: Number,
    //     required: true,
    // },
    // serviceCharges: {
    //     type: Number,
    //     required: true,
    // },
    // total: {
    //     type: Number,
    //     required: true,
    // },
    pf: {
        type: Number,
        required: true,
    },
});

const Salary = mongoose.model('salary', salarySchema, process.env?.SALARY_DETAILS_COLLECTION);

module.exports = {
    Salary,
};
