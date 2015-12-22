'use strict';

var serverConfig = require('./server'),
	util = require('util');

module.exports = {	

	facebook : {
		id : "477540052449717",
		secret : "ef4127fdfeac03a04f6931712232437c",
		callbackURL : util.format('%s/%s', serverConfig.url(), 'oauth/facebook/callback')		
	}		
	
};