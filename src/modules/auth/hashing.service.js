/*
 * This file contains all the services related to password hashing and comparision for the Authentication Module
 *
 * Author: Aayush Gour
 */
const bcrypt = require('bcrypt');

const hashPassword = async (plainTextPassword, rounds = 10) => {
    const hash = await bcrypt.hash(plainTextPassword, rounds);
    return hash;
};

const comparePassword = async (plainTextPassword, hash) => {
    const result = await bcrypt.compare(plainTextPassword, hash);
    return result;
};

module.exports = {
    hashPassword, comparePassword,
};
