var mongoose = require('mongoose');

var cachedPostsSchema = new mongoose.Schema({
  userId: String,
  source: {
    network: String,
    data: Object
  },
  content: {
    text: String,
    img: String
  },
  permalink: String,
  timestamp: Date,
  flagged: Boolean,
  flags: Array
});

module.exports = mongoose.model('CachedPosts', cachedPostsSchema);
