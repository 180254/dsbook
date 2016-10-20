"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serveStatic = require("serve-static");
const cookieParser = require("cookie-parser");

const authRoute = require("./route/auth.js");
const notificationRoute = require("./route/notification.js");
const userRoute = require("./route/user.js");

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

router.post("/auth/login", authRoute.authLoginReq);
router.post("/auth/current", authRoute.authCurrentReq);
router.post("/auth/verify", authRoute.authVerifyReq);
router.get("/auth/test/any", authRoute.authTestAnyReq);
router.get("/auth/test/portier", authRoute.authTestPortierReq);
router.get("/auth/test/student", authRoute.authTestStudentReq);

router.post("/notification", notificationRoute.postNotification);
router.get("/notification", notificationRoute.getNotification);
router.get("/notification/counter", notificationRoute.getNotificationCounter);
router.post("/notification/status", notificationRoute.postNotificationStatus);

router.get("/user", userRoute.getUser);
router.post("/user/update", userRoute.postUserUpdate);

const port = process.argv[2] || 3000;

app.use("/", router);
app.listen(port, function () {
	console.log("Live at Port " + port);
});

module.exports = app;
