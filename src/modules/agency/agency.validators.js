/*
 * This file contains all the input validations for the agency Module
 *
 * Author: Aayush Gour
 */
const Joi = require('joi');

const createAgencyValidator = Joi.object({
    agencyName: Joi.string().required(),
    contactPerson: Joi.string().required(),
    contactNumber: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.string().required(),
    bankName: Joi.string().required(),
    emailId: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    agencyAddress: Joi.string().required(),
});

const updateAgencyValidator = Joi.object({
    agencyId: Joi.string().required(),
    agencyName: Joi.string().required(),
    contactPerson: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.string().required(),
    bankName: Joi.string().required(),
    contactNumber: Joi.string().required(),
    agencyAddress: Joi.string().required(),
});

const getAgencyByIdValidator = Joi.object({
    agencyId: Joi.string().required(),
});
module.exports = {
    createAgencyValidator,
    getAgencyByIdValidator,
    updateAgencyValidator,
};
