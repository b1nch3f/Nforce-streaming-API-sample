var express = require('express');
var nforce = require('nforce');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//
app.get('/', function(request, response) {
  response.render('pages/index');
});

//canvas callback
app.post('/canvas/callback', function(req,res){
    return res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


