var express = require('express');
var app = express();

var nforce = require('nforce');

var org = nforce.createConnection({
  clientId: '3MVG9ZL0ppGP5UrAVV8aFuWcpQWWMzTBr1D3o6PUAWXK_PEdc6tE9.G_Voianx.0.yQKM0iAyeWP.GxuyUXhT',
  clientSecret: '7838221342884816727',
  redirectUri: 'https://storail.herokuapp.com/oauth/_callback',
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var oauth;
var USERNAME = "sangram200715@salesforce.com";
var PASSWORD = "ilovejava@123";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

function routeHandler() {
  app.get('/', function(request, response) {
    response.send('yo');
  }).get('/oauth/_callback', function(request, response) {
      return response.redirect('/');
  });
}

org.authenticate({ username: USERNAME, password: PASSWORD }, function(err, resp) {
  if(err) {
    console.error('--> unable to authenticate to sfdc');
      console.error('--> ' + JSON.stringify(err));
    } else {
        console.log('--> authenticated!');
        oauth = resp;
        routeHandler();
    }
  }
);

//canvas callback
app.post('/canvas/callback', function(req,res){
    return res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


