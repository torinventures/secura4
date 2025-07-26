/*
 * This file contains the options for all the Agency modules
 *
 * Author: Aayush Gour
 */

const { authName } = require('../../utility/constants');
const { createAgencyValidator, getAgencyByIdValidator, updateAgencyValidator } = require('./agency.validators');

const createAgencyOptions = {
    auth: authName,
    tags: ['api', 'agency'],
    description: 'Create agency API',
    validate: {
        payload: createAgencyValidator,
        failAction: (request, h, error) => {
            throw error;
        },
    },
};
const getAllAgencysOptions = {
    auth: authName,
    tags: ['api', 'agency'],
    description: 'Get all agencys API',
};

const getAgencyByIdOptions = {
    auth: authName,
    tags: ['api', 'agency'],
    description: 'Get agency by agency id API',
    validate: { query: getAgencyByIdValidator },
};

const updateAgencyByIdOptions = {
    auth: authName,
    tags: ['api', 'agency'],
    description: 'Update agency by agency id API',
    validate: { payload: updateAgencyValidator },
};

module.exports = {
    createAgencyOptions,
    getAllAgencysOptions,
    getAgencyByIdOptions,
    updateAgencyByIdOptions,
};
