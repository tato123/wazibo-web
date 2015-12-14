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
      callbackURL: authConfig.facebook.callbackUrl,
      enableProof: authConfig.facebook.enableProof
    },
    // facebook will several pieces that we will need for our 
    // talk with our services
    function (accessToken, refreshToken, profile, done) {
      var newUser = {};

      newUser.id = profile.id; // set the users facebook id                   
      newUser.accessToken = accessToken; // we will save the token that facebook provides to the user                    

      // call the external service here with our access token
      done(null, newUser);

    }));
}
