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
	res.render('sell-manage', { user: req.user });
});


router.route('/event')
	/**
	 * @description 
	 * Get the page for setting up a new event
	 */ 
	.get(isAuthenticated, function (req, res) {
		res.render('sell-event', { user: req.user });
	})
	
	/**
	* @description
	* Handles parsing and sending an event to the api server to be
	* saved as a new event by our user
	* */
	.post(isAuthenticated, function (req, res) {		
		wzapi.saveEvent(req.body)
			.then(function(response) {
				res.redirect('/sell/item');		
			})
			.catch(function(error) {
				res.render('sell-event');
			});
	});

router.route('/item')
	/** 
	 * @description 
	 * Get the page for setting up a new event
	 */ 
	.get(isAuthenticated, function (req, res) {
		res.render('sell-item', { user: req.user });
	})
	/**
	* @description
	* Handles parsing and sending an event to the api server to be
	* saved as a new event by our user
	* */
	.post(isAuthenticated, function (req, res) {
		res.redirect('/sell');
	});
	
module.exports = router;