/*
 * This file contains all the constant values defined for the application
 *
 * Author: Aayush Gour
 */
const httpProtocols = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

const authName = 'custom-jwt';

const responseMessages = {
    INVALID_PAYLOAD: 'Invalid Payload.',
    INVALID_CREDENTIALS: 'Invalid Email or password.',
    USER_NOT_FOUND: 'User not found.',
    TOKEN_EXPIRED: 'Token expired.',
    USER_ALREADY_EXISTS: 'User already exists.',
    CLIENT_ALREADY_EXISTS: 'Client already exists.',
    AGENCY_ALREADY_EXISTS: 'Agency already exists.',
    USER_CREATED: 'User created successfully.',
    CLIENT_CREATED: 'Client created successfully.',
    AGENCY_CREATED: 'Agency created successfully.',
    EMPLOYEE_CREATED: 'Employee created successfully.',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    INVALID_TOKEN_STRUCTURE: 'Invalid token structure',
    FILE_UPLOADED_TO_S3: 'File Uploaded to S3',
    FILE_UPLOADED_SUCCESSFULLY: 'File Uploaded Successfully',
    NO_FILES_AVAILABLE: 'No files available.',
    EMAIL_ID_MUST_BE_VALID: '"emailId" must be a valid email',
    EMAIL_ID_IS_REQUIRED: '"emailId" is required',
    PASSWORD_IS_REQUIRED: '"password" is required',
    REFRESH_TOKEN_IS_REQUIRED: '"refreshToken" is required',
    NO_USERS_FOUND: 'No users found',
    NO_CLIENTS_FOUND: 'No clients found',
    UNABLE_TO_DELETE_EMPLOYEE: 'Unable to delete employee',
    EMPLOYEE_DELETED: 'Employee Deleted Successfully',
    CLIENT_DELETED: 'Client Deleted Successfully',
    NO_AGENCIES_FOUND: 'No agencies found',
    NO_EMPLOYEES_FOUND: 'No employees found',
    NO_DATA_AVAILABLE: 'No data available.',
    USER_DOES_NOT_HAVE_ACCESS: 'User does not have access',
    DATA_UPDATED_SUCCESSFULLY: 'Data updated successfully.',
};

const rolesList = {
    ADMIN: 'ADMIN',
    SUPERADMIN: 'SUPERADMIN',
    EMPLOYEE: 'EMPLOYEE',
    CLIENT: 'CLIENT',
    USER: 'USER',
};

module.exports = {
    httpProtocols,
    authName,
    responseMessages,
    rolesList,
};
