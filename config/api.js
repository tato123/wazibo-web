'use strict';
var util = require('util'),
	logger = require('../logger');

module.exports = {

	host: process.env.WAZIBO_SERVER_PORT_9080_TCP_ADDR,
	port: process.env.WAZIBO_SERVER_PORT_9080_TCP_PORT,
  dns: process.env.WAZIBO_API_URL,
	version: '1.0',
	url: function () {
		return util.format('http://%s:%s/%s', this.host, this.port, this.version);
	},
  externalUrl: function() {    
    return util.format('http://%s/%s', this.dns, this.version);
  },
	validate: function () {

		if (!process.env.WAZIBO_SERVER_PORT_9080_TCP_ADDR) {
			logger.error('Missing required environment variable [%s]', 'WAZIBO_SERVER_1_PORT_9080_TCP_ADDR')			
			return false;
		}

		if (!process.env.WAZIBO_SERVER_PORT_9080_TCP_PORT) {
			logger.error('Missing required environment variable [%s]', 'WAZIBO_SERVER_PORT_9080_TCP')			
			return false;
		}
    
    if (!process.env.WAZIBO_API_URL) {
			logger.error('Missing required environment variable [%s]', 'WAZIBO_API_URL')			
			return false;
		}
		return true;
	}
};

