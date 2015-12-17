'use strict';

var winston = require('winston'),
    moment = require('moment'),
    util = require('util');

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      colorize: true,
      label: 'wazibo-web',
      timestamp: function() {
        return util.format('[%s]', moment().format('HH:mm:ss'));
      }
    }),
  ]
});

module.exports = logger;