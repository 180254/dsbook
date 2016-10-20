"use strict";

const mongoose = require("mongoose");
const auth = require("./auth");

const User = mongoose.model("User", require("./../model/user.js"));
const Notification = mongoose.model("Notification", require("./../model/notification.js"));


// GET /notification
// parameters: req.query._id, req.query.room, req.query.user, req.query.status
exports.getNotification = function (req, res, next) {
	auth.verifyTokenAsync(req, res, next, undefined).then((accInfo) => {

		const reqFilters = req.query;

		// room filter is given => should be number-only
		if (
			reqFilters.room
			&& !/^[0-9]+$/.test(reqFilters.room)
		) {
			res.status(400).send({});
			return;
		}

		// user filter is not given => requester must be portier
		if (
			!reqFilters.user
			&& !(accInfo.accType === auth.accountTypes.PORTIER)
		) {
			res.status(403).send({});
			return;
		}

		// user filter is given => requester must be portier or student must ask about yourself
		if (
			reqFilters.user
			&& !(accInfo.accType === auth.accountTypes.PORTIER || reqFilters.user === accInfo.user)
		) {
			res.status(403).send({});
			return;
		}

		// status should be array: semicolon separated string
		reqFilters.status = reqFilters.status
			? reqFilters.status.split(",")
			: undefined;

		// status filter is given => status must be have proper value
		if (
			reqFilters.status
			&& reqFilters.status.some(s => !Notification.schema.path('status').enumValues.includes(s))
		) {
			res.status(400).send({});
			return;
		}

		const mongoFilters = {};
		reqFilters._id && (mongoFilters._id = reqFilters._id);
		reqFilters.room && (mongoFilters.user = new RegExp(String.raw`^${reqFilters.room}\-?\d*$`));
		reqFilters.user && (mongoFilters.user = reqFilters.user);
		reqFilters.status && (mongoFilters.status = {"$in": reqFilters.status});

		Notification
			.find(
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
	})
};

// GET /notification/counter
// parameters: req.query.room, req.query.user, req.query.status
exports.getNotificationCounter = function (req, res, next) {
	auth.verifyTokenAsync(req, res, next, undefined).then((accInfo) => {

		const reqFilters = req.query;

		// room filter is given => should be number-only
		if (
			reqFilters.room
			&& !/^[0-9]+$/.test(reqFilters.room)
		) {
			res.status(400).send({});
			return;
		}

		// user filter is not given => requester must be portier
		if (
			!reqFilters.user
			&& !(accInfo.accType === auth.accountTypes.PORTIER)
		) {
			res.status(403).send({});
			return;
		}
		// status should be array: semicolon separated string
		reqFilters.status = reqFilters.status
			? reqFilters.status.split(",")
			: undefined;

		// status filter is given => status must be have proper value
		if (
			reqFilters.status
			&& reqFilters.status.some(s => !Notification.schema.path('status').enumValues.includes(s))
		) {
			res.status(400).send({});
			return;
		}

		const mongoFilters = {};
		reqFilters.room && (mongoFilters.user = new RegExp(String.raw`^${reqFilters.room}\-?\d*$`));
		reqFilters.user && (mongoFilters.user = reqFilters.user);
		reqFilters.status && (mongoFilters.status = {"$in": reqFilters.status});

		Notification
			.count(
				mongoFilters,
				(err, count) => {
					if (err) {
						res.status(500).send({});
						console.log(err);
						return;
					}

					res.status(200).send({counter: count})
				}
			);
	})
};

// POST /notification
// parameters: req.body.user, req.body.content
exports.postNotification = function (req, res, next) {
	auth.verifyTokenAsync(req, res, next, auth.accountTypes.PORTIER).then((accInfo) => {

		const newNotification = new Notification({
			user: req.body.user,
			content: req.body.content
		});

		var error = newNotification.validateSync(undefined);
		if (error) {
			res.status(400).send({});
			return;
		}
		newNotification.save(
			(err, doc) => {
				if (err) {
					console.log(err);
					res.status(500).send({});
				} else {
					res.status(201).send(doc);
				}
			}
		);
	});
};
