var User = require('../models/User'),
    getCachedPosts = require('../lib/getCachedPosts'),
  	routes = require('./routes.js').route;
  	express = require('express');

var specialMethods = {
  getId: getCachedPosts
}

module.exports = routes("users", User, '', specialMethods);
