"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const cookieParser = require("cookie-parser");

const apiAuth = require("./api/auth.js");
const apiNotification = require("./api/notification.js");
const apiUser = require("./api/user.js");
const apiSms = require("./api/sms.js");

const mongoose = require("mongoose");
const dbUri = "mongodb://localhost/dsbook";
mongoose.Promise = global.Promise;
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

apiAuth.DEBUG.set(true);
router.post("/api/auth/login", apiAuth.authLoginReq);
router.get("/api/auth/current", apiAuth.authCurrentReq);
router.post("/api/auth/verify", apiAuth.authVerifyReq);

router.post("/api/notification", apiNotification.postNotificationReq);
router.get("/api/notification", apiNotification.getNotificationReq);
router.get("/api/notification/counter", apiNotification.getNotificationCounterReq);
router.post("/api/notification/status", apiNotification.postNotificationStatusReq);

router.get("/api/user", apiUser.getUserReq);
router.post("/api/user/update", apiUser.postUserUpdateReq);

apiSms.initConfig();
router.post("/api/sms/send", apiSms.postSmsSendReq);

app.use("/", router);

process.on("unhandledRejection", function (err) {
    throw err;
});

process.on("uncaughtException", function (err) {
    throw err;
});

const port = process.argv[2] || 3000;
app.listen(port, function () {
    console.log("Live at Port " + port);
});

module.exports = app;
