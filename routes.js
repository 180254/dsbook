var mongoose = require('mongoose');

var User = mongoose.model('User', require('./models/user.js'));
var Notyfication = mongoose.model('Notyfication', require('./models/notyfication.js'));

// post new notyfication
// parameters: req.body.username, req.body.body
exports.postNotyfication = function (req, res, next) {
	console.log("post notyfication");
	Notyfication.create({
		username: req.body.username,
		body: req.body.body
	}, function (error, doc) {
		if (error) {
			console.log(error)
			res.sendStatus(404);
		} else {
			res.sendStatus(201);
		}
	});
};

// get all notyfications for porter,
// when active == 1 then return only active notyfications
// when active == 0 then return all notyfications
// parameters: req.active.active
exports.getNotyfications = function (req, res, next) {
	console.log("get notyfications");
	if (req.query.active == undefined) {
		res.sendStatus(404)
	} else if (req.query.active) {
		Notyfication
			.find({
				status: "active"
			}, function (err, docs) {
				if (err) {
					console.log(err)
					res.sendStatus(404)
				}
				res.send(docs);
				
			});
	} else {
		Notyfication
			.find({}, function (err, docs) {
				if (err) {
					console.log(err)
					res.sendStatus(404)
				}
				res.send(docs);

			});
	}
};

// get all notyfications for students,
// when active == 1 then return only active notyfications
// when active == 0 then return all notyfications
// parameters: req.query.active, req.query.username
exports.gettNotyfication = function (req, res, next) {
	console.log("get notyfication");
	if (req.query.active == undefined || req.query.username == undefined) {
		res.sendStatus(404)
	} else if (req.query.active) {
		Notyfication
			.find({
				username: req.query.username,
				status: "active"
			}, function (err, docs) {
				if (err) {
					console.log(err)
					res.sendStatus(404)
				}
				res.send(docs);
			});
	} else {
		Notyfication
			.find({
				username: req.query.username
			}, function (err, docs) {
				if (err) {
					console.log(err)
					res.sendStatus(404)
				}
				res.send(docs);
			});
	}
};
