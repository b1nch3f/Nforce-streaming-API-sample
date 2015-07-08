var express = require('express');
var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 5000));

process.env.PWD = process.cwd();
app.use(express.static(process.env.PWD + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


