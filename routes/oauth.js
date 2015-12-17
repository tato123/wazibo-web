'use strict';

var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  isAuthenticated = require('../middleware/isAuthenticated'),
  logger = require('../logger');
	
router.get('/logout', function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
  }
  
  res.redirect('/');
}); 

router.get('/facebook', passport.authenticate('facebook'));

/**
 * @description
 * Private api method, this is the oauth2 compliant callback
 */
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
      if ( req.session.redirect_to ) {
        return res.redirect(req.session.redirect_to);
      }
      return res.redirect('/');
    });    
  })(req, res, next);
});


module.exports = router;