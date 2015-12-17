'use strict';

var http = require('http'),
	apiConfig = require('../config/api'),
	Q = require('q'),
	unirest = require('unirest'),
	logger = require('../logger'), 
	_ = require('lodash'),
	util = require('util');

module.exports = ClientFactory;

function ClientFactory() {
	
	return {
		getItem: getItem,
		saveItem: saveItem,
		getEvent: getEvent, 
		saveEvent: saveEvent
	};

	/**
	 * @description
	 * Get either the item specified by the item id or all of the 
	 * items 
	 * @param {string} itemId optional parameter to locate a specific item record 
	 * @return {Promise}
	 */ 
	function getItem( itemId ) {
		return Q.Promise(function (resolve, reject) {
			var url = !_.isUndefined(itemId) ? util.format('%s/%s/%s', apiConfig.url(),'/sale_item', itemId) :  	
												util.format('%s/%s', apiConfig.url(),'/sale_item');		
			logger.info('calling url', url);
			unirest.get(url)
				.end(function (response) {
					resolve(response.body);
				});

		});
	}
	
	function saveItem( item ) {
		return Q.Promise(function (resolve, reject) {
			var url = apiConfig.url() + '/sale_item';
			logger.info('calling url', url);
			unirest.post(url)
				.header('Accept', 'application/json')
				.send(item)
				.end(function (response) {
					resolve(response.body);
				});
		});
	}
	
	function getEvent( eventId ) {
		return Q.Promise(function (resolve, reject) {
			var url = !_.isUndefined(eventId) ? util.format('%s/%s/%s', apiConfig.url(),'/sale_event', eventId) :  	
												util.format('%s/%s', apiConfig.url(),'/sale_event');
			
			logger.info('calling url', url);
			unirest.get(url)
				.end(function (response) {
					resolve(response.body);
				});
		});
	}
	
	function saveEvent(event) {
		return Q.Promise(function (resolve, reject) {
			var url = apiConfig.url() + '/sale_event';
			logger.info('calling url', url);
			unirest.post(url)
				.header('Accept', 'application/json')
				.send(event)
				.end(function (response) {
					resolve(response.body);
				});
		});
	}
	
	
}

