var app = angular.module('StarterApp', ['ngMaterial']);

app.controller('AppCtrl', ['$scope', function($scope){
  jsforce.browser.init({
    clientId: '3MVG9ZL0ppGP5UrCN4Se0WPHFBrquP75L7MA0cFcCVdSTcbuv4o_9EDY036KrG2VEbmiZ7FBzIqb7Xb8EYHwE',
    redirectUri: 'https://storail.herokuapp.com/canvas/callback',
    proxyUrl: 'https://storail.herokuapp.com'
  });
  
  jsforce.browser.on('connect', function(conn) {
    conn.query('SELECT Id, Name FROM Account', function(err, res) {
      if (err) { return handleError(err); }
      handleResult(res);
    });
  });
  
}]);