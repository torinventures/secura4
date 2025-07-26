/*
 * This file contains all the endpoints related to client services
 *
 * Author: Aayush Gour
 */

const employeeEndpoints = {
    CREATE_EMPLOYEE: '/create-employee',
    GET_ALL_EMPLOYEES: '/get-all-employees',
    GET_EMPLOYEE_BY_ID: '/get-employee',
    UPDATE_EMPLOYEE_BY_ID: '/update-employee',
    GET_EMPLOYEE_INSURANCE_BY_ID: '/get-employee-insurance',
    UPDATE_EMPLOYEE_INSURANCE_BY_ID: '/update-employee-insurance',
    DELETE_EMPLOYEE_BY_ID: '/delete-employee',
    ADD_EMPLOYEE_ENGAGEMENT: '/add-employee-engagement',
    GET_EMPLOYEE_ENGAGEMENT_LIST: '/get-employee-engagement-history',
    GET_EMPLOYEES_SALARY_DETAILS: '/get-employees-salary',
    UPDATE_EMPLOYEES_SALARY_DETAILS: '/update-employees-salary',
};
module.exports = {
    employeeEndpoints,
};
