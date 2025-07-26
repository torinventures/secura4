/*
 * This file contains the integration test cases for Authentication Module
 *
 * Author: Aayush Gour
 */
const { expect } = require('chai');
const {
    describe, before, after, it,
} = require('mocha');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { init, connectToDatabase, closeDatabase } = require('../../../../server');
const { authEndpoints } = require('../auth.endpoints');
const { versioned, apiPrefix } = require('../../router/routes.versions');
const { httpProtocols } = require('../../../utility/constants');
const { logger } = require('../../../utility/logger');
const { createUserHelper, loginTestHelper } = require('../../../../test-utils/user.helper');

describe('Integration Tests for Authentication Module', () => {
    // Initialize Server
    let server;
    let mockMongoDB;
    before('Initializing Server', async () => {
        server = await init();
        mockMongoDB = await MongoMemoryServer.create();
        await connectToDatabase(mockMongoDB.getUri());
        await createUserHelper();
    });
    after('Stopping Server', async () => {
        await server.stop();
        await closeDatabase();
        mockMongoDB?.stop();
    });

    // Test Cases
    describe('/api/login', () => {
        it('Login Successfully', async () => {
            const response = await server.inject({
                method: httpProtocols.POST,
                url: `${apiPrefix}${versioned(authEndpoints.LOGIN)}`,
                payload: {
                    emailId: process.env.TEST_EMAIL,
                    password: process.env.TEST_PASSWORD,
                },
            });
            logger.info(response.result);
            expect(response.statusCode).to.equal(200);
        });

        it('Login with empty payload', async () => {
            const response = await server.inject({
                method: httpProtocols.POST,
                url: `${apiPrefix}${versioned(authEndpoints.LOGIN)}`,
                payload: {},
            });
            expect(response.statusCode).to.equal(400);
        });

        it('Login with invalid payload', async () => {
            const response = await server.inject({
                method: httpProtocols.POST,
                url: `${apiPrefix}${versioned(authEndpoints.LOGIN)}`,
                payload: {
                    username: 'test',
                    pwd: 'ppassword',
                },
            });
            expect(response.statusCode).to.equal(400);
        });

        it('Login with invalid HTTP Protocol and empty payload', async () => {
            const response = await server.inject({
                method: httpProtocols.GET,
                url: `${apiPrefix}${versioned(authEndpoints.LOGIN)}`,
                payload: {},
            });
            expect(response.statusCode).to.equal(404);
        });
    });

    describe('/api/refreshToken', () => {
        it('Get Refresh Token with valid token', async () => {
            const loginResponse = await loginTestHelper(server);
            const urlParams = new URLSearchParams({
                refreshToken: loginResponse?.data?.refreshToken,
            });
            const response = await server.inject({
                method: httpProtocols.GET,
                url: `${apiPrefix}${authEndpoints.REFRESH_TOKEN}?${urlParams.toString()}`,
            });
            expect(response.statusCode).to.equal(200);
        });

        it('Get Refresh Token with invalid Token', async () => {
            const urlParams = new URLSearchParams({
                refreshToken: 'invalidToken',
            });
            const response = await server.inject({
                method: httpProtocols.GET,
                url: `${apiPrefix}${authEndpoints.REFRESH_TOKEN}?${urlParams.toString()}`,
            });
            expect(response.statusCode).to.equal(400);
        });

        it('Get Refresh Token with invalid query params', async () => {
            const urlParams = new URLSearchParams({
                tkn: 'invalidToken',
            });
            const response = await server.inject({
                method: httpProtocols.GET,
                url: `${apiPrefix}${authEndpoints.REFRESH_TOKEN}?${urlParams.toString()}`,
            });
            expect(response.statusCode).to.equal(400);
        });

        it('Get Refresh Token with expired Token', async () => {
            const urlParams = new URLSearchParams({
                refreshToken: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmJhOTk5Mjg4M2UwNTFmY2I3NDZkZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2NjgwODQwMjcsImV4cCI6MTY2ODk0ODAyN30.QfCNv4atUq-cYRDmWWz0MBfQO1WTRjWhpH_2PIsHoaF2eu9EZp5bXgSZQW7EcT1GStLwGRsRaAfdyWiINzsFGA',
            });
            const response = await server.inject({
                method: httpProtocols.GET,
                url: `${apiPrefix}${authEndpoints.REFRESH_TOKEN}?${urlParams.toString()}`,
            });
            expect(response.statusCode).to.equal(401);
        });
    });
});
