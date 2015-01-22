var CachedPosts = require('../models/CachedPosts');

module.exports = function (user, callback) {
  CachedPosts.findOne({ userId: user._id}, function(err, response) {
    if (err) {
        return callback(err);
    }
    user.posts = response.posts;
    callback(null, user);
  });
}
