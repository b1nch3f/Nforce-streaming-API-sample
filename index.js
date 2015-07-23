var express = require('express');
var app = express();
var server = require('http').Server(app);
// attach socket.io and listen
var io = require('socket.io')(server);
// get a reference to the socket once a client connects
var socket = io.sockets.on('connection', function (socket) { });

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
    response.render('pages/index');
  }).get('/oauth/_callback', function(request, response) {
      return response.redirect('/');
  }).get('/createAccount', function(req, res){
      console.log('Attempting to insert account');
      var acc = nforce.createSObject('Account');
      acc.set('Name', 'Tuffy Cleaners');
      acc.set('Phone', '800-555-2345');
      acc.set('SLA__c', 'Gold');
      
      org.insert({ sobject: acc, oauth: oauth }, function(err, resp){
        if(!err) res.send('It worked!');
      });
    }
  ).get('/getAccounts', function(req, res){
      console.log('Attempting to get accounts');
      var q = 'SELECT Id, Name, CreatedDate, BillingCity FROM Account';

      org.query({ query: q, oauth: oauth}, function(err, resp){
      
        if(!err && resp) {
      
          res.send(JSON.stringify(resp));
      
        }
      });
    }
  );
}

io.on('connection', function(socket){
  console.log('a user connected');
    
  org.authenticate({ username: USERNAME, password: PASSWORD }, function(err, resp) {
    if(err) {
      console.error('--> unable to authenticate to sfdc');
        console.error('--> ' + JSON.stringify(err));
    } else {
      console.log('--> authenticated!');
      oauth = resp;
      routeHandler();
    }
      
      
      
    // subscribe to a pushtopic
    console.log('connecting to topic');
    var str = org.stream({ topic: 'AllAccounts', oauth: oauth });
  
    str.on('connect', function(){
      console.log('connected to pushtopic');
    });
  
    str.on('error', function(error) {
      console.log('error: ' + error);
    });
  
    str.on('data', function(data) {
      console.log(data.event.type + ': ' + data.sobject.Name);
      socket.emit('data', data.sobject.Name);
    });
  });
    
});

//canvas callback
app.post('/canvas/callback', function(req,res){
    return res.redirect('/');
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
