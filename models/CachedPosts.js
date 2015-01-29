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
  timestamp: Date
});

module.exports = mongoose.model('CachedPosts', cachedPostsSchema);
