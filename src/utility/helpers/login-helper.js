/*
 * This file contains helper functions for role based access
 *
 * Author: Aayush Gour
 */

/*
    Checks if user has the roles assigned
    Return Params:{

        // true if user has all the roles. false otherwise
        hasStrictAccess: Boolean,

        // true if user has at least one of the roles. false otherwise
        hasPartialAccess: Boolean,

        // Object containing the list of roles the user has access to
        accessList: Object,
    }
 */
const checkUserAccess = (req, access = []) => {
    const scopeList = req.auth?.credentials?.roles;
    const rbacListObj = access?.reduce((acc, curr) => ({ ...acc, [curr]: scopeList.includes(curr) }), {});
    return { hasStrictAccess: Object.values(rbacListObj)?.every((val) => !!val), hasPartialAccess: Object.values(rbacListObj).includes(true), accessList: rbacListObj };
};

module.exports = {
    checkUserAccess,
};
