"use strict";

const NodeCache = require("node-cache");

const tokensMap = new NodeCache({
    stdTTL: 604800 /* expire tokens after one week */,
    checkperiod: 86400 /* check every one day */
});

// ###################################################################################################################

let DEBUG = false;

// ###################################################################################################################

/**
 * @enum {string}
 */
const accountTypes = {
    PORTIER: "PORTIER",
    STUDENT: "STUDENT"
};

const predefAccount = [
    {
        username: "portier",
        password: "portier",
        accType: accountTypes.PORTIER
    }
];

// ###################################################################################################################

/**
 * @typedef {Object} AccountInfo
 * @property {string} token
 * @property {number} tokenExpire
 * @property {string} user
 * @property {string} accType
 */

// ###################################################################################################################

const userRoute = require("./user.js");

/**
 * Do user authentication.
 *
 * @param {string|undefined|null} username
 * @param {string|undefined|null} password
 * @return {Promise<undefined,undefined>}
 */
function authAsync(username, password) {
    return new Promise((resolve, reject) => {

        if (DEBUG) {
            let loggedIn = false;

            if (username.match(/[0-9]{3}-[0-9]/)) {
                loggedIn = password == "student";

            }
            else if (username == "portier") {
                loggedIn = password == "portier";
            }

            const callback = loggedIn ? resolve : reject;
            setTimeout(callback, 500);
        } else {
            reject();
            // TODO: implement real auth logic
        }
    });
}

/**
 *
 * Do user authentication & generate session token.
 *
 * @param {string|undefined|null} username
 * @param {string|undefined|null} password
 * @return {Promise<AccountInfo, undefined>}
 */
function authTokenAsync(username, password) {
    return authAsync(username, password)
        .then(() => {

            const nextToken = _nextRandomToken();
            tokensMap.set(nextToken, username);
            userRoute.findOrCreate(username);

            return {
                token: nextToken,
                tokenExpire: tokensMap.getTtl(nextToken),
                user: username,
                accType: _accountType(username)
            };
        });
}

/**
 * Check if session token is proper and retrieve account info.
 *
 * @param {string|undefined|null} token
 * @return {Promise<AccountInfo, undefined>}
 */
function checkTokenAsync(token) {
    return new Promise((resolve, reject) => {

        tokensMap.get(token || "", (err, value) => {
            if (!err && value !== undefined) {
                const username = value;
                resolve({
                    token: token,
                    tokenExpire: tokensMap.getTtl(token),
                    user: username,
                    accType: _accountType(username)
                });

            } else {
                reject();
            }
        });
    });
}

/**
 * Pre-authenticate function for non-public request.
 * Check if user is logged in and (optionally) has specific account type.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {string|undefined|null} accType
 * @return {Promise<AccountInfo, undefined>}
 */
function verifyTokenAsync(req, res, next, accType) {
    const token = req.cookies.token || req.query.token;

    return checkTokenAsync(token)
        .then((accInfo) => {
            if (accType && accInfo.accType !== accType) {
                res.status(403/*Forbidden*/).send({});
                throw undefined;
            }

            return accInfo;

        })
        .catch((err) => {
            res.status(401/*Unauthorized*/).send({});
            throw err;
        });
}

/**
 * Pre-authenticate function for public request.
 * Will pass even if user is not logged in, but accInfo will be null.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @return {Promise<AccountInfo|null, undefined>}
 */
function verifyNoneAsync(req, res, next) {
    const token = req.cookies.token || req.query.token;

    return checkTokenAsync(token)
        .then((accInfo) => {
            return accInfo;

        })
        .catch((err) => {
            return null;
        });
}


// ###################################################################################################################

/**
 * Randomize next session token. It is guaranteed that token is unique.
 * @return {string} randomized token
 */
function _nextRandomToken() {
    let token;
    do {
        token = Math.random().toString(36);
    } while (tokensMap.get(token));
    return token;
}

/**
 * Check type of account for specific username.
 *
 * @param {string} username proper (already validated) username
 * @return {string} account type
 */
function _accountType(username) {
    const filtered = predefAccount.filter(a => a.username === username);

    return filtered.length > 0
        ? filtered[0].accType
        : accountTypes.STUDENT;
}

// ###################################################################################################################

exports.DEBUG = {
    get: function () {
        return DEBUG;
    },
    set: function (flag) {
        DEBUG = flag;
    }
};

exports.accountTypes = accountTypes;
exports.authTokenAsync = authTokenAsync;
exports.checkTokenAsync = checkTokenAsync;
exports.verifyTokenAsync = verifyTokenAsync;
exports.verifyNoneAsync = verifyNoneAsync;

// POST /api/auth/login
exports.authLoginReq = function (req, res, next) {
    authTokenAsync(req.body.username, req.body.password)
        .then((accInfo) => {
            res.status(200).send(accInfo);
        })
        .catch(() => {
            res.status(400).send({});
        });
};


// GET /api/auth/current
exports.authCurrentReq = function (req, res, next) {
    verifyTokenAsync(req, res, next, undefined)
        .then((accInfo) => {
            res.send(accInfo);
        })
        .catch(() => {
            res.status(400).send({});
        });
};

// POST /api/auth/verify
exports.authVerifyReq = function (req, res, next) {
    checkTokenAsync(req.body.token)
        .then((accInfo) => {
            res.status(200).send(accInfo);
        })
        .catch(() => {
            res.status(400).send({});
        });
};
