'use strict;'

var _ = require('lodash'),
    helpers = require('./spec-helper');

describe('Profile', function() {
  beforeEach(function *() {
    yield helpers.logout();
  });

  it ('GET /profile displays user profile', function *() {
    yield helpers.loginTestUser();
    var res = yield request.get('/profile')
                      .expect(200)
                      .end();
    expect(JSON.parse(res.text)).to.have.all.keys('first_name', 'last_name', 'email', 'avatar_url', 'phone_number');
  });

  it ('GET /profile requires authentication', function *() {
    var res = yield request.get('/profile')
                      .expect(401)
                      .end();
  });

  it ('POST /profile updates a user profile', function *() {
    yield helpers.loginTestUser();
    var res = yield request.post('/profile')
                      .send({
                   email: 'newemail@example.com',
                password: 'n3wp4sSWord',
               first_name: 'New',
               last_name: 'Name',
              avatar_url: 'http://example.com/icon.png',
            phone_number: '415-867-5309',
               fake_data: 'ignore this',
                      })
                      .expect(200)
                      .end();
    expect(JSON.parse(res.text)).to.have.all.keys('accepted', 'rejected');
    expect(JSON.parse(res.text).accepted).to.have.all.members([ 'first_name', 'last_name', 'avatar_url', 'phone_number' ]);
    expect(JSON.parse(res.text).rejected).to.have.all.members([ 'email', 'password', 'fake_data' ]);

    var profile = yield helpers.fetchProfile();
    expect(profile.email).to.not.equal('newemail@example.com');
    expect(profile.first_name).to.equal('New');
    expect(profile.last_name).to.equal('Name');
    expect(profile.avatar_url).to.equal('http://example.com/icon.png');
    expect(profile.phone_number).to.equal('415-867-5309');
  });

  it ('POST /profile requires authentication', function *() {
    var res = yield request.get('/profile')
                      .expect(401)
                      .end();
  });
});
