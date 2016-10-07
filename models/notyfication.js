var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var Notyfication = new Schema({
	notyfication: {
		type: ObjectId,
		require: true
	},
	username: {
		type: String,
		require: true
	},
	date: {
		type: String,
		require: true
	},
	status: {
		type: String,
		require: true
	},
	body: {
		type: Date,
		require: true,
		default: Date.now
	}
})

module.export = Notyfication
