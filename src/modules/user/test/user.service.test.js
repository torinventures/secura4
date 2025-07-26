/*
 * This file contains unit test cases for User Service module
 *
 * Author: Aayush Gour
 */

const {
    describe, before, after, it,
} = require('mocha');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai');
const { connectToDatabase, closeDatabase } = require('../../../../server');
const { createUserHelper } = require('../../../../test-utils/user.helper');
const { signupService } = require('../user.service');
const { responseMessages } = require('../../../utility/constants');

describe('Unit test cases for User Service', () => {
    let mockMongoDB;
    before(async () => {
        mockMongoDB = await MongoMemoryServer.create();
        await connectToDatabase(mockMongoDB.getUri());
    });
    after(async () => {
        await closeDatabase();
        mockMongoDB?.stop();
    });

    describe('signupService', () => {
        it('signup new user', async () => {
            await createUserHelper();
            const payload = {
                emailId: 'tester@gmail.com',
                password: 'password',
            };
            const serviceResponse = await signupService(payload);
            expect(serviceResponse?.data).to.be.equal(responseMessages.USER_CREATED);
            expect(serviceResponse?.statusCode).to.be.equal(201);
            expect(serviceResponse?.isBoom).to.be.equal(false);
        });
        it('signup existing user', async () => {
            await createUserHelper();
            const payload = {
                emailId: process.env?.TEST_EMAIL,
                password: process.env?.TEST_PASSWORD,
            };
            const serviceResponse = await signupService(payload);
            expect(serviceResponse?.message).to.be.equal(responseMessages.USER_ALREADY_EXISTS);
            expect(serviceResponse?.output?.statusCode).to.be.equal(400);
            expect(serviceResponse?.isBoom).to.be.equal(true);
        });
        it('signup with invalid payload', async () => {
            const payload = {
                user: 'tester',
                pwd: 'testPWD',
            };
            const serviceResponse = await signupService(payload);
            expect(serviceResponse?.message).to.be.oneOf([responseMessages.PASSWORD_IS_REQUIRED, responseMessages.EMAIL_ID_IS_REQUIRED]);
            expect(serviceResponse?.output?.statusCode).to.be.equal(400);
            expect(serviceResponse?.isBoom).to.be.equal(true);
        });
    });
});
