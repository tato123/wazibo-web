'use strict';

module.exports = ensureAuthenticated;

/**
 * @name ensureAuthenticated
 * @description
 * Ensure that the user is currently authenticated through
 * one of passports mechanisms. This requires that passport is available
 * and in use. 
 * 
 * @return none
 */
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.session.redirect_to = '/sell';
		res.redirect('/login');
	}
}

