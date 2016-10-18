var mongoose = require('mongoose');

var User = mongoose.model('User', require('./model/user.js'));
var Notification = mongoose.model('Notification', require('./model/notification.js'));

// post new notification
// parameters: req.body.username, req.body.body
exports.postNotification = function (req, res, next) {
	console.log("post notification");
	Notification.create({
		username: req.body.username,
		body: req.body.body
	}, function (error, doc) {
		if (error) {
			console.log(error);
			res.sendStatus(404);
		} else {
			res.sendStatus(201);
		}
	});
};

// get all notifications for porter,
// when active == 1 then return only active notifications
// when active == 0 then return all notifications
// parameters: req.active.active
exports.getNotifications = function (req, res, next) {
	console.log("get notifications");
	if (req.query.active == undefined) {
		res.sendStatus(404)
	} else if (req.query.active) {
		Notification
			.find({
				status: "active"
			}, function (err, docs) {
				if (err) {
					console.log(err);
					res.sendStatus(404)
				}
				res.send(docs);

			});
	} else {
		Notification
			.find({}, function (err, docs) {
				if (err) {
					console.log(err);
					res.sendStatus(404);
				}
				res.send(docs);

			});
	}
};

// get all notifications for students,
// when active == 1 then return only active notifications
// when active == 0 then return all notifications
// parameters: req.query.active, req.query.username
exports.gettNotification = function (req, res, next) {
	console.log("get notification");
	if (req.query.active == undefined || req.query.username == undefined) {
		res.sendStatus(404)
	} else if (req.query.active) {
		Notification
			.find({
				username: req.query.username,
				status: "active"
			}, function (err, docs) {
				if (err) {
					console.log(err);
					res.sendStatus(404)
				}
				res.send(docs);
			});
	} else {
		Notification
			.find({
				username: req.query.username
			}, function (err, docs) {
				if (err) {
					console.log(err);
					res.sendStatus(404)
				}
				res.send(docs);
			});
	}
};
