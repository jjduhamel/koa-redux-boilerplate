var express = require('express'),
    kue = require('./lib/kue'),
    ui = require('kue-ui');

var app = express();

ui.setup({
  apiURL: '/api',
  baseURL: '/kue',
});

kue.app.set('title', 'Long Game');

app.use('/api', kue.app);
app.use('/kue', ui.app);

if ( !module.parent ) {
  app.listen(3000)
  console.log('Kue listening on port 3000');
}
