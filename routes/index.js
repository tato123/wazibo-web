'use strict';

var express = require('express'), 
	router = express.Router();

router.get('/', function(req, res) {
	res.render('pages/index', {items: ['hello']});
});

module.exports = router;