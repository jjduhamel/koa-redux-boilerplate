'use strict;'

var passport = require('koa-passport'),
    bcrypt = require('bcrypt'),
    co = require('co');

var User = Models.User;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  co(function *() {
    var user = yield User.findOne({
      where: { id: id }
    });
    done(null, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;

function authLocal(email, password, done) {
  var out = co(function *() {
    try {
      var user = yield User.findOne({
        where: { email: email }
      });
      if (!user) return null;

      var auth = bcrypt.compareSync(password, user.password);
      return (auth ? user : null);
    } catch(err) {
      console.log('ERROR: %s', err.message);
      return null;
    }
  }).then((user) => done(null, user));
}

passport.use(new LocalStrategy({
  usernameField: 'email',
}, authLocal));

module.exports = passport;
