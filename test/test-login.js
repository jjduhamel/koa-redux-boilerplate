'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('Login', function() {
  beforeEach(function *() {
    yield helpers.logout();
  });

  it ('POST /login authenticates user', function *() {
    var res = yield request.post('/login')
                      .send(helpers.testUser)
                      .expect(200)
                      .end();
    expect(res.text).to.equal('OK');
  });

  it ('requires that the user is not authenticated', function *() {
    yield helpers.loginTestUser();
                      
    yield request.post('/login')
                      .send(helpers.testUser)
                      .expect(401)
                      .end();
  });

  it ('blocks invalid password', function *() {
    var creds = _.clone(helpers.testUser);
    creds.password = 'invalid';
    
    var res = yield request.post('/login')
                      .send(creds)
                      .expect(401)
                      .end();
  });

  it ('fails gracefully if password is missing', function *() {
    var creds = _.clone(helpers.testUser);
    creds.password = undefined;
    
    var res = yield request.post('/login')
                      .send(creds)
                      .expect(401)
                      .end();
  });

  it ('fails gracefully for missing credentials', function *() {
    var res = yield request.post('/login')
                      .send({})
                      .expect(401)
                      .end();
  });
});
