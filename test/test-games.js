'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('Games', function() {
  it('GET /games returns a list of games', function *() {
    var res = yield request.get('/games')
                      .expect(200)
                      .end();
    // FIXME: assert response is correct
  });
  
  it('GET /games/:id returns a game', function *() {
    var res = yield request.get('/games/1')
                      .expect(200)
                      .end();
    // FIXME: assert response is correct
  });
  
  it('POST /games/:id plays a game', function *() {
    var res = yield request.post('/games/1')
                      .expect(200)
                      .end();
    expect(JSON.parse(res.text)).to.have.keys('wager', 'payout');
    expect(JSON.parse(res.text).wager).to.have.all.keys('credits');
    expect(JSON.parse(res.text).payout).to.have.all.keys('prize', 'credits');
  });
});
