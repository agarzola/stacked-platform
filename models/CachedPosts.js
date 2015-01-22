var mongoose = require('mongoose');

var cachedPostsSchema = new mongoose.Schema({
  userId: String,
  last: {
    timestamp: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  posts: { type: Array, default: [] }
});

module.exports = mongoose.model('CachedPosts', cachedPostsSchema);
