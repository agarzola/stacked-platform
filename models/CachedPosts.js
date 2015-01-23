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
  timestamp: String
});

module.exports = mongoose.model('CachedPosts', cachedPostsSchema);
