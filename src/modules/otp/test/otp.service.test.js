const { expect } = require('chai');
const {
    describe, before, after, it,
} = require('mocha');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { closeDatabase, connectToDatabase } = require('../../../../server');
const { otpGenerationService, otpValidationService } = require('../otp.service');
const { createUserHelper } = require('../../../../test-utils/user.helper');

describe('Unit test cases for Authentication Service', () => {
    let mockMongoDB;
    before(async () => {
        mockMongoDB = await MongoMemoryServer.create();
        await connectToDatabase(mockMongoDB.getUri());
    });
    after(async () => {
        await closeDatabase();
        mockMongoDB?.stop();
    });
    describe('OTP Validation TEST', () => {
        before(async () => {
            await createUserHelper();
        });
        it('OTP gen test', async () => {
            const payload = {
                emailId: process.env.TEST_EMAIL,
            };
            const serviceResponse = await otpGenerationService(payload);
            // console.log(serviceResponse);
            expect(serviceResponse?.statusCode).to.be.equal(200);
            expect(serviceResponse?.isBoom).to.be.equal(false);
        });

        it('OTP decryption test', async () => {
            const payload = {
                message: '8ab48fd1ff7ec68cdf3914e116309320278070a3d249a416d0b4b38feac9d608581c7a0fa6cc9a98f66f6562e43edc30b7606bc70fabbab09a619bd7bc456f6b1dff93294ac1963b51155f47b73439c6941c13e5dabe8c1b64c0cfb787ad53a5',
            };
            const serviceResponse = await otpValidationService(payload);
            // console.log(serviceResponse);
            expect(serviceResponse?.statusCode).to.be.equal(200);
            expect(serviceResponse?.isBoom).to.be.equal(false);
        });
    });
});
