var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var path = __dirname + '/views/'
var mongoose = require('mongoose');
var routes = require('./routes.js');

app.use(bodyParser.json())

var dbUri = 'mongodb://localhost/dsbook';
mongoose.connect(dbUri, () => console.log('Connected to mongodb'));
router.post('/notification', routes.postNotification);
router.get('/notifications', routes.getNotifications);
router.get('/notification', routes.gettNotification);

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

app.use("*", function (req, res) {
	res.sendFile(path + "404.html");
});

app.listen(3000, function () {
	console.log("Live at Port 3000");
});

module.exports = app;
