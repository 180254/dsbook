"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id: { // 304-1
		type: String,
		required: true
	},
	name: { // Johny
		type: String,
		required: false
	},
	surname: { // English
		type: String,
		required: false
	},
	mobile: { // 500200100
		type: String,
		required: false,
	},
	email: { // johny.english@gmail.com
		type: String,
		required: false
	}
}, {
	strict: true
});

module.exports = UserSchema;
