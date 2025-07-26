/*
 * This file contains the Attendance Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const attendanceSchema = mongoose.Schema({
    employeeId: {
        type: ObjectId,
        required: true,
    },
    assignmentId: {
        type: ObjectId,
        ref: 'employee_engagement',
        required: true,
    },
    agencyId: {
        type: ObjectId,
        required: true,
    },
    clientId: {
        type: ObjectId,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    designation: {
        type: String,
        // required: true,
    },
    holidays: {
        type: Number,
        required: true,
    },
    noOfDays: {
        type: Number,
        required: true,
    },
    presentDays: {
        type: Number,
        required: true,
    },
    scale: {
        type: Number,
        required: true,
    },
    shifts: {
        type: Number,
        required: true,
    },
    totalPayDays: {
        type: Number,
        required: true,
    },
    createdDate: {
        type: Date,
        required: true,
        default: new Date(),
    },
    // inTime: {
    //     type: String,
    //     required: true,
    // },
    // outTime: {
    //     type: String,
    //     required: true,
    // },
});

attendanceSchema.methods.joiValidate = (obj) => {
    const schema = {
        employeeId: Joi.types.String().required(),
        createdDate: Joi.types.Date(),
        // inTime: Joi.types.Date(),
        // outTime: Joi.types.Date(),
    };
    return Joi.validate(obj, schema);
};

const Attendance = mongoose.model('attendance', attendanceSchema, process.env.ATTENDANCE_DATA_COLLECTION);

module.exports = {
    Attendance,
};
