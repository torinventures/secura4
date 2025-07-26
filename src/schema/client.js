/*
 * This file contains the Client Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const clientSchema = mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    billingAddress: {
        type: String,
        required: true,
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: Number, required: true },
    country: { type: String, required: true },
    contactPerson: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    panNumber: {
        type: String,
        required: true,
    },
    gstin: {
        type: String,
        required: true,
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
    userId: {
        type: ObjectId,
        default: null,
    },
    agencyId: {
        type: ObjectId,
        default: null,
        ref: 'Agency',
    },
    status: {
        type: String,
        default: 'ACTIVE',
    },
    designation: {
        type: String,
        default: null,
    },
});

clientSchema.methods.joiValidate = (obj) => {
    const schema = {
        clientName: Joi.types.string().required(),
        billingAddress: Joi.types.string(),
        street: Joi.types.string(),
        city: Joi.types.string(),
        state: Joi.types.string(),
        postalCode: Joi.types.number(),
        country: Joi.types.string(),
        contactPerson: Joi.types.string().required(),
        contactEmail: Joi.types.string().email().required(),
        contactNumber: Joi.types.string().required(),
        panNumber: Joi.types.string().required(),
        gstin: Joi.types.string().required(),
        createdDate: Joi.types.Date(),
    };
    return Joi.validate(obj, schema);
};

const Client = mongoose.model('client', clientSchema, process.env?.CLIENT_DATA_COLLECTION);

module.exports = {
    Client,
};
