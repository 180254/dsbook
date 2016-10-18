const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	username: {
		type: String,
		require: true
	},
	body: {
		type: String,
		require: true
	},
	status: {
		type: String,
		require: true,
		default: "active"
	},
	date: {
		type: Date,
		require: true,
		default: Date.now
	}
});

module.export = NotificationSchema;
