'use strict';

var express = require('express'),
  router = express.Router(),
  wzapi = require('../client/wzapi'),
  isAuthenticated = require('../middleware/isAuthenticated'),
  logger = require('../logger'),
  serverConfig = require('../config/server'),
  apiConfig = require('../config/api'),
  util = require('util'),
  _ = require('lodash'),
  q = require('q');


/**
 * @description
 * Manage all the things that you are selling
 */
router.get('/', isAuthenticated, function (req, res) {
  wzapi
    .user(req.user)
    .getItem({
      user_id: req.user._id
    })
    .then(function (response) {
      res.render('pages/manage', { user: req.user, items: response.body, error: req.flash('error'), success: req.flash('success') });
    })
    .catch(function (error) {
      logger.error('An error occured getting items');
      res.render('pages/manage', { user: req.user, items: [], message: req.flash('error') });
    });
});

/**
 * @description
 * Process creating a new listing for a sale item 
 * validates that a user is authenticated
 */
router.get('/new', isAuthenticated, function (req, res) {
  wzapi
    .user(req.user)
    .getMediaBucket()
    .then(function (response) {
      var bucket = response.body;
      var identity = _.findWhere(req.user.identities, { provider: req.user.provider });
      var url = util.format('%s?access_token=%s&provider=%s', bucket, identity.accessToken, req.user.provider);
      res.render('pages/sell', { user: req.user, bucket: url, item: {} });
    })
    .catch(function (error) {
      req.flash('Unable to create a new item listing');
      res.redirect('/sell');
    });
});

/**
 * @description
 * Process a request to edit a sale item by an id, this will only allow you to edit
 * a listing that you are authorized for
 */
router.get('/edit/:id', isAuthenticated, function (req, res) {
  var getBucketPromise = wzapi
    .user(req.user)
    .getMediaBucket();
  
  var getItemPromise = wzapi
    .user(req.user)
    .getItem({
      id: req.params.id,
      user_id: req.user._id
    });
    
  q.all([getBucketPromise, getItemPromise])
    .then(function (responses) {
      logger.info('got resopnses', responses);
      var bucket = responses[0].body;
      var item = responses[1].body;
      var identity = _.findWhere(req.user.identities, { provider: req.user.provider });
      var url = util.format('%s?access_token=%s&provider=%s', bucket, identity.accessToken, req.user.provider);
      res.render('pages/sell', { user: req.user, bucket: url, item:item});
    })
    .catch(function (error) {
      logger.info('got error', error);
      req.flash('Unable to create a new item listing');
      res.redirect('/sell');
    });
});

/**
* @description
* Handles parsing and sending an event to the api server to be
* saved as a new event by our user
* */
router.post('/item', isAuthenticated, function (req, res) {
  wzapi
    .user(req.user)
    .saveItem({
      item: req.body
    })
    .then(function (response) {
      logger.info('Successfully saved item');
      res.redirect('/sell')
    })
    .catch(function (error) {
      logger.info('Error occured saving item');
      req.flash('error', 'Unable to save item');
      res.redirect('/sell');
    });
});

/**
 * @description
 * Route that allows users to delete items that they own
 */
router.get('/item/:id/delete', isAuthenticated, function (req, res) {
  wzapi
    .user(req.user)
    .deleteItem({
      id: req.params.id
    })
    .then(function (response) {

      req.flash('success', 'Deleted item');
      res.redirect('/sell')
    })
    .catch(function (error) {

      req.flash('error', 'Unable to delete item');
      res.redirect('/sell');
    });
});

/**
 * @description
 * Route that allows users to print tags for their items
 */
router.get('/item/:id/print/tag', isAuthenticated, function(req, res) {
  var url = util.format('%s/%s/%s/%s', apiConfig.externalUrl(), 'sale/item', req.params.id, 'qr');
  res.render('pages/print-tag', {user:req.user, tagUrl: url});
});

module.exports = router;