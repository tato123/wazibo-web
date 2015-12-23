'use strict';

var http = require('http'),
	apiConfig = require('../config/api'),
	unirest = require('unirest'),
	logger = require('../logger'),
	_ = require('lodash'),
	util = require('util');

module.exports = ClientFactory;


function ClientFactory() {
	
	var Media = {
		JSON: 'application/json'
	};
	
	this._accessToken =   '';
	this._bearerToken = '';	
	this._provider = '';
	this._refreshToken = '';
		
	this.accessToken = function (value) {
		this._accessToken = value || '';
		this._bearerToken = 'Bearer ' + this._accessToken;
		return this;
	}

	this.provider = function (value) {
		this._provider = value || '';
		return this;
	}

	this.refreshToken = function (value) {
		this._refreshToken = value || '';
		return this;
	}

	this.user = function (user) {

		if (user && user.accessToken)
			this.accessToken(user.accessToken);

		if (user && user.provider) {
			this.provider(user.provider);
		}

		if (user && user.refreshToken) {
			this.refreshToken(user.refreshToken);
		}

		return this;
	}

	this.httpHandler = function (response) {
		this.handler(response.body);
	}
		
	/**
	 * @description
	 * When a user logs into the api we want to let the api know that 
	 * we will see this account start to show up in api requests. 
	 */
	this.getAccount = function (handler) {
		var url = util.format('%s/%s', apiConfig.url(), 'account');
		logger.info('calling url', url);
		unirest.get(url)
			.header('Accept', Media.JSON)
			.header('Content-Type', Media.JSON)
			.header('Authorization', this._bearerToken)
			.header('X-Authorization-Provider', this._provider)
			.end(this.httpHandler.bind({ handler: handler }));
	}

	/**
	 * @description
	 * Get either the item specified by the item id or all of the 
	 * items 
	 * @param {string} itemId optional parameter to locate a specific item record 
	 * @return {Promise}
	 */
	this.getItem = function () {
		var itemId, handler;
		if (arguments.length === 1) {
			handler = arguments[0]
		}
		if (arguments.length === 2) {
			itemId = arguments[0];
			handler = arguments[1];
		}

		var url = !_.isUndefined(itemId) ? util.format('%s/%s/%s', apiConfig.url(), 'sale/item', itemId) :
			util.format('%s/%s', apiConfig.url(), 'sale/item');
		logger.info('calling url', url);
		unirest.get(url)
			.header('Accept', Media.JSON)
			.header('Content-Type', Media.JSON)
			.header('Authorization', this._bearerToken)
			.header('X-Authorization-Provider', this._provider)
			.end(this.httpHandler.bind({ handler: handler }));


	}

	this.saveItem = function (eventId, item, handler) {

		var url = util.format('%s/%s', apiConfig.url(), 'sale/item');
		url = _.isUndefined(eventId) ? url : url + '?event_id=' + eventId;
		
		logger.info('calling url', url, 'with item', item);
		unirest.post(url)
			.header('Accept', Media.JSON)
			.header('Content-Type', Media.JSON)
			.header('Authorization', this._bearerToken)
			.header('X-Authorization-Provider', this._provider)			
			.send(item)
			.end(this.httpHandler.bind({ handler: handler }));

	}

	this.getEvent = function () {
		
		var eventId, handler;
		if (arguments.length === 1) {
			handler = arguments[0]
		}
		if (arguments.length === 2) {
			eventId = arguments[0];
			handler = arguments[1];
		}


		logger.info('calling get event');
		var url = !_.isUndefined(eventId) ? util.format('%s/%s/%s', apiConfig.url(), 'sale/event', eventId) :
			util.format('%s/%s', apiConfig.url(), 'sale/event');

		logger.info('calling url', url);
		unirest.get(url)
			.header('Accept', Media.JSON)
			.header('Content-Type', Media.JSON)
			.header('Authorization', this._bearerToken)
			.header('X-Authorization-Provider', this._provider)
			.end(this.httpHandler.bind({ handler: handler }));

	}

	this.saveEvent = function (event, handler) {		

		var url = util.format('%s/%s', apiConfig.url(), 'sale/event');
		logger.info('calling url', url);
		unirest.post(url)
			.header('Accept', Media.JSON)
			.header('Content-Type', Media.JSON)
			.header('Authorization', this._bearerToken)
			.header('X-Authorization-Provider', this._provider)
			.send(event)
			.end(this.httpHandler.bind({ handler: handler }));

	}
	
	this.getMediaBucket = function(handler) {
		var url = util.format('%s/%s', apiConfig.url(), 'media/bucket');
		logger.info('calling url', url);
		unirest.get(url)
			.header('Accept', Media.JSON)
			.header('Content-Type', Media.JSON)
			.header('Authorization', this._bearerToken)
			.header('X-Authorization-Provider', this._provider)
			.send()
			.end(this.httpHandler.bind({ handler: handler }));
	}
	
	/**
	 * @name localAuthentication
	 * @description
	 * Method for handling authentication when a user is attempting to login 
	 * with a local, non open authentication provider (such as facebook, google, twitter, etc...)
	 *
	 * @param {String} email User email
	 * @param {String} password user password
	 * @param {Function} callback handler function
	 */ 
	this.localAuthentication = function(email, password, handler) {
		var url = util.format('%s/%s', apiConfig.url(), 'account/login');
		logger.info('calling url', url);
		unirest.post(url)
			.header('Accept', Media.JSON)
			.header('Content-Type', Media.JSON)			
			.send({email:email, password:password})
			.end(this.httpHandler.bind({ handler: handler }));	
	}
}

// convience sake for grabbing all of the 
// key names 
ClientFactory.setupMethods = function () {
	var methods = Object.getOwnPropertyNames(new ClientFactory());
	for (var index in methods) {
		ClientFactory.addMethod(methods[index]);
	}
}

ClientFactory.addMethod = function (methodName) {
	ClientFactory[methodName] = function () {
		var factory = new ClientFactory();
		if (_.isFunction(factory[methodName])) {
			return factory[methodName].apply(factory, arguments);	
		}
		return factory[methodName] = arguments;
	}
}

ClientFactory.setupMethods();

module.exports = ClientFactory;