'use strict;'

var _ = require('lodash'),
    bcrypt = require('bcrypt');
    passport = require('koa-passport');

var User = Models.User;

module.exports = {
  registerStep1: function *() {
    var params = this.request.body;

    try {
      var user = yield User.create({
        email: params['email'],
        password: bcrypt.hashSync(params['password'], 10),
      });
      yield user.reload();
    } catch(e) {
      console.log(e.message);
      this.throw(409);
    }

    //user.verifyEmail();

    this.req.login(user, function(err) {
      //if (err) throw(501, err.message);
      this.body = 'OK';
    }.bind(this));
  },

  registerStep2: function *() {
    // FIXME: Mark user as confirmed
  },

  login: function *() {
    var ctx = this;
    yield passport.authenticate('local', function *(err, user, info) {
      if (err) throw(err);

      if (!user) {
        ctx.flash('error', 'Invalid username or password');
        ctx.throw(401);
      } else {
        yield ctx.login(user);
        ctx.body = 'OK';
      }
    }).call(this);
  },

  logout: function *() {
    this.logout();
    this.body = 'OK';
  },

  profile: function *() {
    this.body = this.req.user.profile();
  },

  show: function *() {
    this.body = this.req.user.profile();
  },

  update: function *() {
    var params = this.request.body,
        accept = _.pick(params, [
          'first_name',
          'last_name',
          'avatar_url',
          'phone_number',
        ]),
        reject = _.omit(params, _.keys(accept));
    yield this.req.user.updateAttributes(accept);
    this.body = { accepted: _.keys(accept), rejected: _.keys(reject) };
  },

  updateEmail: function *() {
    // FIXME
  },

  updatePassword: function *() {
    // FIXME
  },
};
