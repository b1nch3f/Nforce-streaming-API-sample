var app = angular.module('StarterApp', ['ngMaterial']);

var sr = document.getElementById('sf-canvas-signed-request').content;
var conn = new jsforce.Connection({ signedRequest: sr });

app.controller('AppCtrl', ['$scope', function($scope){
  conn.query('SELECT Id, Name FROM Account', function(err, res) {
  if (err) { return console.error(err); }
    console.log(res);
  });
}]);