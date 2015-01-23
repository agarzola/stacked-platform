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

var scraperBatch = function (users) {
  var pooledUsers = {};
  users.forEach(function (user) {
    // userIsScrapable = user.tokens && user.tokens.length > 0;
    userIsScrapable = (user.tokens && user.tokens.length > 0) && (user.policies && user.policies.length > 0);
    if (userIsScrapable) {
      pooledUsers[user.id] = {};
      user.tokens.forEach(function (token, tokenIndex) {
        pooledUsers[user.id][token.kind] = {};
        console.log(token.kind)
        Object.keys(token).forEach(function (tokenKey) {
          if (tokenKey !== 'kind') {
            pooledUsers[user.id][token.kind][tokenKey] = token[tokenKey];
            pooledUsers[user.id][token.kind].userId = user[token.kind];
            pooledUsers[user.id][token.kind].last = user.last[token.kind];
          }
        })
      })
    }
  })
  return pooledUsers;
}
