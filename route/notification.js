"use strict";

const mongoose = require("mongoose");
const auth = require("./auth");

const NotificationSchema = require("./../model/notification.js");
const Notification = mongoose.model("Notification", NotificationSchema);


// GET /notification
// parameters: req.query._id, req.query.room, req.query.user, req.query.status
exports.getNotification = function (req, res, next) {
	auth.verifyTokenAsync(req, res, next, undefined).then((accInfo) => {

		const reqParam = req.query;

		// _id is given => must be proper (or 500 is thrown)
		if (
			reqParam._id
			&& !reqParam._id.match(/^[0-9a-fA-F]{24}$/)
		) {
			res.status(400).send({});
			return;
		}

		// room filter is given => should be number-only
		if (
			reqParam.room
			&& !/^[0-9]+$/.test(reqParam.room)) {
			res.status(400).send({});
			return;
		}

		// user filter is not given => requester must be portier
		if (
			!reqParam.user
			&& !(accInfo.accType === auth.accountTypes.PORTIER)
		) {
			res.status(403).send({});
			return;
		}

		// user filter is given => requester must be portier or student must ask about yourself
		if (
			reqParam.user
			&& !(accInfo.accType === auth.accountTypes.PORTIER || reqParam.user === accInfo.user)
		) {
			res.status(403).send({});
			return;
		}

		// status should be array: semicolon separated string
		reqParam.status = reqParam.status
			? reqParam.status.split(",")
			: undefined;

		// status filter is given => status must be have proper value
		if (
			reqParam.status
			&& reqParam.status.some(s => !Notification.schema.path('status').enumValues.includes(s))
		) {
			res.status(400).send({});
			return;
		}

		const mongoFilters = {};
		reqParam._id && (mongoFilters._id = reqParam._id);
		reqParam.room && (mongoFilters.user = new RegExp(String.raw`^${reqParam.room}\-?\d*$`));
		reqParam.user && (mongoFilters.user = reqParam.user);
		reqParam.status && (mongoFilters.status = {"$in": reqParam.status});

		Notification.find(
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

		const reqParam = req.query;

		// room filter is given => should be number-only
		if (
			reqParam.room
			&& !/^[0-9]+$/.test(reqParam.room)
		) {
			res.status(400).send({});
			return;
		}

		// user filter is not given => requester must be portier
		if (
			!reqParam.user
			&& !(accInfo.accType === auth.accountTypes.PORTIER)
		) {
			res.status(403).send({});
			return;
		}
		// status should be array: semicolon separated string
		reqParam.status = reqParam.status
			? reqParam.status.split(",")
			: undefined;

		// status filter is given => status must be have proper value
		if (
			reqParam.status
			&& reqParam.status.some(s => !Notification.schema.path('status').enumValues.includes(s))
		) {
			res.status(400).send({});
			return;
		}

		const mongoFilters = {};
		reqParam.room && (mongoFilters.user = new RegExp(String.raw`^${reqParam.room}\-?\d*$`));
		reqParam.user && (mongoFilters.user = reqParam.user);
		reqParam.status && (mongoFilters.status = {"$in": reqParam.status});

		Notification.count(
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

		const reqParam = req.body;

		const newNotification = new Notification({
			user: reqParam.user,
			content: reqParam.content
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
					return;
				}

				res.status(200).send(doc);
			}
		);
	});
};

// POST /notification/status
// parameters: req.body._id, req.body.status
exports.postNotificationStatus = function (req, res, next) {
	auth.verifyTokenAsync(req, res, next, undefined).then((accInfo) => {

		const reqParam = req.body;

		// both parameters are required
		if (!reqParam._id || !reqParam.status) {
			res.status(400).send({});
			return;
		}

		// _id is given => must be proper (or 500 is thrown)
		if (
			reqParam._id
			&& !reqParam._id.match(/^[0-9a-fA-F]{24}$/)
		) {
			res.status(400).send({});
			return;
		}

		const mongoFilters = {};
		mongoFilters._id = reqParam._id;

		// user can change only new -> confirmed
		if (accInfo.accType === auth.accountTypes.STUDENT) {
			mongoFilters.status = "new";
		}

		Notification.findOneAndUpdate(
			mongoFilters,
			{status: reqParam.status},
			{},
			(err, doc) => {
				if (err) {
					res.status(500).send({});
					console.log(err);
					return;
				}

				if (doc) {
					doc.status = reqParam.status;
					res.status(200).send(doc);
				} else {
					res.status(400).send({});
				}
			});
	});
};
