var Policy = require('../models/Policy'),
    getCachedPosts = require('../lib/getCachedPosts'),
  	routes = require('./routes.js').route,
  	express = require('express');

var specialMethods = {
  getIdPosts: function (policy, callback) {
    if (policy.confirmedMembers && policy.confirmedMembers.length > 0) {
      getCachedPosts(policy, callback);
    } else {
      callback(null, policy);
    }
  }
}

module.exports = routes("policies", Policy, "group account gender confirmedMembers keyword", specialMethods);

