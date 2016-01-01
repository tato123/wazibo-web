'use strict';

var express = require('express'),
  router = express.Router(),
  wzapi = require('../client/wzapi'),
  isAuthenticated = require('../middleware/isAuthenticated'),
  logger = require('../logger');

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
      res.render('pages/manage', { user: req.user, items: response.body, message: req.flash('error') });
    })
    .catch(function (error) {
      logger.error('An error occured getting items');
      res.render('pages/manage', { user: req.user, items: [], message: req.flash('error') });
    });
});

router.get('/new', isAuthenticated, function (req, res) {
  res.render('pages/sell', { user: req.user });
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
      item: req.body,
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

module.exports = router;