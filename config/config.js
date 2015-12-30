'use strict;'

var _ = require('lodash');

require('dotenv').load();

var env = process.env.NODE_ENV || 'development';

module.exports = {
  env: env,
  app: {
    name: 'koa-redux-boilerplate',
    host: process.env.HOST_URL || 'http://localhost',
    port: {
      'development': 3000,
      'test': 3001,
      'production': 80,
    } [env],
  },
  database: require('./database')[env],
  redis: {
    host: 'redis',    // FIXME
  },
};
