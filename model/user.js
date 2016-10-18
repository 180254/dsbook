const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	name: {
		type: String,
		require: false
	},
	surname: {
		type: String,
		require: false
	},
	roomnumber: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: false
	},
	notifications: {
		type: String,
		require: false
	}
});

module.export = User;
