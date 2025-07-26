/*
 * This file contains unit test cases for token service module
 *
 * Author: Aayush Gour
 */

const { expect } = require('chai');
const {
    describe, before, it, after,
} = require('mocha');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectToDatabase, closeDatabase } = require('../../../../server');
const { validateToken, generateToken } = require('../token.service');
const { responseMessages } = require('../../../utility/constants');
const { loginTestHelper, createUserHelper } = require('../../../../test-utils/user.helper');

describe('Unit tests for token service', () => {
    describe('ValidateToken', () => {
        let loginResponse;
        let mockMongoDB;
        before(async () => {
            mockMongoDB = await MongoMemoryServer.create();
            await connectToDatabase(mockMongoDB.getUri());
            await createUserHelper();
            loginResponse = await loginTestHelper();
        });
        after(async () => {
            await closeDatabase();
            mockMongoDB?.stop();
        });
        it('validate token with valid token', async () => {
            const params = {
                token: loginResponse?.data?.token,
            };
            const validationResponse = await validateToken(params);
            expect(validationResponse?.isValid).to.be.equal(true);
        });

        it('validate token with invalid token', async () => {
            const params = {
                token: 'invalid token',
            };
            const validationResponse = await validateToken(params);
            expect(validationResponse?.isBoom).to.equal(true);
            expect(validationResponse?.message).to.equal(responseMessages.INVALID_TOKEN_STRUCTURE);
        });

        it('validate token with expired token', async () => {
            const params = {
                token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmJhOTk5Mjg4M2UwNTFmY2I3NDZkZiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2NjgwODQwMjcsImV4cCI6MTY2ODk0ODAyN30.QfCNv4atUq-cYRDmWWz0MBfQO1WTRjWhpH_2PIsHoaF2eu9EZp5bXgSZQW7EcT1GStLwGRsRaAfdyWiINzsFGA',
            };
            const validationResponse = await validateToken(params);
            expect(validationResponse?.isBoom).to.equal(true);
            expect(validationResponse?.output.statusCode).to.equal(401);
        });

        it('validate token with invalid token (invalid emailID)', async () => {
            const tokenPayload = {
                emailId: 'testEmail@testmal.com',
            };
            const { TOKEN_TIMEOUT } = process.env;
            const { HASHING_KEY } = process.env;
            const token = generateToken(tokenPayload, HASHING_KEY, TOKEN_TIMEOUT);
            const params = {
                token,
            };
            const validationResponse = await validateToken(params);
            expect(validationResponse?.isValid).to.equal(false);
            expect(validationResponse?.credentials).to.be.a('null');
        });
    });
});
