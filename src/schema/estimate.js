/*
 * This file contains the Payment Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const payoutSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
    },
    payout: {
        type: String,
        required: true,
        enum: ['Monthly', 'Quarterly', 'Half-yearly', 'Annually'],
    },
});

const estimateSchema = mongoose.Schema({
    clientId: {
        type: ObjectId,
        ref: 'client',
        required: true,
    },
    agencyId: { type: ObjectId, ref: 'Agency', required: true },
    // assignmentIds: [{
    //     type: ObjectId,
    //     ref: 'employee_engagement',
    // }],
    // assignmentId: { type: ObjectId, ref: "employee_engagement", required: true },
    designation: {
        type: String,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DELETED'],
    },
    salary: {
        type: Number,
    },
    additionalAllowance: {
        type: Number,
    },
    washingAllowance: {
        type: Number,
    },
    subTotalA: {
        type: Number,
    },
    pf: {
        type: Number,
    },
    esi: {
        type: Number,
    },
    bonus: {
        type: Number,
    },
    nfh: {
        type: Number,
    },
    earnedLeave: {
        type: Number,
    },
    uniformCharges: {
        type: Number,
    },
    subTotalB: {
        type: Number,
    },
    relievingCharges: {
        type: Number,
    },
    subTotalC: {
        type: Number,
    },
    serviceCharges: {
        type: Number,
    },
    total: {
        type: Number,
    },
    noOfEmployees: {
        type: Number,
    },
    grandTotal: {
        type: Number,
    },
    serviceChargePercentage: {
        type: Number,
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
});

// estimateSchema.methods.joiValidate = (obj) => {
//     const schema = {

//         clientId: Joi.objectId().required(),
//         agencyId: Joi.objectId().required(),

//     };
//     return Joi.validate(obj, schema);
// };

const Estimate = mongoose.model('estimate', estimateSchema, process.env?.ESTIMATE_DETAILS_COLLECTION);

module.exports = {
    Estimate,
};
