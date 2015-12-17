'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	profileId: String,
	firstName: String,
	lastName: String,
	email: String
});

module.exports = mongoose.model('user', User);