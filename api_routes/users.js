var User = require('../models/User'),
  CachedPosts = require('../models/CachedPosts'),
	routes = require('./routes.js').route;
	express = require('express');

var specialMethods = {
  getId: function (user, callback) {
    // Do something special when endpoint/:id receives a GET request
    CachedPosts.findOne({ userId: user._id}, function(err, posts) {
      if (err) {
          return callback(err);
      }
      user.posts = posts;
      callback(null, user);
    });
  }
}

module.exports = routes("users", User, '', specialMethods);
