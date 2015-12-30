'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('Index', function() {
  it('GET / renders a page', function *() {
    var res = yield request.get('/')
                      .expect(200)
                      .end();
  });

  it('GET /session returns session info', function *() {
    var res = yield request.get('/session')
                      .expect(200)
                      .end();
    expect(JSON.parse(res.text)).to.include.keys('state');
  });
});
