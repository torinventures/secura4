/*
 * This file contains all the services related to the client module
 *
 * Author: Aayush Gour
 */

const { default: mongoose } = require('mongoose');
const { Employee, EmployeeImage } = require('../../schema/employee');
const { EmployeeEngagement } = require('../../schema/employee-engagement');
const { EmployeeInsurance } = require('../../schema/employee-insurance');
const { Salary } = require('../../schema/salary');
const { responseMessages, rolesList } = require('../../utility/constants');
const { Exception } = require('../../utility/error.toolkit');
const { formatResponse } = require('../../utility/response-toolkit');
const {
    createEmployeeValidator, getAllEmployeeValidator, getEmployeeByIdValidator, updateEmployeeInsuranceValidator, updateEmployeeValidator, addEmployeeEngagementValidator, getEmployeeEngagementListValidator, getEmployeeSalaryDetailsValidator, updateEmployeeSalaryDetailsValidator,
} = require('./employee.validators');
const { Payment } = require('../../schema/payment');
const { logger } = require('../../utility/logger');

const createEmployeeService = async (payload) => {
    try {
        const payloadValidation = createEmployeeValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }

        // const session = await mongoose.startSession();
        // session.startTransaction();

        // try {
        const employeeData = {
            ...payload,
            // name: payload?.name,
            // guardian: payload?.guardian,
            // contactNumber: payload?.contactNumber,
            // dob: payload?.dob,
            // designation: payload?.designation,
            // qualification: payload?.qualification,
            // experience: payload?.experience,
            // permanentAddress: payload?.permanentAddress,
            // presentAddress: payload?.presentAddress,
            // languages: payload?.languages,
            // aadharNumber: payload?.aadharNumber,
            // idMarks: payload?.idMarks,
            // maritalStatus: payload?.maritalStatus,
            nomineeDetails: payload?.nomineeDetails?.filter((e) => Object.keys(JSON.parse(e))?.length > 0)?.map((e) => JSON.parse(e)),

            // panNumber: payload?.panNumber,
            oldEsiNumber: payload?.oldEsiNumber ?? '',
            sex: payload?.sex,
            status: 'ACTIVE',
            agencyId: payload?.agencyId,
            references: payload?.references?.map((e) => JSON.parse(e)),
            familyDetails: payload?.familyDetails?.filter((e) => Object.keys(JSON.parse(e))?.length > 0)?.map((e) => JSON.parse(e)),
        };
        const emp = await Employee.create(employeeData).catch((e) => { throw Exception(e, 500); });
        const imgDocs = Object.entries(payload)?.filter(([key]) => key?.includes('Thumb'))?.map(([key, value]) => ({
            // const newImage = new EmployeeImage({
            name: key,
            image: value,
            employeeId: emp?._id,
            // });

            // newImage.save({ session });
        }));
        await EmployeeImage.create(imgDocs);
        // await EmployeeImage.create(imgDocs, { session });
        // await session.commitTransaction();
        // session.endSession();
        return formatResponse({ message: responseMessages.EMPLOYEE_CREATED }, 201);
        // } catch (error) {
        //     await session.abortTransaction();
        //     session.endSession();
        //     throw Exception(error?.message, error?.statusCode || 500);
        // }
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const updateEmployeeDetailsService = async (payload) => {
    try {
        const payloadValidation = updateEmployeeValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const id = payload?._id;
        delete payload?._id;
        const emp = await Employee.findOneAndUpdate(
            { _id: id },
            { $set: payload },
            { new: true },
        );
        return formatResponse(emp, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getEmployeesService = async (query, roles) => {
    try {
        const payloadValidation = getAllEmployeeValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        if (query?.allData) {
            const employeeList = await Employee.find();
            return formatResponse({ employeeList }, 200);

        }
        const agencyIdObj = mongoose.Types.ObjectId(query?.agencyId);
        const options = {};
        if (query?.clientId) {
            options.agencyId = query?.agencyId;
        }
        const aggregatorList = [
            {
                $match: {
                    agencyId: agencyIdObj,
                    status: 'ACTIVE',
                },
            },
            {
                $lookup: {
                    from: process.env?.CLIENT_DATA_COLLECTION,
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'clientData',
                },
            },
            // {
            //     $unwind: '$clientData',
            // },
            // {
            //     $project: {
            //         _id: 1,
            //         employeeName: 1,
            //         clientName: '$clientData.clientName',
            //         clientId: '$clientData._id',
            //         employeeData: '$$ROOT',
            //     },
            // },
            {
                $unwind: {
                    path: '$clientData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    employeeName: 1,
                    employeeData: '$$ROOT',
                    clientDetails: {
                        $cond: {
                            if: { $eq: ['$clientData', null] }, // Check if clientData is null
                            then: { clientId: '-', clientName: '-' },
                            else: {
                                clientId: '$clientData._id',
                                clientName: '$clientData.clientName',
                            },
                        },
                    },
                },
            },
        ];
        if (roles?.includes(rolesList?.CLIENT)) {
            aggregatorList.unshift({
                $match: {
                    clientId: mongoose.Types.ObjectId(query?.clientId),
                },
            });
            // employeeList = await Employee.find(options);
        }
        const employeeList = await new Promise((resolve, reject) => {
            Employee.aggregate(aggregatorList)
                .exec((err, employees) => {
                    if (err) {
                        reject(err);
                        throw Exception(err, 500);
                    }
                    resolve(employees);
                });
        });

        if (employeeList) {
            return formatResponse({ employeeList }, 200);
        }
        return formatResponse({ employeeList: [], message: responseMessages.NO_EMPLOYEES_FOUND }, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getEmployeeByIdService = async (query) => {
    try {
        const payloadValidation = getEmployeeByIdValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        // const clientData = await Employee.findById(query?.employeeId);
        const clientData = await Employee.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(query?.employeeId) } },
            {
                $lookup: {
                    from: process.env?.SALARY_DETAILS_COLLECTION,
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'salaryDetails',
                },
            },
            { $unwind: { path: '$salaryDetails', preserveNullAndEmptyArrays: true } },
            // {
            //     $project: {
            //         salaryDetails: {
            //             $cond: {
            //                 if: { $eq: [{ $size: '$salaryDetails' }, 0] },
            //                 then: [],
            //                 else: '$salaryDetails',
            //             },
            //         },
            //     },
            // },
        ]);
        if (clientData?.length > 0) {
            return formatResponse(clientData[0], 200);
        }
        return formatResponse(responseMessages.NO_EMPLOYEES_FOUND, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const deleteEmployeeByIdService = async (query) => {
    try {
        const payloadValidation = getEmployeeByIdValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        // Hard delete
        // const clientData = await Employee.deleteOne({ _id: query?.employeeId });
        // await EmployeeInsurance.deleteOne({ employeeId: query?.employeeId });
        // await EmployeeImage.deleteMany({ employeeId: query?.employeeId });

        // if (clientData) {
        //     return formatResponse(clientData, 200);
        // }

        // Soft delete
        const employeeData = await Employee.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(query?.employeeId) },
            { status: 'DELETED' },
            { new: false },
        );
        if (employeeData) {
            return formatResponse(responseMessages.EMPLOYEE_DELETED, 200);
        }
        return formatResponse(responseMessages.NO_EMPLOYEES_FOUND, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getEmployeeInsuranceDetailsService = async (query) => {
    try {
        const payloadValidation = getEmployeeByIdValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        // const employeeInsuranceData = await EmployeeInsurance.findOne({ employeeId: query?.employeeId });
        const employeeInsuranceData = await Employee.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(query?.employeeId),
                },
            }, {
                $lookup: {
                    from: process.env?.EMPLOYEE_INSURANCE_COLLECTION,
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'insuranceDetails',
                },
            }, {
                $project: {
                    // employeeDetails: '$$ROOT',
                    name: 1,
                    guardian: 1,
                    dob: 1,
                    sex: 1,
                    maritalStatus: 1,
                    permanentAddress: 1,
                    presentAddress: 1,
                    appointmentDate: 1,
                    nomineeName: 1,
                    nomineeRelationship: 1,
                    nomineeAddress: 1,
                    nomineeDob: 1,
                    createdDate: 1,
                    editedDate: 1,
                    familyDetails: 1,
                    insuranceDetails: {
                        $arrayElemAt: [
                            '$insuranceDetails', 0,
                        ],
                    },
                },
            },
        ]);
        if (employeeInsuranceData[0]) {
            return formatResponse(employeeInsuranceData[0], 200);
        }
        return formatResponse(responseMessages.NO_DATA_AVAILABLE, 400);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const updateEmployeeInsuranceFormService = async (payload) => {
    try {
        const payloadValidation = updateEmployeeInsuranceValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const filter = { employeeId: payload?.employeeId };
        delete payload?.employeeId;
        const update = { $set: payload };
        const options = { upsert: true };

        await EmployeeInsurance.updateOne(filter, update, options);
        return formatResponse(responseMessages.DATA_UPDATED_SUCCESSFULLY, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getEmployeeEngagementListService = async (query) => {
    try {
        const payloadValidation = getEmployeeEngagementListValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const records = await EmployeeEngagement.aggregate([
            {
                $match: { employeeId: mongoose.Types.ObjectId(query?.employeeId) },
            },
            {
                $lookup: {
                    from: process?.env?.CLIENT_DATA_COLLECTION,
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'clientData',
                },
            },
            {
                $unwind: '$clientData',
            },
            {
                $project: {
                    employeeId: 1,
                    startDate: 1,
                    endDate: 1,
                    startTime: 1,
                    endTime: 1,
                    clientName: '$clientData.clientName',
                    // Include other fields from employee_Assignment collection if needed
                },
            },
        ]);
        // const records = await EmployeeEngagement.find({
        //     agencyId: query?.agencyId,
        //     employeeId: query?.employeeId,
        // });
        return formatResponse(records, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const addEmployeeEngagementService = async (payload) => {
    try {
        const payloadValidation = addEmployeeEngagementValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        // const query = {
        //     $or: [
        //         { employeeId: payload.employeeId },
        //         { clientId: payload.clientId },
        //         { agencyId: payload.agencyId }
        //     ]
        // };

        // const employeeEngagementData = await EmployeeEngagement
        //     .find(query)
        //     .sort({ endDate: -1 })
        //     .limit(1);

        const {
            employeeId,
            clientId,
            agencyId,
            startDate,
            endDate,
            startTime,
            endTime,
            salaryDetails,
        } = payload;

        const existingRecord = await EmployeeEngagement.findOne({
            // clientId,
            agencyId,
            employeeId,
            $or: [
                {
                    $and: [
                        { startDate: { $lte: startDate } },
                        { endDate: { $gte: startDate } },
                    ],
                },
                {
                    $and: [
                        { startDate: { $lte: endDate } },
                        { endDate: { $gte: endDate } },
                    ],
                },
                {
                    $and: [
                        { startDate: { $gte: startDate } },
                        { endDate: { $lte: endDate } },
                    ],
                },
            ],
        });

        if (existingRecord) {
            return formatResponse('Record already exists within the specified range', 400);
        }

        const newRecord = await EmployeeEngagement.create({
            employeeId,
            clientId,
            agencyId,
            startDate,
            endDate,
            startTime,
            endTime,
        });

        logger.info('stored engagement details');

        // add salary details
        const {
            salary,
            additionalAllowance,
            washingAllowance,
            uniformCharges,
            esi,
            earnedLeave,
            nfh,
            bonus,
            relievingCharges,
            serviceCharges,
            total,
        } = salaryDetails;

        const filter = { employeeId };
        const update = {
            salary,
            additionalAllowance,
            washingAllowance,
            uniformCharges,
            esi,
            earnedLeave,
            nfh,
            bonus,
            relievingCharges,
            serviceCharges,
            total,
            assignmentId: newRecord?._id,
        };
        const options = { upsert: true, new: true };
        await Salary.findOneAndUpdate(filter, update, options).catch(async (e) => {
            if (!existingRecord) {
                logger.info('deleting the record');
                await EmployeeEngagement.deleteOne({ _id: newRecord?._id });
            }
            throw Exception(e, 500);
        });
        logger.info('stored salary details');

        const paymentRecord = await Payment.findOne({ clientId, agencyId });

        // if (!paymentRecord) {
        //     const newPaymentRecord = await Payment.create({
        //         clientId,
        //         agencyId,
        //         esiStatus: '',
        //         esiPayout: '',
        //         esiDueDate: null,
        //         pfStatus: '',
        //         pfPayout: '',
        //         pfDueDate: null,
        //         earnedLeaveStatus: '',
        //         earnedLeavePayout: '',
        //         earnedLeaveDueDate: null,
        //         nfhStatus: '',
        //         nfhPayout: '',
        //         nfhDueDate: null,
        //         bonusStatus: '',
        //         bonusPayout: '',
        //         bonusDueDate: null,
        //         createdDate: new Date(),
        //         editedDate: new Date(),
        //     });
        //     logger.info("Added new payment record")
        // }
        return formatResponse(newRecord, 200);
        // if (employeeEngagementData?.length === 0) {
        //     const newEntry = new EmployeeEngagement(payload);
        //     await newEntry.save();
        //     return formatResponse(newEntry, 200);
        // } else if (employeeEngagementData?.length > 0 && new Date(payload.startDate) > new Date(employeeEngagementData?.[0].endDate)) {
        //     const newEntry = new EmployeeEngagement(payload);
        //     await newEntry.save();
        //     return formatResponse(newEntry, 200);
        // } else {
        //     return formatResponse("Start date should be higher than the end date of the last assignment", 400);
        // }
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const updateSalaryDetailsService = async (payload, roles) => {
    try {
        const payloadValidation = updateEmployeeSalaryDetailsValidator.validate(payload);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const { agencyId, salaryDetails } = payload;

        const updates = salaryDetails.map((salaryDetail) => {
            const {
                _id, salary,
                earnedLeave,
                washingAllowance,
                esi,
                pf,
                uniformCharges,
                additionalAllowance,
            } = salaryDetail;
            const filter = { employeeId: _id };
            const update = {
                salary, earnedLeave, washingAllowance, esi, pf, uniformCharges, additionalAllowance,
            };
            const options = { upsert: true, new: true };
            return Salary.findOneAndUpdate(filter, update, options).catch((e) => { throw Exception(e, 500); });
        });

        await Promise.all(updates);
        return formatResponse('Entries updated successfully', 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

const getEmployeesSalaryDetailsService = async (query, roles) => {
    try {
        const payloadValidation = getEmployeeSalaryDetailsValidator.validate(query);
        if (payloadValidation?.error) {
            throw Exception(payloadValidation.error?.message, 400);
        }
        const { agencyId } = query;
        const result = await Employee.aggregate([
            {
                $match: { agencyId: mongoose.Types.ObjectId(agencyId), status: 'ACTIVE' },
            },
            {
                $lookup: {
                    from: process.env?.SALARY_DETAILS_COLLECTION,
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'salaryDetails',
                },
            },
            {
                $addFields: {
                    salary: {
                        $cond: {
                            if: { $size: '$salaryDetails' },
                            then: { $arrayElemAt: ['$salaryDetails', 0] },
                            else: {},
                        },
                    },
                },
            },
            {
                $unwind: '$salary',
            },
            {
                $project: {
                    name: 1,
                    designation: 1,
                    employeeId: 1,
                    salaryId: '$salary._id',
                    salary: '$salary.salary',
                    earnedLeave: '$salary.earnedLeave',
                    washingAllowance: '$salary.washingAllowance',
                    esi: '$salary.esi',
                    pf: '$salary.pf',
                    uniformCharges: '$salary.uniformCharges',
                    additionalAllowance: '$salary.additionalAllowance',
                },
            },
        ]);
        return formatResponse(result, 200);
    } catch (error) {
        return formatResponse(error, error?.statusCode);
    }
};

module.exports = {
    createEmployeeService,
    getEmployeesService,
    getEmployeeByIdService,
    updateEmployeeDetailsService,
    getEmployeeInsuranceDetailsService,
    updateEmployeeInsuranceFormService,
    deleteEmployeeByIdService,
    addEmployeeEngagementService,
    getEmployeeEngagementListService,
    getEmployeesSalaryDetailsService,
    updateSalaryDetailsService,
};
