'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('Logout', function() {
  beforeEach(function *() {
    yield helpers.logout();
  });

  it ('POST /logout logs out a user', function *() {
    yield helpers.loginTestUser();
    var res = yield request.post('/logout')
                      .expect(200)
                      .end();
    expect(res.text).to.equal('OK');
  });

  it ('requires authentication', function *() {
    yield request.post('/logout')
            .expect(401)
            .end();
  });
});
