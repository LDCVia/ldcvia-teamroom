'use strict';

angular.module('myApp.newdocument', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/newdocument', {
    templateUrl: 'newdocument/newdocument.html',
    controller: 'NewDocumentCtrl'
  });
}])

.controller('NewDocumentCtrl', ['$scope', '$routeParams', 'dataFactory', '$location', '$rootScope', '$cookieStore', 
  function($scope, $routeParams, dataFactory, $location, $rootScope, $cookieStore) {
    $scope.toolbar = [['h1','h2','h3'],['bold','italics','underline','justifyLeft','justifyCenter','justifyRight','ul','ol'],['p','pre','quote','insertLink']];
    getMission();
    function getMission(){
      dataFactory.getMission(function(results){
        $scope.mission = dataFactory.data.mission;
        $scope.categories = dataFactory.data.categories;
        $scope.doctypes = dataFactory.data.doctypes;
      })
    }
    getMilestones();
    function getMilestones() {
      dataFactory.getMilestones('MainTopic', function(results){
        $scope.milestones = results.sort();
      });
    }
    getUsers();
    function getUsers() {
      dataFactory.getUsers(function(results){
        $scope.users = results;
      });
    }


    $scope.saveDocument = function(thedoc){
      thedoc.__created = new Date();
      thedoc.__form = "MainTopic";
      thedoc.From = $cookieStore.get('username');
      var fileInput = document.getElementById('file');
      var file = fileInput.files[0];
      var reader = new FileReader();
      thedoc.Body = {
        "type": "multipart",
        "content": [{
          "contentType": "text/plain; charset=UTF-8",
          "data": thedoc.Body
        }]
      };

      if (file) {
        reader.onload = function(e) {
          thedoc.Body.content.push({
            "contentType": file.type + "; name=\"" + file.name + "\"",
            "contentDisposition": "attachment; filename=\"" + file.name + "\"",
            "contentTransferEncoding": "base64",
            "data": reader.result.match(/,(.*)$/)[1]
          });
          dataFactory.saveNewDocument('MainTopic', thedoc, function(){
            $location.path('/home');
          });
        }
        reader.readAsDataURL(file);
      } else {
        dataFactory.saveNewDocument('MainTopic', thedoc, function(){
          $location.path('/home');
        });
      }
    }
  }
]);