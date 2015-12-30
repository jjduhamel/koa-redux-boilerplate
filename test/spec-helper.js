'use strict;'

var _ = require('lodash'),
    path = require('path'),
    chai = require('chai');

var Umzug = require('umzug');
    
global.assert = chai.assert,
global.expect = chai.expect,
global.should = chai.should();

global.app = require('../server');
global.request = require('co-supertest').agent(app.listen());
global.nock = require('nock');

require('co-mocha');

before(function *() {
  yield Migrate.up();

  yield Seed.up('20151210131217-test-admin');
  yield Seed.up('20151210131133-test-user');
});

after(function *() {
  yield Seed.down('20151210131217-test-admin');
  yield Seed.down('20151210131133-test-user');

  var migrations = yield Migrate.executed();
  for (var j=0; j<migrations.length; j++) {
    yield Migrate.down(migrations[j].file);
  }
});

var fetchSession = function *() {
  var res = yield request.get('/session')
                    .end();
  return JSON.parse(res.text);
};
exports.fetchSession = fetchSession;

var fetchProfile = function *() {
  if (yield testAuth()) {
    var res = yield request.get('/profile')
                      .end();
    return JSON.parse(res.text);
  } else {
    return {};
  }
};
exports.fetchProfile = fetchProfile;

var testAuth = function *() {
  var session = yield fetchSession();
  return (session['state'] == 'user');
};
exports.testAuth = testAuth;
exports.isAuthed = testAuth;

var testUser = {
  email: 'test@example.com',
  password: 'Test123!'
};
exports.testUser = testUser;

var testAdmin = {
  email: 'admin@example.com',
  password: 'Test123!'
};
exports.testAdmin = testAdmin;

var loginTestUser = function *() {
  if (yield testAuth()) {
    yield logout();
  }
  yield request.post('/login')
          .send(testUser)
          .end();
  assert(yield testAuth());
  return 'OK';
};
exports.loginTestUser = loginTestUser;

var loginTestAdmin = function *() {
  if (yield testAuth()) {
    yield logout();
  }
  yield request.post('/login')
          .send(testAdmin)
          .end();
  assert(yield testAuth());
  return 'OK';
};
exports.loginTestAdmin = loginTestAdmin;

var logout = function *() {
  if (yield testAuth()) {
    yield request.post('/logout')
            .end();
  }
  assert(!(yield testAuth()));
  return 'OK';
};
exports.logout = logout;

global.Migrate = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: Models.sequelize,
      },
      migrations: {
        path: path.join(__AppRoot, 'db/migrate'),
        params: [ Models.sequelize.getQueryInterface(),
                  Models.Sequelize ],
      },
    });

global.Seed = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: Models.sequelize,
      },
      migrations: {
        path: path.join(__AppRoot, 'db/seed'),
        params: [ Models.sequelize.getQueryInterface(),
                  Models.Sequelize ],
      },
    });
