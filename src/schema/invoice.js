/*
 * This file contains the Invoice Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const invoiceSchema = mongoose.Schema({
    clientId: {
        type: ObjectId,
        required: true,
    },
    designation: {
        type: String,
        // required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    shifts: {
        type: Number,
        required: true,
    },
    noOfEmployees: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    pf: {
        type: Number,
        required: true,
    },
    esi: {
        type: Number,
        required: true,
    },

    createdDate: {
        type: Date,
        required: true,
        default: new Date(),
    },

});

invoiceSchema.methods.joiValidate = (obj) => {
    const schema = {

        createdDate: Joi.types.Date(),
        // inTime: Joi.types.Date(),
        // outTime: Joi.types.Date(),
    };
    return Joi.validate(obj, schema);
};

const Invoice = mongoose.model('invoice', invoiceSchema, process.env.INVOICE_DETAILS_COLLECTION);

module.exports = {
    Invoice,
};
