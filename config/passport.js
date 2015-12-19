'use strict';

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  authConfig = require('./auth'),
  logger = require('../logger'),
  wzapi = require('../client/wzapi');

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
      callbackURL: authConfig.facebook.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        // enable if debugging
        /*
        logger.debug('--------------------------------');
        console.log('Authenticated user: ', profile);
        logger.debug('Access Token: ', accessToken);
        logger.debug('Refresh Token: ', refreshToken);
        logger.debug('--------------------------------');
        */


        wzapi
          .accessToken(accessToken)
          .provider('facebook')
          .getAccount(function (user) {            
            // call the external service here with our access token
            done(null, user.facebook);
          });

      });

    }));
}
