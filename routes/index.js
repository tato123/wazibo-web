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
			res.render('home', {items: events, user:req.user});	
		});		
}); 

router.get('/login', function(req, res) {
	res.render('login');
});

module.exports = router;