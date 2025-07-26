/*
 * This file contains all the services related to the Agency module
 *
 * Author: Aayush Gour
 */

const { Agency } = require('../../schema/agency');
const { responseMessages, rolesList } = require('../../utility/constants');
const { Exception } = require('../../utility/error.toolkit');
const { formatResponse } = require('../../utility/response-toolkit');
const { signupService } = require('../user/user.service');
const { createAgencyValidator, getAgencyByIdValidator, updateAgencyValidator } = require('./agency.validators');

const createAgencyService = async (payload) => {
    try {
        const payloadValidation = createAgencyValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        // add aggragation to check if agency exists
        // const agencyData = await Agency.findOne({ emailId: payload?.emailId });
        // if (agencyData) {
        //     return formatResponse(responseMessages.AGENCY_ALREADY_EXISTS, 400);
        // }
        const userDetails = {
            emailId: payload?.emailId,
            password: payload?.password,
            roles: [rolesList.ADMIN],
        };
        const userData = await signupService(userDetails);
        if (userData?.isBoom) {
            return formatResponse(responseMessages.USER_ALREADY_EXISTS, 400);
        }
        const agencyDetails = {
            userId: userData?.data?.id,
            agencyName: payload?.agencyName,
            contactPerson: payload?.contactPerson,
            contactNumber: payload?.contactNumber,
            agencyAddress: payload?.agencyAddress,
            accountNumber: payload?.accountNumber,
            ifscCode: payload?.ifscCode,
            bankName: payload?.bankName,
        };
        const newOrgObject = new Agency(agencyDetails);
        await Agency.create(newOrgObject);
        return formatResponse({ id: userData?.data?.id, message: responseMessages.AGENCY_CREATED }, 201);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getAgenciesService = async () => {
    try {
        const options = {};
        // const agenciesList = await Agency.find(options);
        const agenciesList = await Agency.aggregate([
            {
                $lookup: {
                    from: process.env?.USER_DATA_COLLECTION,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 1,
                    agencyName: 1,
                    contactPerson: 1,
                    contactNumber: 1,
                    emailId: '$user.emailId',
                },
            },
        ]);
        if (agenciesList) {
            return formatResponse({ data: agenciesList }, 200);
        }
        return formatResponse({ data: [], message: responseMessages.NO_AGENCIES_FOUND }, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getAgencyByIdService = async (query) => {
    try {
        const payloadValidation = getAgencyByIdValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const agencyData = await Agency.findById(query?.agencyId);
        if (agencyData) {
            return formatResponse(agencyData, 200);
        }
        return formatResponse(responseMessages.NO_AGENCIES_FOUND, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const updateAgencyByIdService = async (payload) => {
    try {
        const payloadValidation = updateAgencyValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const agency = await Agency.findByIdAndUpdate(
            payload?.agencyId,
            payload,
            { new: true },
        );
        return formatResponse(agency, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

module.exports = {
    createAgencyService,
    getAgenciesService,
    getAgencyByIdService,
    updateAgencyByIdService,
};
