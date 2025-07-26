/*
 * This file contains the unit test cases for Authentication Module
 *
 * Author: Aayush Gour
 */

const { expect } = require('chai');
const {
    describe, after, before, it,
} = require('mocha');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectToDatabase, closeDatabase } = require('../../../../server');
const { createUserHelper, loginTestHelper } = require('../../../../test-utils/user.helper');
const { responseMessages } = require('../../../utility/constants');
const { loginService, refreshTokenService } = require('../auth.service');

describe('Unit test cases for Authentication Module', () => {
    let mockMongoDB;
    before(async () => {
        mockMongoDB = await MongoMemoryServer.create();
        await connectToDatabase(mockMongoDB.getUri());
    });
    after(async () => {
        await closeDatabase();
        mockMongoDB?.stop();
    });

    describe('loginService', async () => {
        before(async () => {
            await createUserHelper();
        });
        it('Login with valid credentials when user exists in DB', async () => {
            const payload = {
                emailId: process.env.TEST_EMAIL,
                password: process.env.TEST_PASSWORD,
            };
            const loginResult = await loginService(payload);
            expect(loginResult?.data).to.be.a('object').and.to.have.keys(['token', 'refreshToken']);
            expect(loginResult.statusCode).to.be.equal(200);
            expect(loginResult?.isBoom).to.equal(false);
        });

        it('Login with invalid email ID when user exists in DB', async () => {
            const payload = {
                emailId: 'tester',
                password: process.env.TEST_PASSWORD,
            };
            const loginResult = await loginService(payload);
            expect(loginResult.message).to.be.equal(responseMessages.EMAIL_ID_MUST_BE_VALID);
            expect(loginResult.output.statusCode).to.be.equal(400);
            expect(loginResult.isBoom).to.be.equal(true);
        });

        it('Login with invalid password when user exists in DB', async () => {
            const payload = {
                emailId: process.env.TEST_EMAIL,
                password: 'password',
            };
            const loginResult = await loginService(payload);
            expect(loginResult.message).to.be.equal(responseMessages.INVALID_CREDENTIALS);
            expect(loginResult.output.statusCode).to.be.equal(401);
            expect(loginResult.isBoom).to.be.equal(true);
        });

        it('Login with invalid payload when user exists in DB', async () => {
            const payload = {
                user: 'tester',
                pwd: 'password',
            };
            const loginResult = await loginService(payload);
            expect(loginResult.message).to.be.equal(responseMessages.EMAIL_ID_IS_REQUIRED);
            expect(loginResult.output.statusCode).to.be.equal(400);
            expect(loginResult.isBoom).to.be.equal(true);
        });
    });
    describe('refreshTokenService', async () => {
        before(async () => {
            await createUserHelper();
        });
        it('Get refresh token with valid refresh token', async () => {
            const loginResponse = await loginTestHelper();
            const query = {
                refreshToken: loginResponse?.data?.refreshToken,
            };
            const refreshTokenResponse = await refreshTokenService(query);
            expect(refreshTokenResponse?.data).to.be.a('object').and.to.have.keys(['token', 'refreshToken']);
            expect(refreshTokenResponse.statusCode).to.be.equal(200);
            expect(refreshTokenResponse?.isBoom).to.equal(false);
        });

        it('Get refresh token with invalid refresh token', async () => {
            const query = {
                refreshToken: 'invalid token',
            };
            const refreshTokenResponse = await refreshTokenService(query);
            expect(refreshTokenResponse?.message).to.equal(responseMessages.INVALID_TOKEN_STRUCTURE);
            expect(refreshTokenResponse?.output?.statusCode).to.be.equal(400);
            expect(refreshTokenResponse?.isBoom).to.equal(true);
        });

        it('Get refresh token with invalid query params', async () => {
            const query = {
                rtkn: 'invalid token',
            };
            const refreshTokenResponse = await refreshTokenService(query);
            expect(refreshTokenResponse?.message).to.equal(responseMessages.REFRESH_TOKEN_IS_REQUIRED);
            expect(refreshTokenResponse?.output?.statusCode).to.be.equal(400);
            expect(refreshTokenResponse?.isBoom).to.equal(true);
        });
    });
});
