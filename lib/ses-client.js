/*
 * Amazon SES Client
 *
 * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html
 */
'use strict;'

var _ = require('lodash'),
    AWS = require('aws-sdk');

// FIXME: Allow user to pass additional settings
var ses = new AWS.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
});

module.exports = ses;

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
exports.sendEmail = function *(opts, cb) {
  var params = {
    Source: opts.from || 'noreply@longga.me',
    Destination: {
      ToAddresses: [].concat(opts.to).filter(Boolean),
      CcAddresses: [].concat(opts.cc).filter(Boolean),
      BccAddresses: [].concat(opts.bcc).filter(Boolean),
    },
    Message: {
      Subject: {
        Data: opts.subject || 'Information about your Long Game account',
      },
      Body: {
        Text: {
          Data: opts.body || 'This message has no content',
        }
      }
    },
  };

  ses.sendEmail(params, cb);
};
