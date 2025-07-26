/*
 * This file contains the Employee engagement Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const shiftSchema = mongoose.Schema({
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
});

const employeeEngagementSchema = mongoose.Schema({
    employeeId: {
        type: ObjectId,
        ref: 'employee',
        required: true,
    },
    clientId: {
        type: ObjectId,
        required: true,
    },
    agencyId: { type: ObjectId, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
});

employeeEngagementSchema.methods.joiValidate = (obj) => {
    const schema = {
        employeeId: Joi.objectId().required(),
        clientId: Joi.objectId().required(),
        agencyId: Joi.objectId().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
    };
    return Joi.validate(obj, schema);
};

const EmployeeEngagement = mongoose.model('employee_engagement', employeeEngagementSchema, process.env?.EMPLOYEE_ENGAGEMENT_COLLECTION);

module.exports = {
    EmployeeEngagement,
};
