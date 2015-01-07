var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
		name: String,
		owner: { type : mongoose.Schema.ObjectId, ref : 'User' },
		type: String,
		members: [{ type : mongoose.Schema.ObjectId, ref : 'User' }],
		isActive: Boolean,
		createdAt: Date,
});

module.exports = mongoose.model('Account', accountSchema);
