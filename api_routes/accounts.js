var Account = require('../models/Account'),
	routes = require('./routes.js').route;
	express = require('express');



module.exports = routes("accounts", Account, "owner members");
