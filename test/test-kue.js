'use strict;'

var _ = require('lodash'),
    path = require('path'),
    locks = require('locks'),
    helpers = require('./spec-helper'),
    scaClient = require(__AppRoot + '/lib/sca-client');

describe('Kue', function() {
  it('query-sca posts to SCA', function *() {
    var mutex = locks.createMutex();

    nock(scaClient.baseURL)
      .get('/drawx.asp')
      .query(true)
      .reply(200, function() {
        mutex.unlock();
        return 'PASSED';
      });

    mutex.lock(function () {
      var job = Kue.create('query-sca', { gameID: 69, gameData: {} });
      job.save();
    });

    mutex.timedLock(1000, function(err) {
      mutex.unlock();
      if (err) {
        assert(false);
      } else {
        assert(true);
      }
    })
  });
});
