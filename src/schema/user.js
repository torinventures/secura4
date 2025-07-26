/*
 * This file contains the User Schema and validations
 *
 * Author: Aayush Gour
 */
const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const userSchema = mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
    roles: {
        type: Array,
        schema: [
            {
                type: String,
            },
        ],
    },
    createdDate: {
        type: Date,
        required: true,
    },
    clientId: {
        type: ObjectId,
        default: null,
    },
});

userSchema.methods.joiValidate = (obj) => {
    const schema = {
        password: Joi.types.String().required(),
        emailId: Joi.types.String().email().required(),
        createdDate: Joi.types.Date(),
    };
    return Joi.validate(obj, schema);
};

const User = mongoose.model('user', userSchema, process.env.USER_DATA_COLLECTION);

module.exports = {
    User,
};
