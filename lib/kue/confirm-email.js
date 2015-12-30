'use strict;'

var fs = require('fs');

var sesClient = require('../ses-client');

module.exports = function(queue) {
  queue.process('confirm-email', function(job, done) {
    // FIXME: Mark Email sent to user

    sesClient.sendEmail({
      to: 'john.duhamel@gmail.co',
      subject: 'Please verify your email address',
      body: 'PLACEHOLDER'                             //FIXME
    }, function(data, err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });
}
