/*
 * This file contains the Employee Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const nomineeSchema = new mongoose.Schema({
    nomineeName: {
        type: String,
        required: true,
    },
    nomineeRelation: {
        type: String,
        required: true,
    },
    nomineeDob: {
        type: Date,
        required: true,
    },
    nomineeAddress: {
        type: String,
        required: true,
    },
    percentage: {
        type: String,
        required: true,
    },
});
const familySchema = new mongoose.Schema({
    key: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    relationship: {
        type: String,
        required: true,
    },
    residingWith: {
        type: Boolean,
        required: true,
    },
    placeOfResidence: {
        type: String,
    },
});

const referenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    guardian: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
    presentAddress: {
        type: String,
        required: true,
    },
    languages: {
        type: String,
        required: true,
    },
    aadharNumber: {
        type: String,
        required: true,
    },
    panNumber: {
        type: String,
        required: true,
    },
    idMarks: {
        type: String,
        required: true,
    },
    maritalStatus: {
        type: String,
        required: true,
    },
    // nomineeName: {
    //     type: String,
    //     required: true,
    // },
    // nomineeRelation: {
    //     type: String,
    //     required: true,
    // },
    // nomineeDob: {
    //     type: String,
    //     required: true,
    // },
    // nomineeAddress: {
    //     type: String,
    //     // required: true,
    // },
    oldEsiNumber: {
        type: String,
        // required: true,
    },
    references: {
        type: [referenceSchema],
        required: true,
        default: [],
    },
    agencyId: {
        type: ObjectId,
        default: null,
    },
    createdDate: {
        type: Date,
        required: true,
        default: new Date(),
    },
    editedDate: {
        type: Date,
        required: true,
        default: new Date(),
    },
    clientId: {
        type: ObjectId,
        default: null,
    },
    familyDetails: {
        type: [familySchema],
        default: [],
    },
    employeeNo: {
        type: String,
        unique: true,
    },
    accountNumber: {
        type: String,
        unique: true,
    },
    ifscCode: {
        type: String,
        unique: true,
    },
    uanNumber: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DELETED'],
        default: 'ACTIVE',
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    nomineeDetails: {
        type: [nomineeSchema],
        required: true,
    },
});

employeeSchema.pre('save', async function (next) {
    try {
        const designationInitials = this.designation
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('');

        const employeeCount = await this.constructor.countDocuments();

        this.employeeNo = `${designationInitials}${(employeeCount + 1)
            .toString()
            .padStart(3, '0')}`;

        next();
    } catch (error) {
        next(error);
    }
});

const Employee = mongoose.model('employee', employeeSchema, process.env.EMPLOYEE_DATA_COLLECTION);

const employeeImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
        // contentType: String,
    },
    employeeId: {
        type: String,
        required: true,
    },
});

const EmployeeImage = mongoose.model('Image', employeeImageSchema, process.env.EMPLOYEE_IMAGE_COLLECTION);

module.exports = {
    Employee, EmployeeImage,
};
