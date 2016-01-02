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
     
      res.render('pages/home', {     
        user: req.user,
        items: [1,2,3,4,5,6]
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
