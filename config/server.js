'use strict';

var util = require('util'),
	logger = require('../logger');



module.exports = {
	port: 9080,
	fqdn: process.env.WAZIBO_WEB_URL,
	transport: process.env.WAZIBO_HTTP_TRANSPORT,
	session: {
		secret: "snO9'V*9jlR1cp{",
		resave: false,
		saveUninitialized: true
	},
	url: function () {
		return util.format('%s://%s', this.transport, this.fqdn);
	},
	validate: function () {
		// Required environment variables
		if (!process.env.WAZIBO_WEB_URL) {
			logger.error('Missing required environment variable [%s]', 'WAZIBO_WEB_URL')
			return false;
		}

		if (!process.env.WAZIBO_HTTP_TRANSPORT) {
			logger.error('Missing required environment variable [%s]', 'WAZIBO_HTTP_TRANSPORT')
			return false;
		}
		return true;
	}
};