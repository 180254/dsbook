"use strict";

const mongoose = require("mongoose");
const supergoose = require('supergoose');
const auth = require("./auth");

const UserSchema = require("./../model/user.js");
UserSchema.plugin(supergoose);

const User = mongoose.model("User", UserSchema);

exports.findOrCreate = function (user) {
    User.findOrCreate({user: user}, () => undefined);
};

// GET /api/user
// parameters: req.body.user
exports.getUserReq = function (req, res, next) {
    auth.verifyReqTokenAsync(req, res, next, undefined).then((accInfo) => {

        const reqParam = req.query;

        // filter user is provided & requester is student => must ask about yourself
        if (
            reqParam.user
            && accInfo.accType === auth.accountTypes.STUDENT
            && !(reqParam.user === accInfo.user)
        ) {
            res.status(403).send({});
            return;
        }

        // filter user is not provided & requester is student => should got self
        if (
            !reqParam.user
            && accInfo.accType === auth.accountTypes.STUDENT
        ) {
            reqParam.user = accInfo.user;
        }

        const mongoFilters = {};
        reqParam.user && (mongoFilters.user = reqParam.user);

        User.find(
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
        console.log("AssertionError(U0, " + err + ")");
    })
};


// POST /api/user/update
// parameters: req.body.user, req.body.name, req.body.surname, req.body.mobile, req.body.email
exports.postUserUpdateReq = function (req, res, next) {
    auth.verifyReqTokenAsync(req, res, next, auth.accountTypes.STUDENT).then((accInfo) => {

        const reqParam = req.body;

        // filter user is required
        if (
            !reqParam.user
        ) {
            res.status(400).send({});
            return;
        }

        // can only update self
        if (
            reqParam.user !== accInfo.user
        ) {
            res.status(403).send({});
            return;
        }

        // mongo params
        const mongoFilters = {};
        reqParam.user && (mongoFilters.user = reqParam.user);

        const mongoUpdate = {};
        reqParam.user && (mongoUpdate.user = reqParam.user);
        reqParam.name && (mongoUpdate.name = reqParam.name);
        reqParam.surname && (mongoUpdate.surname = reqParam.surname);
        reqParam.mobile && (mongoUpdate.mobile = reqParam.mobile);
        reqParam.email && (mongoUpdate.email = reqParam.email);

        // verify request is proper
        const newUser = new User(mongoUpdate);
        const error = newUser.validateSync(undefined);
        if (error) {
            res.status(400).send({});
            return;
        }

        // update
        User.findOneAndUpdate(
            mongoFilters,
            mongoUpdate,
            {},
            (err, doc) => {
                if (err) {
                    res.status(500).send({});
                    console.log(err);
                    return;
                }

                if (doc) {
                    reqParam.user && (doc.user = reqParam.user);
                    reqParam.name && (doc.name = reqParam.name);
                    reqParam.surname && (doc.surname = reqParam.surname);
                    reqParam.mobile && (doc.mobile = reqParam.mobile);
                    reqParam.email && (doc.email = reqParam.email);
                    res.status(200).send(doc);
                } else {
                    res.status(400).send({});
                }
            });
    }, (err) => {
        console.log("AssertionError(U1, " + err + ")");
    })
};

