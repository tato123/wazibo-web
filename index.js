'use strict';

// express and socketio
var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    compression = require('compression'),
    passport = require('passport'),
    session = require('express-session'),
    util = require('util'),
    path = require('path'),
    serverConfig = require('./config/server'),
    apiConfig = require('./config/api'),
    passportConfig = require('./config/passport')(passport),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    exphbs  = require('express-handlebars'),
    flash = require('connect-flash'),
    _ = require('lodash');    



    // bootstrap the actual server
logger.info('--------------------------------------------');
logger.info('Starting with environment...');
_.forEach(_.keys(process.env).sort(), function(key) {
    console.log('\t%s: %s', key, process.env[key]);
});
logger.info('--------------------------------------------');

if ( !apiConfig.validate() ) {
    logger.error('Api configuration is invalid, exiting');
    process.exit(1);
}
if (!serverConfig.validate() ) {
    logger.error('Server configuration is invalid, exiting');
    process.exit(1);
}



// configure our options 
app.disable('x-powered-by');

// load our middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(session(serverConfig.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

require('express-load-routes')(app, './routes');
app.use(express.static(path.join(__dirname, 'public')));


// Set view path
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');


logger.info('Bootstrapping environment...');
server.listen(serverConfig.port, function () {
    logger.info('Server available at', serverConfig.port);
});


