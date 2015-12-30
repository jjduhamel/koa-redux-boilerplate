'use strict;'

var _ = require('lodash'),
    Router = require('koa-router'),
    koaBody = require('koa-body'),
    React = require('react'),
    reactRouter = require('react-router');

var bodyParser = koaBody();

var prohibitAuth = function *(next) {
  if (this.req.isAuthenticated()) {
    this.flash('error', 'You must be logged out to do that');
    this.throw(401);
  } else {
    yield next;
  }
};

var requireAuth = function *(next) {
  if (this.req.isAuthenticated()) {
    yield next;
  } else {
    this.flash('error', 'You must be logged in to do that');
    this.throw(401);
  }
};

var admins = require('./admins.json');

var requireAdmin = function *(next) {
  if ( this.req.isAuthenticated() &&
       _.includes(admins, this.req.user.email) ) {
    yield next;
  } else {
    this.throw(404);            // Pretend this doesn't exist
  }
};

// Use this on all ajax requests
var exportSession = function *(next) {
  yield next;

  var authed = this.req.isAuthenticated();

  var session = {
    state: ( authed ? 'user' : 'guest' )
  }

  if (authed) {
    session = _.extend(session, { profile: this.req.user.summary() });
  }

  this.body = _.extend(session, { response: this.body });
};

var router = new Router();

router.use(function *(next) {
  var start = new Date;
  yield next;
  var end = new Date;

  console.log('[%s] %s %s - %s ms',
    this.status,
    this.method,
    this.url,
    (end-start));
});

router.use(function *(next) {
  try {
    yield next;
  } catch(e) {
    this.status = e.status || 500;
    this.body = this.flash('error') || e.message;
    this.app.emit('error', e, this);
  };
});

/* NOTE: just fetch this page from /public
router.get('/', function *() {
  yield this.render('index.jade');
});
*/

function _public() {
  var _router = new Router();
  _router.all('/session', exportSession, function *() { this.body = 'OK' });
  return _router;
}

function _noauth() {
  var _router = new Router();
  _router.post('/login', bodyParser, Controllers.user.login);
  _router.post('/register', bodyParser, Controllers.user.registerStep1);
  
  var routes = _.map(_router.stack, (route) => { return route.path; } );
  _.each(routes, (route) => {
    _router.use(route, prohibitAuth);
  });
  return _router;
}

function _auth() {
  var _router = new Router();
  _router.all('/logout', Controllers.user.logout);
  _router.get('/profile', Controllers.user.show);
  _router.post('/profile', bodyParser, Controllers.user.update);
  _router.post('/profile/email', bodyParser, Controllers.user.updateEmail);
  _router.post('/profile/password', bodyParser, Controllers.user.updatePassword);
  
  var routes = _.map(_router.stack, (route) => { return route.path; } );
  _.each(routes, (route) => {
    _router.use(route, requireAuth);
  });
  return _router;
}

function _admin() {
  var _router = new Router({ prefix: '/admin' });
  _router.use(requireAdmin);
  _router.get('/', Controllers.admin.show);
  
  var routes = _.map(_router.stack, (route) => { return route.path; } );
  _.each(routes, (route) => {
    _router.use(route, requireAuth);
    _router.use(route, requireAdmin);
  });
  return _router;
}

function _api() {
  var _router = new Router();
  _router.use(_public().routes());
  _router.use(_noauth().routes());
  _router.use(_auth().routes());
  _router.use(_admin().routes());
  return _router;
}

var serverSideReact = function *(next) {
  // FIXME
  yield next;
};

var _base = new Router();
_base.use(serverSideReact);
_base.use(_api().routes());

var _ajax = new Router({ prefix: '/ajax' });
_ajax.use(exportSession);
_ajax.get('/', function *() { this.body = 'OK' });
_ajax.all('/session', function *() { this.throw(404) });
_ajax.use(_api().routes());

router.use(_ajax.routes());
router.use(_base.routes());

module.exports = router;
