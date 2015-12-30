'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('AJAX', function() {
  beforeEach(function *() {
    yield helpers.logout();
  });

  it('GET /ajax exports current session', function *() {
    var res = yield request.get('/ajax')
                      .expect(200)
                      .end();
    expect(JSON.parse(res.text)).to.have.all.keys('state', 'response');
  });
  
  it('includes a profile summary when authenticated', function *() {
    yield helpers.loginTestUser();
    var res = yield request.get('/ajax')
                      .expect(200)
                      .end();
    expect(JSON.parse(res.text)).to.have.all.keys('state', 'profile', 'response');
    expect(JSON.parse(res.text).profile).to.have.all.keys('first_name', 'last_name', 'email', 'avatar_url');
  });
  
  it('GET /ajax/session throws a 404', function *() {
    var res = yield request.get('/ajax/session')
                      .expect(404)
                      .end();
  });

  // FIXME: Would be good to somehow verify that ajax covers all routes
});
