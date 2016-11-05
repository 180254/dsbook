"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    recipient: { // 304, 304-1
        type: String,
        required: true
    },
    content: { // pizza
        type: String,
        required: true
    },
    status: { // status
        type: String,
        enum: ["new", "confirmed", "closed"],
        required: true,
        default: "new",
    },
    date: { // when created
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    strict: true
});

module.exports = NotificationSchema;
