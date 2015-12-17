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
    passportConfig = require('./config/passport')(passport),
    logger = require('./logger');    

// express middleware
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

// configure our options 
app.disable('x-powered-by');

// load our middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(session({
    secret: 'test session',
    resave: false,
    saveUninitialized: true
})); 
app.use(passport.initialize());
app.use(passport.session());

require('express-load-routes')(app, './routes');
app.use(express.static(path.join(__dirname, 'public')));

// Set view path
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// bootstrap the actual server
logger.info('--------------------------------------------');
logger.info('Starting with environment...');
logger.info(process.env);
logger.info('--------------------------------------------');

logger.info('Bootstrapping environment...');
server.listen(serverConfig.port, function () {
    logger.info('Server available at', serverConfig.port);
});


