/*
 * This file contains the test cases for User Module
 *
 * Author: Aayush Gour
 */

const { expect } = require('chai');
const {
    describe, before, after, it,
} = require('mocha');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectToDatabase, init, closeDatabase } = require('../../../../server');
const { createUserHelper } = require('../../../../test-utils/user.helper');
const { httpProtocols } = require('../../../utility/constants');
const { apiPrefix } = require('../../router/routes.versions');
const { userEndpoints } = require('../user.endpoints');

describe('Testing User Module', () => {
    // Initializing server
    let server;
    let mockMongoDB;
    before('Initializing Server', async () => {
        mockMongoDB = await MongoMemoryServer.create();
        await connectToDatabase(mockMongoDB.getUri());
        server = await init();
        await createUserHelper();
    });
    after('Stopping Server', async () => {
        await server.stop();
        await closeDatabase();
        mockMongoDB?.stop();
    });

    // Test Cases
    it('Signup new User', async () => {
        const response = await server.inject({
            method: httpProtocols.POST,
            url: `${apiPrefix}${userEndpoints?.SIGNUP}`,
            payload: {
                emailId: 'test@test.com',
                password: 'password',
            },
        });
        expect(response?.statusCode).to.equal(201);
    });

    it('Signup with invalid email ID', async () => {
        const response = await server.inject({
            method: httpProtocols.POST,
            url: `${apiPrefix}${userEndpoints?.SIGNUP}`,
            payload: {
                emailId: 'hello world',
                password: 'password',
            },
        });
        expect(response?.statusCode).to.equal(400);
    });

    it('Signup with invalid payload', async () => {
        const response = await server.inject({
            method: httpProtocols.POST,
            url: `${apiPrefix}${userEndpoints?.SIGNUP}`,
            payload: {
                username: 'hello world',
                passwords: 'password',
            },
        });
        expect(response?.statusCode).to.equal(400);
    });

    it('Signup with existing User', async () => {
        const response = await server.inject({
            method: httpProtocols.POST,
            url: `${apiPrefix}${userEndpoints?.SIGNUP}`,
            payload: {
                emailId: 'test@test.com',
                password: 'password',
            },
        });
        expect(response?.statusCode).to.equal(400);
    });
});
