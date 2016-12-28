"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user: { // 304-1
        type: String,
        required: true
    },
    name: { // Johny
        type: String,
        required: false,
        default: "",
    },
    surname: { // English
        type: String,
        required: false,
        default: "",
    },
    // the ONLY allowed format is 48[9 digits]
    // only this format is supported by sms api
    // format must be forced and/or validated
    mobile: { // 48500200100
        type: String,
        required: false,
        default: "",
    },
    // remember to check if email is valid
    email: { // johny.english@gmail.com
        type: String,
        required: false,
        default: "",
    },
    // send e-mail on notification?
    wantEmail: {
        type: Boolean,
        required: false,
        default: false
    },
    // send sms on notification
    wantSms: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    // http://mongoosejs.com/docs/guide.html#strict
    // "ensures that values passed to our model constructor
    // that were not specified in our schema do not get saved to the db."
    strict: true
});

module.exports = UserSchema;
