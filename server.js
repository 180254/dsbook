var express = require("express");
var app = express();
var router = express.Router();
var db = require('./db.js')
var path = __dirname + '/views/';

var mongoose = require('mongoose');

var Notyfication = mongoose.model('Notyfication', require('./models/notyfication.js'));
var User = mongoose.model('User', require('./models/user.js'));

router.use(function (req, res, next) {
	console.log("I got method " +
		"/" + req.method);
	next();
});

router.get("/", function (req, res) {
	res.sendFile(path + "index.html");
	var id = req.param('id');
	if (id != undefined) {
		console.log("I got id " + id);
	}
});

router.get("/about", function (req, res) {
	res.sendFile(path + "about.html");
});

router.get("/contact", function (req, res) {
	res.sendFile(path + "contact.html");
});

app.use("/", router);

app.use('/notyfication/', function (req, res) {
	console.log("dziala");
	console.log(req)
	res.sendStatus(201)
})

app.use("*", function (req, res) {
	res.sendFile(path + "404.html");
});

app.listen(3000, function () {
	console.log("Live at Port 3000");
});
