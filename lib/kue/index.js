'use strict;'

var fs = require('fs'),
    path = require('path'),
    kue = require('kue');

var basename = path.basename(module.filename);

var queue = kue.createQueue({
  redis: {
    host: process.env.REDIS_URL || 'redis',
    //auth: 'password',
  }
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var name = file.match(/[^\.]+/)[0];
    require(path.join(__dirname, file))(queue);
  });

module.exports = queue;
