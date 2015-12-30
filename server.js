'use strict;'

var _ = require('lodash'),
    path = require('path');

global.__AppRoot = __dirname;
global.debug = require('debug')('homebrew');
global.Kue = require('./lib/kue');
global.Config = require('./config/config');
global.Models = require('./src/models');
global.Controllers = require('./src/controllers');
  
var views = require('koa-views')(
      path.join(__dirname, 'src/views'), {
        default: 'html',
        map: {
          jade: 'jade',
        },
      }
    );

var router = require('./config/routes');

var koa = require('koa'),
    app = koa();
module.exports = app;
module.exports.database = Models.sequelize;

module.exports.models = Models;
module.exports.controllers = Controllers;
module.exports.views = views;

// Sessions
var session = require('koa-generic-session');
app.keys = ['session-secret'];  // FIXME
app.use(session());

var flash = require('koa-connect-flash');
app.use(flash());

// Authentication
var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Static content
var serve = require('koa-static');
app.use(serve('./public'));
app.use(serve('./dist'));

// Routes and views
app.use(views);
app.use(router.routes());

// Middleware
app.use(function *(next) {
  console.log('* %s %s',
    this.method,
    this.url);

  try {
    yield next;
  } catch(e) {
    console.log('ERROR: ' + e.message);
  };
});

// Start the server
if (!module.parent) {
  app.listen(Config.app.port);
  console.log('Listening on %s:%s',
    Config.app.host,
    Config.app.port);
}
