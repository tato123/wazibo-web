'use strict';

var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    isAuthenticated = require('../middleware/isAuthenticated');
	
// -------------------------------------------------
// universal authentication messages
// -------------------------------------------------
router.get('/success',isAuthenticated, function (req, res) {
    res.status(200).send({message:'logged in'});
});

router.get('/logout',isAuthenticated, function(req,res) {
  req.logout();
  res.status(200).send({message:'successfully logged out'});  
});  

router.get('/login', function(req, res) {
    res.status(200).send({message:'you must first login using an authentication scheme'});
});  
  
// -------------------------------------------------
// facebook based authentication
// -------------------------------------------------
/**
 * @api {get} /auth/facebook Facebook authenticate
 * @apiName Login with facebook
 * @apiGroup Authentication
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
router.get('/facebook',
  passport.authenticate('facebook'));

/**
 * @description
 * Private api method, this is the oauth2 compliant callback
 */ 
router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    successRedirect: '/auth/success', 
    failureRedirect: '/auth/login' 
  }), function(req, res) {
    console.log('I got a message');
  });        

module.exports = router;