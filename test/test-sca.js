'use strict;'

var _ = require('lodash'),
    path = require('path'),
    helpers = require('./spec-helper'),
    client = require(__AppRoot + '/lib/sca-client');

describe('SCA Lottery API', function() {
  it ('hits the primary endpoint', function *() {
    nock(client.baseURL)
      .get('/draw.asp')
      .query(true)
      .reply(200, 'PASSED');
    var data = yield client.draw(client.TEST, { a: 1, b: 2, c: 3 });
    expect(data).to.equal('PASSED');
  });
  
  it ('hits the xml endpoint', function *() {
    nock(client.baseURL)
      .get('/drawx.asp')
      .query(true)
      .reply(200, 'PASSED');
    var data = yield client.drawXML(client.TEST, { a: 1, b: 2, c: 3 });
    expect(data).to.equal('PASSED');
  });
  
  it ('throws an error for 40x response', function *() {
    nock(client.baseURL)
      .get('/drawx.asp')
      .query(true)
      .reply(409, 'PASSED');
    try {
      yield client.drawXML(client.TEST, { a: 1, b: 2, c: 3 });
      assert(false);
    } catch(err) {
      expect(err.message).to.equal('[409] PASSED');
    }
  });
  
  it ('throws an error for 500 response', function *() {
    nock(client.baseURL)
      .get('/drawx.asp')
      .query(true)
      .reply(500, 'PASSED');
    try {
      yield client.drawXML(client.TEST, { a: 1, b: 2, c: 3 });
      assert(false);
    } catch(err) {
      expect(err.message).to.equal('[500] PASSED');
    }
  });
});
