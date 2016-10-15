var mongoose = require('mongoose')
var Schema = mongoose.Schema

var NotyficationSchema = new Schema({
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
})

module.export = NotyficationSchema
