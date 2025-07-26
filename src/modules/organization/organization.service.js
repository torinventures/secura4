/*
 * This file contains all the services related to the organization module
 *
 * Author: Aayush Gour
 */

const { Organization } = require('../../schema/agency');
const { responseMessages, rolesList } = require('../../utility/constants');
const { Exception } = require('../../utility/error.toolkit');
const { formatResponse } = require('../../utility/response-toolkit');
const { signupService } = require('../user/user.service');
const { createOrganizationValidator, getOrganizationByIdValidator, updateOrganizationValidator } = require('./organization.validators');

const createOrganizationService = async (payload) => {
    try {
        const payloadValidation = createOrganizationValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const organizationData = await Organization.findOne({ emailId: payload?.emailId });
        if (organizationData) {
            return formatResponse(responseMessages.ORGANIZATION_ALREADY_EXISTS, 400);
        }
        const userDetails = {
            emailId: payload?.emailId,
            password: payload?.password,
            roles: [rolesList.ADMIN],
        };
        const userData = await signupService(userDetails);
        if (userData?.isBoom) {
            return formatResponse(responseMessages.USER_ALREADY_EXISTS, 400);
        }
        const organizationDetails = {
            userId: userData?.data?.id,
            organizationName: payload?.organizationName,
            contactPerson: payload?.contactPerson,
            contactNumber: payload?.contactNumber,
            organizationAddress: payload?.organizationAddress,
        };
        const newOrgObject = new Organization(organizationDetails);
        await Organization.create(newOrgObject);
        return formatResponse({ id: userData?.data?.id, message: responseMessages.ORGANIZATION_CREATED }, 201);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getOrganizationsService = async () => {
    try {
        const options = {};
        const usersList = await Organization.find(options);
        if (usersList) {
            return formatResponse({ data: usersList }, 200);
        }
        return formatResponse({ data: [], message: responseMessages.NO_ORGANIZATIONS_FOUND }, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getOrganizationByIdService = async (query) => {
    try {
        const payloadValidation = getOrganizationByIdValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const organizationData = await Organization.findById(query?.organizationId);
        if (organizationData) {
            return formatResponse(organizationData, 200);
        }
        return formatResponse(responseMessages.NO_ORGANIZATIONS_FOUND, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const updateOrganizationByIdService = async (payload) => {
    try {
        const payloadValidation = updateOrganizationValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const organization = await Organization.findByIdAndUpdate(
            payload?.organizationId,
            payload,
            { new: true },
        );
        return formatResponse(organization, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

module.exports = {
    createOrganizationService,
    getOrganizationsService,
    getOrganizationByIdService,
    updateOrganizationByIdService,
};
