var Policy = require('../models/Policy'),
	routes = require('./routes.js').route;
	express = require('express');



module.exports = routes("policies", Policy, "group account gender confirmedMembers keyword");

