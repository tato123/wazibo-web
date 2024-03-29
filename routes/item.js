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
router.get('/all', function (req, res) {
  wzapi
    .user(req.user)
    .getItem()
    .then(function (response) {
      res.render('pages/item-list', { user: req.user, items: response.body, message: req.flash('error') });
    })
    .catch(function (error) {
      logger.error('An error occured getting items');
      res.render('pages/item-list', { user: req.user, items: [], message: req.flash('error') });
    });
});

router.get('/:id', function (req, res) {
  
  wzapi
    .user(req.user)
    .getItem({
      id: req.params.id
    })
    .then(function (response) {
      var item = response.body;      
      res.render('pages/item', { user: req.user, item: item, message: req.flash('error') });
    })
    .catch(function (error) {
      logger.error('An error occured getting items');
      res.render('pages/item', { user: req.user, item: {}, message: req.flash('error') });
    });
});

module.exports = router;