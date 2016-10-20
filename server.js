const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serveStatic = require("serve-static");
const cookieParser = require("cookie-parser");

const auth = require("./route/auth.js");
const notification = require("./route/notification.js");

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

router.post("/auth/login", auth.authLoginReq);
router.post("/auth/current", auth.authCurrentReq);
router.post("/auth/verify", auth.authVerifyReq);
router.get("/auth/test/any", auth.authTestAnyReq);
router.get("/auth/test/portier", auth.authTestPortierReq);
router.get("/auth/test/student", auth.authTestStudentReq);

router.post("/notification", notification.postNotification);
router.get("/notification", notification.getNotification);
router.get("/notification/counter", notification.getNotificationCounter);

const port = process.argv[2] || 3000;

app.use("/", router);
app.listen(port, function () {
	console.log("Live at Port " + port);
});

module.exports = app;
