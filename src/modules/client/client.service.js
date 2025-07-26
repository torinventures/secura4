/*
 * This file contains all the services related to the client module
 *
 * Author: Aayush Gour
 */

const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb');
const { Client } = require('../../schema/client');
const { responseMessages, rolesList } = require('../../utility/constants');
const { Exception } = require('../../utility/error.toolkit');
const { formatResponse } = require('../../utility/response-toolkit');
const { signupService } = require('../user/user.service');
const {
    createClientValidator, getClientByIdValidator, getClientsListValidator, updateClientValidator, markAttendanceValidator, getAttendanceDataValidator, getPayoutDataValidator, getClientInvoiceDataValidator, updateEstimateDataValidator, saveInvoiceDataValidator, getClientEstimateDataValidator,
} = require('./client.validators');
const { Attendance } = require('../../schema/attendance');
const { EmployeeEngagement } = require('../../schema/employee-engagement');
const { Payment } = require('../../schema/payment');
const { Estimate } = require('../../schema/estimate');
const { Employee } = require('../../schema/employee');
const { Invoice } = require('../../schema/invoice');

const createClientService = async (payload) => {
    try {
        const payloadValidation = createClientValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        // Check if client exists
        // const clientData = await Client.findOne({ contactEmail: payload?.contactEmail });
        // if (clientData) {
        //     return formatResponse(responseMessages.CLIENT_ALREADY_EXISTS, 400);
        // }

        // To create user for the client.
        // const userDetails = {
        //     emailId: payload?.contactEmail,
        //     password: payload?.password,
        //     roles: [rolesList.CLIENT],
        // };
        // const userData = await signupService(userDetails);
        // if (userData?.isBoom) {
        //     return formatResponse(responseMessages.USER_ALREADY_EXISTS, 400);
        // }
        const generatedClientId = new mongoose.Types.ObjectId();
        const clientDetails = {
            // userId: userData?.data?.id,
            userId: generatedClientId,
            clientName: payload?.clientName,
            billingAddress: payload?.billingAddress,
            street: payload?.street,
            city: payload?.city,
            state: payload?.state,
            postalCode: payload?.postalCode,
            country: payload?.country,
            contactPerson: payload?.contactPerson,
            contactEmail: payload?.contactEmail,
            contactNumber: payload?.contactNumber,
            panNumber: payload?.panNumber,
            gstin: payload?.gstin,
            createdDate: payload?.createdDate,
            agencyId: payload?.agencyId,
        };
        const newClientObject = new Client(clientDetails);
        const storedClientData = await Client.create(newClientObject);
        const processedEstimateData = payload?.estimateData?.map((elem) => ({ ...elem, agencyId: mongoose.Types.ObjectId(payload?.agencyId), clientId: storedClientData?._id }));
        // const newEstimateObject = new Estimate(processedEstimateData);
        await Estimate.create(processedEstimateData);
        return formatResponse({ id: generatedClientId, message: responseMessages.CLIENT_CREATED }, 201);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const updateClientDetailsService = async (payload) => {
    try {
        const payloadValidation = updateClientValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const id = payload?.clientId;
        const updatedClient = await Client.findOneAndUpdate(
            { _id: id },
            { $set: payload },
            { new: true },
        );
        return formatResponse(updatedClient, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getClientsService = async (query) => {
    try {
        const payloadValidation = getClientsListValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const usersList = await Client.find({ agencyId: query?.agencyId, status: 'ACTIVE' });
        if (usersList) {
            return formatResponse({ data: usersList }, 200);
        }
        return formatResponse({ data: [], message: responseMessages.NO_CLIENTS_FOUND }, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getClientByIdService = async (query) => {
    try {
        const payloadValidation = getClientByIdValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        // const clientData = await Client.findById(query?.clientId);
        // const estimateData = await Estimate.find({ clientId: query?.clientId });
        const clientData = await Client.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(query?.clientId) } },
            // {
            //     $lookup: {
            //         from: process.env?.ESTIMATE_DETAILS_COLLECTION,
            //         localField: '_id',
            //         foreignField: 'clientId',
            //         as: 'estimateData'
            //     },
            // },
            {
                $lookup: {
                    from: process.env?.ESTIMATE_DETAILS_COLLECTION,
                    let: {
                        id: '$_id',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$$id', '$clientId'] },
                                        { $eq: ['$status', 'ACTIVE'] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'estimateData',
                },
            },
        ]);
        if (clientData?.[0]) {
            return formatResponse(clientData?.[0], 200);
        }
        return formatResponse(responseMessages.NO_CLIENTS_FOUND, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const deleteClientByIdService = async (query) => {
    try {
        const payloadValidation = getClientByIdValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const clientData = await Client.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(query?.clientId) },
            { status: 'DELETED' },
            { new: false },
        );
        if (clientData) {
            return formatResponse(responseMessages.CLIENT_DELETED, 200);
        }
        return formatResponse(responseMessages.NO_CLIENTS_FOUND, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const markAttendanceService = async (payload) => {
    try {
        const payloadValidation = markAttendanceValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const { attendanceData } = payload;
        // const {
        //     employeeId,
        //     agencyId,
        //     clientId,
        //     date,
        //     inTime,
        //     outTime,
        // } = payload;
        // const existingAttendance = await Attendance.findOne({
        //     employeeId,
        //     agencyId,
        //     clientId,
        //     date,
        // });

        // if (existingAttendance) {
        //     // Attendance already exists, update inTime and outTime
        //     existingAttendance.inTime = inTime;
        //     existingAttendance.outTime = outTime;
        //     await existingAttendance.save();
        // } else {
        //     // Attendance doesn't exist, create a new entry
        //     const newAttendance = new Attendance({
        //         employeeId,
        //         assignmentId,
        //         agencyId,
        //         clientId,
        //         date,
        //         inTime,
        //         outTime,
        //     });
        //     await newAttendance.save();
        // }

        // for bulk edit
        const bulkOps = attendanceData.map(({
            employeeId, agencyId, clientId, date, holidays,
            noOfDays,
            presentDays,
            scale,
            shifts,
            totalPayDays, assignmentId, designation
        }) => ({
            updateOne: {
                filter: {
                    employeeId, agencyId, clientId, date, assignmentId, designation
                },
                update: {
                    $set: {
                        holidays,
                        noOfDays,
                        presentDays,
                        scale,
                        shifts,
                        totalPayDays,
                        designation
                    },
                },
                upsert: true,
            },
        }));

        const result = await Attendance.bulkWrite(bulkOps);
        return formatResponse(result, 201);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getAttendanceDataService = async (query) => {
    try {
        const payloadValidation = getAttendanceDataValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const {
            // agencyId,
            clientId,
            startDate,
            endDate,
        } = query;

        // const records = await EmployeeEngagement.find({
        //     clientId,
        //     // agencyId,
        //     startDate: { $lte: startDate },
        //     // endDate: { $gte: endDate },
        // });

        // const records = await EmployeeEngagement.find({
        //     $or: [
        //         {
        //             $and: [
        //                 { endDate: { $gte: startDate } },
        //                 { endDate: { $lte: endDate } }
        //             ]
        //         },
        //         {
        //             $and: [
        //                 { startDate: { $gte: startDate } },
        //                 { startDate: { $lte: endDate } }
        //             ]
        //         },
        //         {
        //             $and: [
        //                 { startDate: { $lte: startDate } },
        //                 { endDate: { $gte: endDate } }
        //             ]
        //         }
        //     ],
        //     clientId,
        // }).populate({ model: "employee", path: "name", strictPopulate: false }).exec();

        const records = await Employee.aggregate([
            // {
            //     $match: {
            //         clientId: mongoose.Types.ObjectId(clientId),
            //         $or: [
            //             {
            //                 $and: [
            //                     { endDate: { $gte: new Date(startDate) } },
            //                     { endDate: { $lte: new Date(endDate) } },
            //                 ],
            //             },
            //             {
            //                 $and: [
            //                     { startDate: { $gte: new Date(startDate) } },
            //                     { startDate: { $lte: new Date(endDate) } },
            //                 ],
            //             },
            //             {
            //                 $and: [
            //                     { startDate: { $lte: new Date(startDate) } },
            //                     { endDate: { $gte: new Date(endDate) } },
            //                 ],
            //             },
            //         ],
            //     },
            // },
            // {
            //     $lookup: {
            //         from: process.env.EMPLOYEE_DATA_COLLECTION,
            //         localField: 'employeeId',
            //         foreignField: '_id',
            //         as: 'employee',
            //     },
            // },
            // {
            //     $unwind: '$employee',
            // },
            // {
            //     $project: {
            //         employeeId: 1,
            //         employeeNo: '$employee.employeeNo',
            //         designation: '$employee.designation',
            //         clientId: 1,
            //         agencyId: 1,
            //         startDate: 1,
            //         endDate: 1,
            //         startTime: 1,
            //         endTime: 1,
            //         employeeName: '$employee.name',
            //     },
            // },
            {
                $lookup: {
                    from: process.env?.SALARY_DETAILS_COLLECTION,
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'salary',
                },
            },
            {
                $unwind: '$salary',
            },
            // {
            //     $lookup: {
            //         from: process.env.ATTENDANCE_DATA_COLLECTION,
            //         let: {
            //             employeeId: '$employeeId',
            //             clientId: '$clientId',
            //             agencyId: '$agencyId',
            //             startDate: new Date(startDate),
            //             endDate: new Date(endDate)
            //         },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: {
            //                         $and: [
            //                             { $eq: ['$employeeId', '$employeeId'] },
            //                             { $eq: ['$clientId', '$clientId'] },
            //                             { $eq: ['$agencyId', '$agencyId'] },
            //                             { $gte: ['$date', '$startDate'] },
            //                             { $lte: ['$date', '$endDate'] }
            //                         ]
            //                     }
            //                 }
            //             }
            //         ],
            //         as: 'attendance'
            //     }
            // }
        ]);
        // const updatedRecords = await Promise.all(records.map(async (record) => {
        //     const attendance = await Attendance.findOne({
        //         employeeId: record.employeeId.toString(),
        //         clientId: record.clientId.toString(),
        //         agencyId: record.agencyId.toString(),
        //         date: {
        //             $gte: new Date(startDate),
        //             $lte: new Date(endDate),
        //         },
        //     })?.exec();

        //     return {
        //         ...record,
        //         attendance,
        //     };
        // }));

        return formatResponse(records, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getClientPayoutDetailsService = async (query) => {
    try {
        const payloadValidation = getPayoutDataValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const { agencyId, clientId } = query;

        const paymentResults = await Payment.findOne({ agencyId, clientId });
        if (!paymentResults) {
            return formatResponse(responseMessages.NO_DATA_AVAILABLE, 400);
        }
        return formatResponse(paymentResults, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getClientInvoiceDataService = async (query) => {
    try {
        const payloadValidation = getClientInvoiceDataValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const { clientId, startDate, endDate } = query;
        const clientDetails = await getClientByIdService({ clientId });
        if (clientDetails?.statusCode >= 400) {
            throw Exception(responseMessages.NO_CLIENTS_FOUND, 400);
        }
        const salData = await EmployeeEngagement.aggregate([
            {
                $match: {
                    clientId: mongoose.Types.ObjectId(query?.clientId), // Replace <clientId> with the desired clientId value
                    startDate: {
                        $gte: new Date(query?.startDate),
                    }, // Replace <startDate> with the desired start date value
                    endDate: {
                        $lte: new Date(query?.endDate),
                    }, // Replace <endDate> with the desired end date value
                },
            },
            {
                $lookup: {
                    from: process.env?.SALARY_DETAILS_COLLECTION,
                    localField: '_id',
                    foreignField: 'assignmentId',
                    as: 'salaryData',
                },
            },
            {
                $unwind: '$salaryData',
            },
            {
                $lookup: {
                    from: process.env.ATTENDANCE_DATA_COLLECTION,
                    localField: '_id',
                    foreignField: 'assignmentId',
                    as: 'attendanceData',
                },
            },
            {
                $lookup: {
                    from: process.env?.EMPLOYEE_DATA_COLLECTION,
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employeeData',
                },
            },
            {
                $unwind: '$employeeData',
            },
            {
                $lookup: {
                    from: process.env?.CLIENT_DATA_COLLECTION,
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'clientData',
                },
            },
            {
                $unwind: '$clientData',
            },
            {
                $lookup: {
                    from: process.env?.AGENCY_COLLECTION,
                    localField: 'agencyId',
                    foreignField: '_id',
                    as: 'agencyData',
                },
            },
            {
                $unwind: '$agencyData',
            },
        ]);
        const result = salData?.map((dat) => {
            // const totalDays = Math.ceil((new Date(dat?.endDate) - new Date(dat?.startDate)) / (1000 * 60 * 60 * 24));
            const totalDays = 26;
            const daysWorked = dat?.attendanceData?.filter((e) => e?.status !== 'holiday')?.length;
            return ({
                totalDays, daysWorked, designation: dat?.employeeData?.designation, salaryData: dat?.salaryData,
            });
        });
        // const attendanceData = await Attendance.find({ assignmentId: })
        return formatResponse({ billData: result, clientData: salData?.[0]?.clientData, agencyData: salData?.[0]?.agencyData }, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const updateEstimateDataService = async (payload) => {
    try {
        const payloadValidation = updateEstimateDataValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const { clientId, agencyId, estimateData } = payload;

        const estOperations = estimateData?.map((est) => {
            const searchId = String(est?._id)?.startsWith('custom') ? new ObjectId() : mongoose.Types.ObjectId(est?._id);
            est._id = searchId;
            return ({
                updateOne: {
                    filter: { _id: searchId },
                    update: { $set: est },
                    upsert: true,
                },
            });
        });
        const updatedEst = await Estimate.bulkWrite(estOperations).then((result) => {
            console.log(`Estimates upserted: ${result.upsertedCount}`);
            console.log(`Estimates modified: ${result.modifiedCount}`);
            return result;
        })
            .catch((error) => {
                console.error('Error occurred during upsert:', error);
            });
        return formatResponse(updatedEst, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const saveInvoiceDataService = async (payload) => {
    try {
        const payloadValidation = saveInvoiceDataValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const { invoiceData } = payload;
        const insertedInvoices = await Invoice.insertMany(invoiceData);
        return formatResponse(insertedInvoices, 201);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
}

module.exports = {
    createClientService,
    getClientsService,
    getClientByIdService,
    updateClientDetailsService,
    deleteClientByIdService,
    markAttendanceService,
    getAttendanceDataService,
    getClientPayoutDetailsService,
    getClientInvoiceDataService,
    updateEstimateDataService,
    saveInvoiceDataService,
};
