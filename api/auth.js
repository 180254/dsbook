"use strict";

const exec = require('child_process').exec;

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

/**
 * Predefined accounts that are proper but aren't authorized by authorization logic/server (example: radius).
 * @type {[*]}
 */
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
 * @return {Promise<string,string>}
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
            setTimeout(() => callback("authAsync=" + loggedIn), 500);

        } else { // REAL AUTH LOGIC
            const radtest = exec('radtest ' + username + ' ' + password +
                ' localhost 18128 testing123 | grep rad_recv | cut -d " " -f2 | head -1');

            radtest.stdout.on('data', function (data) {
                const response = data.split('\n')[0];

                if (response == "Access-Accept") {
                    resolve("ok")
                }
                else {
                    reject("reject")
                }
            });
        }
    });
}

/**
 *
 * Do user authentication & generate session token.
 *
 * @param {string|undefined|null} username
 * @param {string|undefined|null} password
 * @return {Promise<AccountInfo, string>}
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

// ###################################################################################################################
/**
 * Check if session token is proper and retrieve account info.
 *
 * @param {string|undefined|null} token
 * @return {Promise<AccountInfo, string>}
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
                reject("bad session token");
            }
        });
    });
}

// ###################################################################################################################


/**
 * Get token given in request.
 *
 * @param req
 * @return {string|undefined}
 */
function getReqToken(req) {
    return req.cookies.token || req.query.token
}

/**
 * Pre-authenticate function for non-public request.
 * Check if user is logged in and (optionally) has specific account type.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {string|undefined|null} accType
 * @return {Promise<AccountInfo, string>}
 */
function verifyReqTokenAsync(req, res, next, accType) {
    const token = getReqToken(req);

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
function verifyReqNoneAsync(req, res, next) {
    const token = getReqToken(req);

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
exports.verifyReqTokenAsync = verifyReqTokenAsync;
exports.verifyReqNoneAsync = verifyReqNoneAsync;

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
    checkTokenAsync(getReqToken(req))
        .then((accInfo) => {
            res.status(200).send(accInfo);
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
