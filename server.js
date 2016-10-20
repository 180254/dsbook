const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serveStatic = require("serve-static");
const cookieParser = require("cookie-parser");

const routes = require("./routes.js");
const auth = require("./auth.js");

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
router.post("/auth/verify", auth.authVerifyReq);
router.get("/auth/test/any", auth.authTestAnyReq);
router.get("/auth/test/portier", auth.authTestPortierReq);
router.get("/auth/test/student", auth.authTestStudentReq);

router.post("/notification", routes.postNotification);
router.get("/notifications", routes.getNotifications);
router.get("/notification", routes.gettNotification);

const port = process.argv[2] || 3000;

app.use("/", router);
app.listen(port, function () {
	console.log("Live at Port " + port);
});

module.exports = app;
