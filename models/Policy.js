var mongoose = require('mongoose');

var policySchema = new mongoose.Schema({
		policyText: String,
		policyUrl: String,
		isActive: Boolean,
		createdAt: Date,
		group: { type : mongoose.Schema.ObjectId, ref : 'Group' },
		account: { type : mongoose.Schema.ObjectId, ref : 'User' },
		gender: { type : mongoose.Schema.ObjectId, ref : 'Gender' },
		keywords: [{ type : mongoose.Schema.ObjectId, ref : 'Keyword' }],
		confirmedMembers: [{ type : mongoose.Schema.ObjectId, ref : 'User' }],
    flags: Array
});

module.exports = mongoose.model('Policy', policySchema);
