var Account = require('../models/Account'),
	routes = require('./routes.js').route;
	express = require('express');



module.exports = routes("accounts", Account, "name owner type members isActive createdAt");
