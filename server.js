"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serveStatic = require("serve-static");
const cookieParser = require("cookie-parser");

const apiAuth = require("./api/auth.js");
const apiNotification = require("./api/notification.js");
const apiUser = require("./api/user.js");

const dbUri = "mongodb://localhost/dsbook";
mongoose.connect(dbUri, (err) => {
	if (err) {
		console.log("mongoose.connect: FAIL (!)");
		console.log("stopping server ...");
		process.exit(0);
	} else {
		console.log("mongoose.connect: OK")
	}
});

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(serveStatic("view", {"index": ["index.html"]}));

router.post("/api/auth/login", apiAuth.authLoginReq);
router.post("/api/auth/current", apiAuth.authCurrentReq);
router.post("/api/auth/verify", apiAuth.authVerifyReq);
router.get("/api/auth/test/any", apiAuth.authTestAnyReq);
router.get("/api/auth/test/portier", apiAuth.authTestPortierReq);
router.get("/api/auth/test/student", apiAuth.authTestStudentReq);

router.post("/api/notification", apiNotification.postNotificationReq);
router.get("/api/notification", apiNotification.getNotificationReq);
router.get("/api/notification/counter", apiNotification.getNotificationCounterReq);
router.post("/api/notification/status", apiNotification.postNotificationStatusReq);

router.get("/api/user", apiUser.getUserReq);
router.post("/api/user/update", apiUser.postUserUpdateReq);

const port = process.argv[2] || 3000;

app.use("/", router);
app.listen(port, function () {
	console.log("Live at Port " + port);
});

module.exports = app;
