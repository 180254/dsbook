"use strict";

const mongoose = require("mongoose");
const auth = require("./auth");

const NotificationSchema = require("./../model/notification.js");
const Notification = mongoose.model("Notification", NotificationSchema);


// GET /api/notification
// parameters: req.query._id, req.query.recipient, req.query.status
exports.getNotificationReq = function (req, res, next) {
    auth.verifyReqTokenAsync(req, res, next, undefined).then((accInfo) => {

        const reqParam = req.query;

        // _id is given => must be proper (or 500 is thrown)
        if (
            reqParam._id
            && !reqParam._id.match(/^[0-9a-fA-F]{24}$/)
        ) {
            res.status(400).send({});
            return;
        }

        // recipient filter is given => requester must be portier or student must ask about yourself
        if (
            reqParam.recipient
            && !(accInfo.accType === auth.accountTypes.PORTIER || accInfo.user.startsWith(reqParam.user))
        ) {
            res.status(403).send({});
            return;
        }

        // recipient should be array; semicolon separated string
        reqParam.recipient = reqParam.recipient
            ? reqParam.recipient.split(",")
            : undefined;

        // status should be array: semicolon separated string
        reqParam.status = reqParam.status
            ? reqParam.status.split(",")
            : undefined;

        // status filter is given => status must be have proper value
        if (
            reqParam.status
            && reqParam.status.some(s => !Notification.schema.path('status').enumValues.includes(s))
        ) {
            res.status(400).send({});
            return;
        }

        const mongoFilters = {};
        reqParam._id && (mongoFilters._id = reqParam._id);
        reqParam.recipient && (mongoFilters.recipient = {"$in": reqParam.recipient});
        reqParam.status && (mongoFilters.status = {"$in": reqParam.status});

        Notification.find(
            mongoFilters,
            (err, docs) => {
                if (err) {
                    res.status(500).send({});
                    console.log(err);
                    return;
                }

                res.status(200).send(docs);
            }
        );
    }, (err) => {
    })
};

// GET /api/notification/counter
// parameters: req.query.recipient, req.query.status
exports.getNotificationCounterReq = function (req, res, next) {
    const reqParam = req.query;

    // recipient param is given => api is public
    let verifyFunc = reqParam.recipient
        ? auth.verifyReqNoneAsync
        : auth.verifyReqTokenAsync;

    verifyFunc(req, res, next, undefined).then((accInfo) => {
        // recipient filter is not given => requester must be portier
        if (
            !reqParam.recipient
            && !(accInfo.accType === auth.accountTypes.PORTIER)
        ) {
            res.status(403).send({});
            return;
        }

        // recipient should be array; semicolon separated string
        reqParam.recipient = reqParam.recipient
            ? reqParam.recipient.split(",")
            : undefined;

        // status should be array: semicolon separated string
        reqParam.status = reqParam.status
            ? reqParam.status.split(",")
            : undefined;

        // status filter is given => status must be have proper value
        if (
            reqParam.status
            && reqParam.status.some(s => !Notification.schema.path('status').enumValues.includes(s))
        ) {
            res.status(400).send({});
            return;
        }

        const mongoFilters = {};
        reqParam.recipient && (mongoFilters.recipient = {"$in": reqParam.recipient});
        reqParam.status && (mongoFilters.status = {"$in": reqParam.status});

        Notification.count(
            mongoFilters,
            (err, count) => {
                if (err) {
                    res.status(500).send({});
                    console.log(err);
                    return;
                }

                res.status(200).send({counter: count})
            }
        );
    }, (err) => {
    })
};

// POST /api/notification
// parameters: req.body.recipient, req.body.content
exports.postNotificationReq = function (req, res, next) {
    auth.verifyReqTokenAsync(req, res, next, auth.accountTypes.PORTIER).then((accInfo) => {

        const reqParam = req.body;

        const newNotification = new Notification({
            recipient: reqParam.recipient,
            content: reqParam.content
        });

        var error = newNotification.validateSync(undefined);
        if (error) {
            res.status(400).send({});
            return;
        }
        newNotification.save(
            (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({});
                    return;
                }

                res.status(200).send(doc);
            }
        );
    }, (err) => {
    })
};

// POST /api/notification/status
// parameters: req.body._id, req.body.status
exports.postNotificationStatusReq = function (req, res, next) {
    auth.verifyReqTokenAsync(req, res, next, undefined).then((accInfo) => {

        const reqParam = req.body;

        // both parameters are required
        if (!reqParam._id || !reqParam.status) {
            res.status(400).send({});
            return;
        }

        // _id is given => must be proper (or 500 is thrown)
        if (
            reqParam._id
            && !reqParam._id.match(/^[0-9a-fA-F]{24}$/)
        ) {
            res.status(400).send({});
            return;
        }

        const mongoFilters = {};
        mongoFilters._id = reqParam._id;

        // user can change only new -> confirmed
        if (accInfo.accType === auth.accountTypes.STUDENT) {
            mongoFilters.status = "new";
        }

        Notification.findOneAndUpdate(
            mongoFilters,
            {status: reqParam.status},
            {},
            (err, doc) => {
                if (err) {
                    res.status(500).send({});
                    console.log(err);
                    return;
                }

                if (doc) {
                    doc.status = reqParam.status;
                    res.status(200).send(doc);
                } else {
                    res.status(400).send({});
                }
            });
    }, (err) => {
    })
};
