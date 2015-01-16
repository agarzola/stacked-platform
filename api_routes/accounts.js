var Account = require('../models/Account'),
	routes = require('./routes.js').route;
	express = require('express');



module.exports = routes("policies", Account, "owner members");
