/*
 * This file combines all the routes defined in the application
 *
 * Author: Aayush Gour
 */
const auth = require('../auth/auth.controller');
const user = require('../user/user.controller');
const client = require('../client/client.controller');
const agency = require('../agency/agency.controller');
const employee = require('../employee/employee.controller');
const common = require('../common/common.controller');

module.exports = [].concat(auth, user, client, employee, common, agency);
