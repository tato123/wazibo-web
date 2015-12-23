'use strict';

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  authConfig = require('./auth'),
  logger = require('../logger'),
  wzapi = require('../client/wzapi'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  
  /**
   * @description
   * Serialize the entire user object (as JSON)
   */ 
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  /**
   * @description
   * Deserialize (as JSON) the entire user object
   */ 
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  /**
   * @description
   * Facebook passport strategy
   */ 
  passport.use(new FacebookStrategy(
    {
      clientID: authConfig.facebook.id,
      clientSecret: authConfig.facebook.secret,
      callbackURL: authConfig.facebook.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        wzapi
          .accessToken(accessToken)
          .provider('facebook')
          .getAccount(function (user) {            
            // call the external service here with our access token
            done(null, user.facebook);
          });
      });
    }));
    
  /**
   * @description
   * Local authentication strategy
   */   
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  function(username, password, done) {
      logger.debug('Authenticating %s with %s', username, password);
      wzapi
        .localAuthentication(username, password, function(response) {
            logger.debug('Authentication response', response);
            // we got a response that contains an issue
            if (response.name || response.message ) {
              done(response);
            }
            done(null,response.local);
        });
        
  }));
}
