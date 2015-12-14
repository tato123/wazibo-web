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
    passportConfig = require('./config/passport')(passport);

// express middleware
var bodyParser = require('body-parser');

var config = {
    port: 9080
};

// configure our options 
app.disable('x-powered-by');

// load our middleware
app.use(bodyParser.json());
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

require('express-load-routes')(app, './routes');
app.use(express.static(path.join(__dirname, 'public')));
// Set view path
app.set('views', path.join(__dirname, 'views'));
// set up ejs for templating. You can use whatever
app.set('view engine', 'ejs');

// bootstrap the actual server
console.log('--------------------------------------------');
console.log('[Wazibo web] Starting with environment...');
console.log(process.env);
console.log('--------------------------------------------');

console.log('[Wazibo Server] Bootstrapping environment...');
server.listen(config.port, function () {
    console.log('[Wazibo Server] Server available at', serverConfig.port);
});


