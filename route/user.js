"use strict";

const mongoose = require("mongoose");
const supergoose = require('supergoose');
const auth = require("./auth");

const UserSchema = require("./../model/user.js");
UserSchema.plugin(supergoose);

const User = mongoose.model("User", UserSchema);

exports.findOrCreate = function (user) {
	User.findOrCreate({user: user}, () => undefined);
};

// GET /user
// parameters: req.body.user
exports.getUser = function (req, res, next) {
	auth.verifyTokenAsync(req, res, next, undefined).then((accInfo) => {

		const reqParam = req.query;

		// filter user is provided & requester is student => must ask about yourself
		if (
			reqParam.user
			&& accInfo.accType === auth.accountTypes.STUDENT
			&& !(reqParam.user === accInfo.user)
		) {
			res.status(403).send({});
			return;
		}

		// filter user is not provided & requester is student => should got self
		if (
			!reqParam.user
			&& accInfo.accType === auth.accountTypes.STUDENT
		) {
			reqParam.user = accInfo.user;
		}

		const mongoFilters = {};
		reqParam.user && (mongoFilters.user = reqParam.user);

		User.find(
			mongoFilters,
			(err, docs) => {
				if (err) {
					res.status(500).send({});
					console.log(err);
					return;
				}

				res.status(200).send(docs);
			}
		);
	});
};
