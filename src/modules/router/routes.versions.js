/*
 * This file contains all the API versioning details for the application
 *
 * Author: Aayush Gour
 */

exports.v1 = '/v1';
exports.v2 = '/v2';
exports.apiPrefix = '/api';

// Use this function if versioning is required
// If this function is not used then the api will take v1 as default
exports.versioned = (endpoint, version = this.v1) => version + endpoint;
