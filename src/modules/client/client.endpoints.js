/*
 * This file contains all the endpoints related to client services
 *
 * Author: Aayush Gour
 */

const clientEndpoints = {
    CREATE_CLIENT: '/create-client',
    GET_ALL_CLIENTS: '/get-all-clients',
    GET_CLIENT_BY_ID: '/get-client',
    UPDATE_CLIENT_BY_ID: '/update-client',
    DELETE_CLIENT_BY_ID: '/delete-client',
    MARK_ATTENDANCE: '/mark-attendance',
    GET_ATTENDANCE_DATA: '/get-attendance-data',
    GET_PAYMENT_DATA: '/get-payment-data',
    GET_INVOICE_DATA: '/get-invoice-data',
    SAVE_INVOICE_DATA: '/save-invoice-data',
    UPDATE_ESTIMATE_DATA: '/update-estimate',
};
module.exports = {
    clientEndpoints,
};
