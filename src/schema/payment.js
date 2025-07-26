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

const paymentSchema = mongoose.Schema({
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
    esiStatus: {
        type: String,
        // required: true,
        default: null,
    },
    esiPayout: {
        type: String,
        // required: true,
        default: null,
    },
    esiDueDate: {
        type: Date,
        // required: true,
        default: null,
    },
    pfStatus: {
        type: String,
        // required: true,
        default: null,
    },
    pfPayout: {
        type: String,
        // required: true,
        default: null,
    },
    pfDueDate: {
        type: Date,
        // required: true,
        default: null,
    },
    earnedLeaveStatus: {
        type: String,
        // required: true,
        default: null,
    },
    earnedLeavePayout: {
        type: String,
        // required: true,
        default: null,
    },
    earnedLeaveDueDate: {
        type: Date,
        // required: true,
        default: null,
    },
    nfhStatus: {
        type: String,
        // required: true,
        default: null,
    },
    nfhPayout: {
        type: String,
        // required: true,
        default: null,
    },
    nfhDueDate: {
        type: Date,
        // required: true,
        default: null,
    },
    bonusStatus: {
        type: String,
        // required: true,
        default: null,
    },
    bonusPayout: {
        type: String,
        // required: true,
        default: null,
    },
    bonusDueDate: {
        type: Date,
        // required: true,
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
});

// paymentSchema.methods.joiValidate = (obj) => {
//     const schema = {

//         clientId: Joi.objectId().required(),
//         agencyId: Joi.objectId().required(),

//     };
//     return Joi.validate(obj, schema);
// };

const Payment = mongoose.model('payment', paymentSchema, process.env?.PAYMENT_DETAILS_COLLECTION);

module.exports = {
    Payment,
};
