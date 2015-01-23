var CachedPosts = require('../models/CachedPosts'),
    config = require('../config/info.json');

module.exports = function (users, callback) {
  if (users.confirmedMembers) {
    getCachedPostsForPolicy(users, callback);
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

var getCachedPostsForPolicy = function (policy, callback) {
  var orQuery = [];
  policy.confirmedMembers.forEach(function (user) {
    orQuery.push({ userId: user._id });
  });
  CachedPosts.find().or(orQuery).sort('-timestamp').exec(function(err, response) {
    if (err) {
        return callback(err);
    }

    if (response && response.length > 0) {
      policy.posts = [];
      response.forEach(function (post) {
        policy.posts.push(post);
      })
    }

    callback(null, policy);
  });
}


// var now = Date.now();
// var lastScrape = Date.parse(post.last.timestamp);
// var scrapeAgain = now - lastScrape > config.cacheThreshold;

// if (scrapeAgain) {
//   // scrape again here...
// }
