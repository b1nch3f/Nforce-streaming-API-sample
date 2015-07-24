var app = angular.module('StarterApp', []);

AWS.config.update({accessKeyId: 'AKIAIUNDHHYCQAGTM4LA', secretAccessKey: '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'});
  
AWS.config.region = 'us-west-2';
      
var bucket = new AWS.S3({params: {Bucket: 'storail'}});

app.controller('AppCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval ) {
    
    var socket = io.connect();

      socket.on('data', function (data) {
        console.log(data); 
        $(".account_data").text(data);
      });
    
    $scope.url = 'https://s3-us-west-2.amazonaws.com/storail/';
    
    bucket.listObjects(function (err, data) {
      if (err) {
        console.log('cannot load objects from s3');
      }else {
        //console.log(data.Contents);
        $scope.files = data.Contents;
        console.log($scope.files);
        $scope.$apply();
      }
    });
    
    function refresh(){
      bucket.listObjects(function (err, data) {
        if (err) {
          console.log('cannot load objects from s3');
        }else {
          //console.log(data.Contents);
          $scope.files = data.Contents;
          console.log($scope.files);
          $scope.$apply();
        }
      });
    }
    
    $scope.uploadFile = function(){
      var fileChooser = document.getElementById('file-chooser');
      var file = fileChooser.files[0];
      if (file) {
        var params = {Key: file.name, ContentType: file.type, Body: file};
        bucket.upload(params, function (err, data) {
          if(data){
            refresh();
          }
        });
      } else {
        console.log('nothing to upload');
      }
    };
  
    $scope.getTranscript = function(pub_url) {
        
        $http({
            url: "https://api.idolondemand.com/1/api/async/recognizespeech/v1",
            method: "GET",
            params: {
                apikey: '47e03390-be45-4a12-956b-d392dec45dc0',
                url: pub_url
            }
        }).success(function(res) {
            console.log(res);
            var jobID = res.jobID;
            
            var promise = $interval(function() {
            $http({
                url: "https://api.idolondemand.com/1/job/status/"+jobID,
                method: "GET",
                params: {
                  apikey : '47e03390-be45-4a12-956b-d392dec45dc0'
                }
            }).success(function (resp) {
                var status = resp.status;
                console.log(status);
                if(status === "finished") {
                  console.log(resp.actions[0].result.document[0].content);
                  $scope.transcription = resp.actions[0].result.document[0].content;
                  $interval.cancel(promise);
                }
            }).error(function(error) {
                console.log(error);
            });
          }, 10000);
            
        }).
        error(function(data, status, headers, config) {
            console.log(status);
        });
        
      
    };
}]);



