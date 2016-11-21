const https = require("https");
const fs = require("fs");

const mongoose = require("mongoose");
const auth = require("./auth");

const NotificationSchema = require("./../model/notification.js");
const Notification = mongoose.model("Notification", NotificationSchema);

const UserSchema = require("./../model/user.js");
const User = mongoose.model("User", UserSchema);

// -------------------------------------------------------------------------------------------------------------------
// CONFIG, login, password?

// http://bramka.gsmservice.pl/docs/HTTP_API_Bramka_SMS.pdf

/**
 * @typedef {Object} SmsConfig
 * @property {string} login
 * @property {string} password
 */

/**
 * @type {SmsConfig}
 */
let config = {};

const initConfig = function () {
    const gConfig = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf8"));
    config = gConfig["gsmServiceApi"];
};

const isConfigured = function () {
    return !!config.login && !!config.password;
};

const MESSAGE = "DSBook: nowe powiadomienie jest dostępne w systemie.";

// -------------------------------------------------------------------------------------------------------------------
// SEND SMS API

const sendSMS = function (recipient, message, onOk, onErr) {
    const url = "https://api.gsmservice.pl/v5/send.php?" +
        "login=" + encodeURIComponent(config.login) +
        "&pass=" + encodeURIComponent(config.password) +
        "&recipient=" + encodeURIComponent(recipient) +
        "&message=" + encodeURIComponent(message);

    https.get(url, (res) => {
        let str = "";

        res.on("data", (chunk) => {
            str += chunk;
        });

        res.on("end", () => {
            if (str.startsWith("OK"))
                onOk(str);
            else
                onErr(str);
        });
    }).on("error", (e) => {
        onErr(e);
    });
};

//noinspection JSUnusedLocalSymbols
const example = function () {
    sendSMS("48500900900", "Testowa\nąśłżźćóń\nĄŚÓŻŹĆŃ\nlama",
        function (ret) {
            console.log("OK [" + ret + "]");
        },
        function (err) {
            console.log("ERR [" + err + "]")
        }
    );
};

// -------------------------------------------------------------------------------------------------------------------
// SEND NOTIFICATION TO USER API

exports.initConfig = initConfig;

// GET /api/sms/send
// parameters: req.body.notification_id
exports.postSmsSendReq = function (req, res, next) {
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

        // send response. sms will be send async
        res.status(200).send({
            "status": "OK"
        });

        // is sms configured?
        if (!isConfigured()) {
            console.log(`sms-api[${notID}]: sms not configured (config.json)`);
            return;
        }

        // find notification with given id
        // callback(notification)
        const nFind = function (id, callback) {
            Notification.findOne(
                {_id: id},
                (err, doc) => {
                    if (err) {
                        console.log(`sms-api[${notID}]: nFind error ${err}`);
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
                        console.log(`sms-api[${notID}]: uFind error ${err}`);
                        return;
                    }

                    callback(docs);
                }
            );
        };

        // send sms to all recipients
        nFind(notID, (notification) => {
            uFind(notification, (users) => {
                for (const user of users) {

                    if (!user.mobile) {
                        console.log(`sms-api[${notID}][${user.user}]: mobile not given`);

                    } else if (!user.mobile.match(/48[0-9]{9}/)) {
                        console.log(`sms-api[${notID}][${user.user}]: mobile not proper`);

                    } else {
                        sendSMS(user.mobile, MESSAGE,
                            (ret) => {
                                console.log(`sms-api[${notID}][${user.user}]: ok = ${ret}`);
                            },
                            (err) => {
                                console.log(`sms-api[${notID}][${user.user}]: fail = ${err}`);
                            }
                        );
                    }

                }
            });
        });


    }, (err) => {
        console.log("AssertionError(S0, " + err + ")");
    })
};