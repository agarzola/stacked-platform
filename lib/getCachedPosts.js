var CachedPosts = require('../models/CachedPosts'),
    config = require('../config/info.json');

module.exports = function (users, callback) {
  if (Array.isArray(users)) {
    users.forEach(function (user, userIndex) {
      getCachedPostsForUser(user, function (err, response) {
        if (err) return callback(err);

        user.posts = response.posts;
        if (userIndex === users.length - 1) {
          callback(null, users);
        }
      });
    })
  } else {
    getCachedPostsForUser(users, callback);
  }
}

var getCachedPostsForUser = function (user, callback) {
  CachedPosts.findOne({ userId: user._id}, function(err, response) {
    if (err) {
        return callback(err);
    }

    var now = Date.now();
    var lastScrape = Date.parse(response.last.timestamp);
    var scrapeAgain = now - lastScrape > config.cacheThreshold;

    if (scrapeAgain) {
      // scrape again here...
    }
    user.posts = response.posts;
    callback(null, user);
  });
}
