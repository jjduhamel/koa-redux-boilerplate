'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('Registration', function() {
  beforeEach(function *() {
    yield helpers.logout();
  });

  it ('POST /register creates a new user', function *() {
    var creds = _.clone(helpers.testUser);
    creds.email = 'newuser@example.com';
    
    var res = yield request.post('/register')
                      .send(creds)
                      .expect(200)
                      .end();
    expect(res.text).to.equal('OK');
  });

  it ('requires the user is not authenticated', function *() {
    var creds = _.clone(helpers.testUser);
    creds.email = 'newuser2@example.com';
    
    yield helpers.loginTestUser();
    yield request.post('/register')
            .send(creds)
            .expect(401)
            .end();
  });

  it ('won\'t register an existing account', function *() {
    var creds = _.clone(helpers.testUser);
    
    yield request.post('/register')
            .send(creds)
            .expect(409)
            .end();
  });
});
