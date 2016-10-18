const NodeCache = require("node-cache");

const tokensMap = new NodeCache({
	stdTTL: 604800 /* expire tokens after one week */,
	checkperiod: 86400 /* check every one day */
});

// ###################################################################################################################

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
 * @property {string} username
 * @property {string} accType
 */

/***
 * @callback requestCallback
 * @param {AccountInfo} accInfo
 */

// ###################################################################################################################

/**
 * @param {string|undefined|null} username
 * @param {string|undefined|null} password
 * @return {boolean}
 */
function auth(username, password) {
	// TODO: implement real auth logic
	return true;
}

/**
 * @param {string|undefined|null} username
 * @param {string|undefined|null} password
 * @return {AccountInfo|undefined}
 */
function authToken(username, password) {
	if (username && password && auth(username, password)) {

		const nextToken = _nextRandomToken();
		tokensMap.set(nextToken, username);

		return {
			token: nextToken,
			tokenExpire: tokensMap.getTtl(nextToken),
			username: username,
			accType: _accountType(username)
		};

	} else {
		return undefined;
	}
}

/**
 * @param {string|undefined|null} token
 * @return {AccountInfo|undefined}
 */
function checkToken(token) {
	if (!token) return undefined;
	const username = tokensMap.get(token);
	if (!username) return undefined;

	return {
		token: token,
		tokenExpire: tokensMap.getTtl(token),
		username: username,
		accType: _accountType(username)
	};
}

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @param {string|undefined|null} accType
 * @param {requestCallback} onSuccess
 */
function verifyToken(req, res, next, accType, onSuccess) {
	const token = req.cookies.token || req.query.token;
	const accInfo = checkToken(token);

	if (!accInfo) {
		res.sendStatus(401); // Unauthorized
	} else if (accType && accInfo.accType !== accType) {
		res.sendStatus(403); // Forbidden
	} else {
		onSuccess(accInfo);
	}
}

// ###################################################################################################################

/**
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
 * @param {string} username proper (already validated) username
 * @return {string} account type
 */
function _accountType(username) {
	const filtered = predefAccount.filter(a => a.username === username);

	if (filtered.length > 0) {
		return filtered[0].accType;
	} else {
		return accountTypes.STUDENT;
	}
}

// ###################################################################################################################

exports.authToken = authToken;
exports.checkToken = checkToken;
exports.verifyToken = verifyToken;

exports.authTokenReq = function (req, res, next) {
	res.send(
		authToken(req.body.username, req.body.password) || {}
	);
};


exports.checkTokenReq = function (req, res, next) {
	res.send(
		checkToken(req.body.token) || {}
	);
};

exports.test0Req = function (req, res, next) {
	verifyToken(req, res, next, undefined, (accInfo) => {
		res.send("Welcome authorized (ANYBODY = " + accInfo.accType + ")")
	})
};

exports.test1Req = function (req, res, next) {
	verifyToken(req, res, next, accountTypes.PORTIER, (accInfo) => {
		res.send("Welcome authorized (PORTIER = " + accInfo.accType + ")")
	})
};

exports.test2Req = function (req, res, next) {
	verifyToken(req, res, next, accountTypes.STUDENT, (accInfo) => {
		res.send("Welcome authorized (STUDENT = " + accInfo.accType + ")")
	})
};
