'use strict';

var express = require('express'),
  router = express.Router(),
  wzapi = require('../client/wzapi'),
  isAuthenticated = require('../middleware/isAuthenticated'),
  logger = require('../logger');

router.get('/', function(req, res) {
  wzapi
    .user(req.user)
    .getEvent(function(events) {
      logger.info('the user', req.user);
      logger.info('events', events);

      var items = [];
      for (var x = 0; x < 6; x++) {
        items.push(events[0]);
      }
      res.render('pages/home', {
        items: items,
        user: req.user
      });
    });
});

router.get('/login', function(req, res) {
  res.render('pages/login');
});

router.get('/about', function(req, res) {
   res.render('pages/about'); 
});

router.get('/terms', function(req, res) {
    res.render('pages/terms');
});

module.exports = router;
