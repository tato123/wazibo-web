'use strict';

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  authConfig = require('./auth');

module.exports = function (passport) {
  
  // configure the passport serialization and deserialization
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });


  passport.use(new FacebookStrategy(
    {
      clientID: authConfig.facebook.id,
      clientSecret: authConfig.facebook.secret,
      callbackURL: authConfig.facebook.callbackUrl
    },    
    function (accessToken, refreshToken, profile, done) {
      var newUser = {};

      newUser.id = profile.id; // set the users facebook id                   
      newUser.accessToken = accessToken; // we will save the token that facebook provides to the user                    
      newUser.name = 'Bill';
      newUser.imageUrl = 'http://scienceblogs.com/gregladen/files/2012/12/Beautifull-cat-cats-14749885-1600-1200.jpg';
      // call the external service here with our access token
      done(null, newUser);

    }));
}
