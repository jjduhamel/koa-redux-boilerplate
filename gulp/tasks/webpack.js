'use strict;'

var path = require('path'),
    gulp = require('gulp'),
    webpack = require('webpack'),
    devServer = require('webpack-dev-server');

var config = require('../config'),
    helpers = require('../helpers');

var webpackConfig = require(path.join(config.basedir, 'webpack.config.js'))

gulp.task('webpack', function(cb) {
  webpack(webpackConfig, function(err, data) {
    if (err) throw new Error(err.message);
    // FIXME: Do something with data
    cb();
  });
});

gulp.task('webpack-devserver', function() {
  webpackConfig.entry.app.unshift(
    "webpack-dev-server/client?http://localhost:9000",
    "webpack/hot/dev-server"
  );

  new devServer(webpack(webpackConfig), {
    contentBase: helpers.appdir('public'),
    hot: true,
    proxy: {
      '*': 'http://localhost:3000'
    }
  }).listen(9000, 'localhost', function(err, data) {
    if (err) {
      throw new Error(err.message);
    }
    console.log("Listening on http://localhost:9000");
  });
});
