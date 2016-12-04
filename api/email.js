"use strict";
var nodemailer = require('nodemailer');
const fs = require("fs");
const mongoose = require("mongoose");
const auth = require("./auth");

const NotificationSchema = require("./../model/notification.js");
const Notification = mongoose.model("Notification", NotificationSchema);

const UserSchema = require("./../model/user.js");
const User = mongoose.model("User", UserSchema);

const MESSAGE = "DSBook: nowe powiadomienie jest dostępne w systemie.";

let config = {};

const initConfig = function () {
    const gConfig = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf8"));
    config = gConfig["emailService"];
};

const isConfigured = function () {
    return !!config.user && !!config.pass;
};

function sendEmail(email) {	

	var mailOptions = {
		from: config.from,
		to: email,
		subject: MESSAGE,
		text: MESSAGE
	};
	
	var smtpConfig = {
		host: config.host,
		port: config.port,
		secure: config.secure,
		auth: {
			user: config.user,
			pass: config.pass
		}
	};
	var transporter = nodemailer.createTransport(smtpConfig);

	transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log('Email error: ' + error);
    }else{
        console.log('Email sent: ' + info.response);
    };
});
}

exports.initConfig = initConfig;

// GET /api/email/send
// parameters: req.body.notification_id
exports.postemailSendReq = function (req, res, next) {
    auth.verifyReqTokenAsync(req, res, next, auth.accountTypes.PORTIER).then((accInfo) => {

        //noinspection JSUnresolvedVariable
        const notID = req.body.notification_id;

        // notification id is required
        if (!notID) {
            res.status(400).send({});
            return;
        }

        // notification__id must be proper (or 500 is thrown by mongo)
        if (!notID.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).send({});
            return;
        }

        // send response. email will be send async
        res.status(200).send({
            "status": "OK"
        });

        // is email configured?
        if (!isConfigured()) {
            console.log(`email-api[${notID}]: email not configured (config.json)`);
            return;
        }

        // find notification with given id
        // callback(notification)
        const nFind = function (id, callback) {
            Notification.findOne(
                {_id: id},
                (err, doc) => {
                    if (err) {
                        console.log(`email-api[${notID}]: nFind error ${err}`);
                        return;
                    }
                    callback(doc);
                }
            );
        };

        // util to convert string to regexp
        const escapeRegExp = function (string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        // find users for given notification-recipient
        // callback(users)
        const uFind = function (notification, callback) {
            const recipient = notification.recipient;

            User.find(
                // user "startWith" recipient
                // example: recipient = 200 -> user may be 200, 200-1, 200-2
                // example: recipient = 201-1 -> user may be 201-1
                {"user": new RegExp("^" + escapeRegExp(recipient))},
                (err, docs) => {
                    if (err) {
                        console.log(`email-api[${notID}]: uFind error ${err}`);
                        return;
                    }

                    callback(docs);
                }
            );
        };

        // send email to all recipients
        nFind(notID, (notification) => {
            uFind(notification, (users) => {
                for (const user of users) {

                    if (!user.email) {
                        console.log(`email-api[${notID}][${user.user}]: mobile not given`);
                    } else {
                        sendEmail(user.email);
                    }

                }
            });
        });


    }, (err) => {
        console.log("AssertionError(S0, " + err + ")");
    })
};


	