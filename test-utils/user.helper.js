/*
 * This file contains helper functions to aid in test cases
 *
 * Author: Aayush Gour
 */

const { loginService } = require('../src/modules/auth/auth.service');
const { hashPassword } = require('../src/modules/auth/hashing.service');
const { User } = require('../src/schema/user');

const loginTestHelper = async () => {
    const payload = {
        emailId: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
    };
    const loginResult = await loginService(payload);
    return loginResult;
};

const createUserHelper = async () => {
    const userDetails = {
        password: await hashPassword(process.env.TEST_PASSWORD),
        emailId: process.env?.TEST_EMAIL,
        createdDate: new Date(),
    };
    const newUserObject = new User(userDetails);
    const creationResponse = await User.create(newUserObject);
    return creationResponse;
};

module.exports = {
    loginTestHelper, createUserHelper,
};
