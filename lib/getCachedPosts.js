var CachedPosts = require('../models/CachedPosts'),
    config = require('../config/info.json'),
    secrets = require('../config/credentials/secrets'),
    scraper = require('stacked-scraper')(secrets),
    flagger = require('stacked-flagger');

module.exports = function (users, callback) {
  users = users.toObject();

  if (users.confirmedMembers) {
    getCachedPostsForPolicy(users, function (err, policy) {
      if (err) return callback(err);
      if (policy.flags && policy.posts && policy.posts.length > 0) {
        flagger(policy, policy.posts, function (err, flaggedPosts) {
          if (err) return callback(err);

          policy.posts = flaggedPosts;
        })
      }
      callback(null, policy);
    });
  } else {
    var user = users;
    var now = Date.now();
    var lastScrape = users.last && users.last.timestamp ? Date.parse(users.last.timestamp) : null;
    var scrapeAgain = now - lastScrape > config.cacheThreshold;
    // scrapeAgain = false

    getCachedPostsForUser(user, function (err, user) {
      if (err) return callback(err);

      if (scrapeAgain) {
        var batch = scraperBatch([user]);
        scraper(batch, function (err, newPosts) {
          if (err) return callback(err);

          if (newPosts && newPosts[user._id]) {
            user.posts = newPosts[user._id].posts.concat(user.posts);
          }

          callback(null, user);
        });
      } else {
        callback(null, user);
      }
    });
  }
}

var getCachedPostsForUser = function (user, callback) {
  CachedPosts.find({ userId: user._id}).sort('-timestamp').exec(function(err, response) {
    if (err) {
      return callback(err);
    }

    cleanResponse = response.map(function (post) {
      return post.toObject();
    })

    if (cleanResponse && cleanResponse.length > 0) {
      user.posts = cleanResponse.slice();
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

    cleanResponse = response.map(function (post) {
      return post.toObject();
    })

    if (cleanResponse && cleanResponse.length > 0) {
      policy.posts = cleanResponse.slice();
    } else {
      policy.posts = [];
    }

    callback(null, policy);
  });
}

var scraperBatch = function (users) {
  var pooledUsers = {};
  users.forEach(function (user) {
    // userIsScrapable = user.tokens && user.tokens.length > 0;
    userIsScrapable = (user.tokens && user.tokens.length > 0) && (user.policies && user.policies.length > 0);
    if (userIsScrapable) {
      pooledUsers[user._id] = {};
      user.tokens.forEach(function (token, tokenIndex) {
        pooledUsers[user._id][token.kind] = {};
        Object.keys(token).forEach(function (tokenKey) {
          if (tokenKey !== 'kind') {
            pooledUsers[user._id][token.kind][tokenKey] = token[tokenKey];
            pooledUsers[user._id][token.kind].userId = user[token.kind];
            pooledUsers[user._id][token.kind].last = user.last[token.kind];
          }
        })
      })
    }
  })
  return pooledUsers;
}
