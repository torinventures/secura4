/*
 * This file contains all the services related to the client module
 *
 * Author: Aayush Gour
 */

const { default: mongoose } = require('mongoose');
const { Employee } = require('../../schema/employee');
const { responseMessages, rolesList } = require('../../utility/constants');
const { Exception } = require('../../utility/error.toolkit');
const { formatResponse } = require('../../utility/response-toolkit');
const {
    getDashboardDataValidator,
} = require('./common.validators');
const { Client } = require('../../schema/client');
const { Agency } = require('../../schema/agency');

const dashboardDataService = async (query, roles) => {
    const payloadValidation = getDashboardDataValidator.validate(query);
    if (payloadValidation?.error) {
        throw Exception(payloadValidation.error?.message, 400);
    }
    try {
        const agencyId = mongoose.Types.ObjectId(query?.agencyId);
        let aggregatorList;
        if (roles?.includes(rolesList?.CLIENT)) {
            aggregatorList = [
                {
                    $match: {
                        agencyId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ];
            const dashboardData = await new Promise((resolve, reject) => {
                Employee.aggregate(aggregatorList)
                    .exec((err, employees) => {
                        if (err) {
                            reject(err);
                            throw Exception(err, 500);
                        }
                        if (roles?.includes(rolesList?.CLIENT)) {
                            resolve([{ employeeCount: employees }]);
                        } else {
                            resolve(employees);
                        }
                    });
            });

            if (dashboardData) {
                return formatResponse(dashboardData, 200);
            }
        } else if (roles?.includes(rolesList.ADMIN)) {
            const employeeCount = await Employee.aggregate([
                { $match: { agencyId, status: 'ACTIVE' } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);

            const clientCount = await Client.aggregate([
                { $match: { agencyId, status: 'ACTIVE' } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);
            const dashboardData = [{
                employeeCount, clientCount,
            }];

            if (dashboardData) {
                return formatResponse(dashboardData, 200);
            }
        } else if (roles?.includes(rolesList.SUPERADMIN)) {
            const employeeCount = await Employee.aggregate([
                { $match: { status: 'ACTIVE' } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);

            const clientCount = await Client.aggregate([
                { $match: { status: 'ACTIVE' } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);
            const agencyCount = await Agency.aggregate([
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);
            const dashboardData = [{
                employeeCount, clientCount, agencyCount,
            }];
            if (dashboardData) {
                return formatResponse(dashboardData, 200);
            }
        }

        return formatResponse([], 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

// const getEmployeesService = async (query, roles) => {
//     try {
//         const payloadValidation = getAllEmployeeValidator.validate(query);
//         if (payloadValidation?.error) {
//             throw Exception(payloadValidation.error?.message, 400);
//         }
//         const options = {};
//         if (query?.clientId) {
//             options.clientId = query?.clientId;
//         }
//         const aggregatorList = [
//             {
//                 $lookup: {
//                     from: process.env?.CLIENT_DATA_COLLECTION,
//                     localField: 'clientId',
//                     foreignField: '_id',
//                     as: 'clientData',
//                 },
//             },
//             {
//                 $unwind: '$clientData',
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     employeeName: 1,
//                     clientName: '$clientData.clientName',
//                     employeeData: '$$ROOT',
//                 },
//             },
//         ];
//         if (roles?.includes(rolesList?.CLIENT)) {
//             aggregatorList.unshift({
//                 $match: {
//                     clientId: mongoose.Types.ObjectId(query?.clientId),
//                 },
//             });
//             // employeeList = await Employee.find(options);
//         }
//         const employeeList = await new Promise((resolve, reject) => {
//             Employee.aggregate(aggregatorList)
//                 .exec((err, employees) => {
//                     if (err) {
//                         reject(err);
//                         throw Exception(err, 500);
//                     }
//                     resolve(employees);
//                 });
//         });

//         if (employeeList) {
//             return formatResponse({ employeeList }, 200);
//         }
//         return formatResponse({ employeeList: [], message: responseMessages.NO_EMPLOYEES_FOUND }, 200);
//     } catch (error) {
//         return formatResponse(error, error?.statusCode);
//     }
// };

// const getEmployeeByIdService = async (query) => {
//     try {
//         const payloadValidation = getEmployeeByIdValidator.validate(query);
//         if (payloadValidation?.error) {
//             throw Exception(payloadValidation.error?.message, 400);
//         }
//         const clientData = await Employee.findById(query?.employeeId);
//         if (clientData) {
//             return formatResponse(clientData, 200);
//         }
//         return formatResponse(responseMessages.NO_CLIENTS_FOUND, 400);
//     } catch (error) {
//         return formatResponse(error, error?.statusCode);
//     }
// };

module.exports = {
    dashboardDataService,
    // getEmployeesService,
    // getEmployeeByIdService,
};
