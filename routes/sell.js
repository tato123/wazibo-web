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
    res.render('sell-manage', { user: req.user, message: req.flash('error') });
});

/**
 * @description 
 * Get the page for setting up a new event
 */
router.get('/event', isAuthenticated, function (req, res) {
    res.render('sell-event', { user: req.user });
})
	
/**
* @description
* Handles parsing and sending an event to the api server to be
* saved as a new event by our user
* */
router.post('/event', isAuthenticated, function (req, res) {
    wzapi
        .user(req.user)
        .saveEvent(req.body, function (event) {
            res.redirect('/sell/item?eventId=' + event._id);
            /*
            .catch(function(error) {
                logger.error('Error occured saving event',error);
                req.flash('error', 'Oops looks like we couldn\'t save your event');
                res.render('sell-event', {message:req.flash('error')});
            });*/
        });

});

/** 
 * @description 
 * Get the page for setting up a new event
 */
router.get('/item', isAuthenticated, function (req, res) {
    wzapi
        .user(req.user)
        .getMediaBucket(function (bucket) {
            res.render('sell-item', { user: req.user, eventId: req.query.eventId, bucket: bucket });
        });
})
/**
* @description
* Handles parsing and sending an event to the api server to be
* saved as a new event by our user
* */
router.post('/item', isAuthenticated, function (req, res) {

    wzapi
        .user(req.user)
        .saveItem(req.query.eventId, req.body, function (item) {
            res.redirect('/sell');
        });
});

module.exports = router;