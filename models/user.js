var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var User = new Schema({
	user: {
		type: ObjectId,
		require: true
	},
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
	phone: {
		type: String,
		require: false
	}
})


module.export = User
