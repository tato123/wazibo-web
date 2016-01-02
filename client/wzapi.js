'use strict';

var http = require('http'),
  apiConfig = require('../config/api'),
  unirest = require('unirest'),
  logger = require('../logger'),
  _ = require('lodash'),
  util = require('util'),
  q = require('q');

module.exports = ClientFactory;


function ClientFactory() {

  var Media = {
    JSON: 'application/json'
  };

  this._accessToken = '';
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

    if (_.has(user, 'provider')) {
      this.provider(user.provider);
      var identity = _.findWhere(user.identities, { provider: user.provider });
      this.accessToken(identity.accessToken);
      this.refreshToken(identity.refreshToken);
    }
    else {
      logger.warn('No user provider set');
    }

    return this;
  }

  this.httpHandler = function (response) {
    logger.info('Status Code', response.statusCode);
    this.handler(response.body);
  };
		
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
  };

	/**
   * @name getItem
	 * @description
	 * Get either the item specified by the item id or all of the 
	 * items 
	 * @param {Object} config options for getting our items 
	 * @return {Promise}
	 */
  this.getItem = function (options) {
    var deferred = q.defer();

    var url = util.format('%s/%s', apiConfig.url(), 'sale/item');
    if (!_.isUndefined(options) && _.has(options, 'id')) {
      url += '/' + options.id;
    }

    logger.info('calling url', url);
    var request = unirest.get(url)
      .header('Accept', Media.JSON)
      .header('Content-Type', Media.JSON)
      .header('Authorization', this._bearerToken)
      .header('X-Authorization-Provider', this._provider);

    if (!_.isUndefined(options) && _.has(options, 'user_id')) {
      request.query({
        user_id: options.user_id
      });
    }

    request.end(function (response) {
      if (response.statusCode < 200 || response.statusCode > 299) {
        return deferred.reject(response);
      }
      deferred.resolve(response);
    });

    return deferred.promise;
  };

  /**
   * @name saveItem
   * @description
   * Save items to the wazibo api
   * 
   * @param {Object} options
   * @return {Promise}
   */
  this.saveItem = function (options) {

    var deferred = q.defer();
    var url = util.format('%s/%s', apiConfig.url(), 'sale/item');

    if (_.isUndefined(options)) {
      logger.error('Unable to save item, options object required')
      deferred.reject('Missing options');
    }

    if (!_.has(options, 'item')) {
      deferred.reject('Missing options');
    }
    
    // parse out any possible photos
    var photos = [];
    _.forEach(options.item, function (value, key) {
      if (key.indexOf('photos') !== -1) {
        photos.push(value);
      }
    });
    options.item.photos = photos;


    unirest.post(url)
      .header('Accept', Media.JSON)
      .header('Content-Type', Media.JSON)
      .header('Authorization', this._bearerToken)
      .header('X-Authorization-Provider', this._provider)
      .send(options.item)
      .end(function (response) {
        if (response.statusCode < 200 || response.statusCode > 299) {
          return deferred.reject(response);
        }
        deferred.resolve(response);
      });
    return deferred.promise;
  };
  
  /**
   * @name deleteItem
   * @description
   * Deletes an item by its id, this operation requires that a user be
   * authenticated and owns the rights to this actual item (or is authorized to delete it)
   * @param {Object} options 
   * @returns {Promise}
   */
  this.deleteItem = function (options) {
    var deferred = q.defer();
    
    if (_.isUndefined(options) && !_.has(options, 'id')) {
      logger.error('Options not provided when attempting to perform delete');
      deferred.reject('Unable to perform delete item');
    }

    var url = util.format('%s/%s/%s', apiConfig.url(), 'sale/item', options.id);
    

    logger.info('calling url', url);
    unirest.delete(url)
      .header('Accept', Media.JSON)
      .header('Content-Type', Media.JSON)
      .header('Authorization', this._bearerToken)
      .header('X-Authorization-Provider', this._provider)
      .end(function (response) {
        if (response.statusCode < 200 || response.statusCode > 299) {
          return deferred.reject(response);
        }
        deferred.resolve(response);
      });

    return deferred.promise;
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

  };

  this.saveEvent = function (event, handler) {
    var deferred = q.defer();

    var url = util.format('%s/%s', apiConfig.url(), 'sale/event');
    logger.info('calling url', url);
    unirest.post(url)
      .header('Accept', Media.JSON)
      .header('Content-Type', Media.JSON)
      .header('Authorization', this._bearerToken)
      .header('X-Authorization-Provider', this._provider)
      .send(event)
      .end(function (response) {
        if (response.statusCode < 200 || response.statusCode > 299) {
          return deferred.reject(response);
        }
        deferred.resolve(response);
      });

    return deferred.promise;
  };

  this.getMediaBucket = function (handler) {
    var deferred = q.defer();
    var url = util.format('%s/%s', apiConfig.url(), 'media/bucket');
    logger.info('calling url', url);
    unirest.get(url)
      .header('Accept', Media.JSON)
      .header('Content-Type', Media.JSON)
      .send()
      .end(function (response) {
        if (response.statusCode < 200 || response.statusCode > 299) {
          return deferred.reject(response);
        }
        deferred.resolve(response);
      });

    return deferred.promise;
  };
	
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
  this.localAuthentication = function (email, password, handler) {
    var url = util.format('%s/%s', apiConfig.url(), 'account/login');
    logger.info('calling url', url);
    unirest.post(url)
      .header('Accept', Media.JSON)
      .header('Content-Type', Media.JSON)
      .send({ email: email, password: password })
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