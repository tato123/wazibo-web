'use strict';
var util = require('util');

module.exports = {
	host: process.env.WAZIBO_SERVER_1_PORT_9080_TCP_ADDR,
	port: process.env.WAZIBO_SERVER_1_PORT_9080_TCP_PORT,
	version: '1.0',
	url: function() {
		return util.format('http://%s:%s/%s',this.host, this.port, this.version);
	}
};