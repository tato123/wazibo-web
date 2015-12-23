'use strict';

var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  isAuthenticated = require('../middleware/isAuthenticated'),
  logger = require('../logger');
	
// ------------------------
// Logout 
// ------------------------

router.get('/logout', function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
  }

  res.redirect('/');
}); 

// ------------------------
// Facebook authentication 
// ------------------------
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (req.session.redirect_to) {
        return res.redirect(req.session.redirect_to);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// ------------------------
// Local authentication 
// ------------------------

router.post('/local', function (req, res, next) {
  logger.info('Someones trying to authenticate locally!');
  passport.authenticate('local', function (err, user, info) {
    logger.info('Local Authentication err', err);
    logger.info('Local Authentication user', user);
    logger.info('Local Authentication info', info);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (req.session.redirect_to) {
        return res.redirect(req.session.redirect_to);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});


module.exports = router;