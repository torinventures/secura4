/*
 * Database Schema foragency Module for the Application
 *
 * Author: Aayush Gour
 */

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
    agencyName: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    ifscCode: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    agencyAddress: {
        type: String,
        required: true,
    },
    userId: {
        type: ObjectId,
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
});

const Agency = mongoose.model('Agency', agencySchema, process.env?.AGENCY_COLLECTION);

module.exports = {
    Agency,
};
