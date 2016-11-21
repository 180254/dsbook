"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    // recipient may be whole room (304), or just user (304-1)
    // if database is asked about 304-1 notification to 304 will NOT be displayed
    // must ask db about user (304-1) and his room (304)
    // notification api accepts multiple recipients as a filter
    recipient: { // 304, 304-1
        type: String,
        required: true
    },
    content: { // pizza
        type: String,
        required: true
    },
    // new - notification is just created
    // confirmed - one of user (recipient) confirmed that notification
    // closed - notification is closed by portier
    // notification api accepts several status as a filter
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
    // http://mongoosejs.com/docs/guide.html#strict
    // "ensures that values passed to our model constructor
    // that were not specified in our schema do not get saved to the db."
    strict: true
});

module.exports = NotificationSchema;
