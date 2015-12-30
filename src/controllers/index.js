'use strict;'

var fs = require('fs'),
    path = require('path');

var basename = path.basename(module.filename);

var index = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var name = file.match(/[^\.]+/)[0];
    index[name] = require(path.join(__dirname, file));
  });

module.exports = index;
