'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('Admin', function() {
  beforeEach(function *() {
    yield helpers.logout();
  });

  it('GET /admin shows the admin page', function *() {
    yield helpers.loginTestAdmin();
    var res = yield request.get('/admin')
                      .expect(200)
                      .end();
    // FIXME: Verify response is correct
  });

  it('throws 404 for normal user', function *() {
    yield helpers.loginTestUser();
    var res = yield request.get('/admin')
                      .expect(404)
                      .end();
  });

  it('throws 404 for guest', function *() {
    yield helpers.logout();
    var res = yield request.get('/admin')
                      .expect(404)
                      .end();
  });
});
