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
  CachedPosts.find({ userId: user._id}).sort('-timestamp').exec(function(err, response) {
    if (err) {
        return callback(err);
    }

    if (response && response.length > 0) {
      user.posts = [];
      response.forEach(function (post) {
        user.posts.push(post);
      })
    }

    callback(null, user);
  });
}


// var now = Date.now();
// var lastScrape = Date.parse(post.last.timestamp);
// var scrapeAgain = now - lastScrape > config.cacheThreshold;

// if (scrapeAgain) {
//   // scrape again here...
// }
