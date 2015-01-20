'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$routeParams', 'dataFactory', '$location', '$rootScope', '$cookieStore', 
  function($scope, $routeParams, dataFactory, $location, $rootScope, $cookieStore) {
    $scope.toolbar = [['h1','h2','h3'],['bold','italics','underline','justifyLeft','justifyCenter','justifyRight','ul','ol'],['p','pre','quote','insertLink']];
    $scope.searchterm = "";
    $scope.docdetail;
    $scope.search = function(){
      return dataFactory.data.search;
    }
    $scope.responses = [];
    $scope.collection;
    $scope.apikey = $rootScope.apikey;
    $scope.urlBase = dataFactory.data.urlBase;
    $scope.database = dataFactory.data.database;
    $scope.main = dataFactory.data.main;
    $scope.index;
    $scope.parent;

    function getDocuments(collection) {
      dataFactory.getDocuments(collection, $scope.main.start)
        .success(function(documents) {
          dataFactory.data.documents = documents;
          dataFactory.data.main.total = documents.count;
          dataFactory.data.search = false;
        })
        .error(function(error) {
          $scope.status = 'Unable to load documents: ' + error.message;
        });
    }

    $scope.getDocumentData = function() {
      try{
        return dataFactory.data.documents.data;
      }catch(e){
        return [];
      }
    }

    function getResponses(collection, unid) {
      if (unid && unid != "") {
        dataFactory.getResponses(collection, unid)
          .success(function(unids) {
            if (unids.length > 0) {
              dataFactory.getResponseDocuments(unids)
                .success(function(responsedocs) {
                  $scope.responses = responsedocs;
                });
            } else {
              $scope.responses = [];
            }
          })
          .error(function(error) {
            $scope.status = 'Unable to load responses: ' + error.message;
          });
      }
    }

    $scope.getPaginationDescription = function() {
      var start = dataFactory.data.main.start + 1;
      var end = dataFactory.data.main.start + 10;
      var total = dataFactory.data.main.total;
      if (end > total) {
        end = total;
      }
      return start + " to " + end + " of " + total;
    }

    $scope.getSearchDescription = function() {
      return dataFactory.data.main.total + " matches";
    }

    $scope.firstPage = function(collection) {
      dataFactory.data.main.start = 0;
      getDocuments(collection);
    }

    $scope.lastPage = function(collection) {
      dataFactory.data.main.start = (dataFactory.data.main.total - 10);
      getDocuments(collection);
    }

    $scope.nextPage = function(collection) {
      if (dataFactory.data.main.start < dataFactory.data.main.total) {
        dataFactory.data.main.start += 10;
      }
      if (dataFactory.data.main.start >= dataFactory.data.main.total) {
        dataFactory.data.main.start = (dataFactory.data.main.total - 1);
      }
      getDocuments(collection);
    }

    $scope.previousPage = function(collection) {
      dataFactory.data.main.start -= 10;
      if (dataFactory.data.main.start < 0) {
        dataFactory.data.main.start = 0;
      }
      getDocuments(collection);
    }

    $scope.detail = function($parent, index) {
      $scope.index = index;
      $scope.parent = $parent;
      $scope.docdetail = dataFactory.data.documents.data[index];
      $parent.selected = $scope.docdetail;
      getResponses($scope.collection, $scope.docdetail.__unid);
    }

    $scope.reset = function(form){
      $location.path('/home');
    }

    $scope.saveNewResponse = function(thedoc){
      thedoc.__created = new Date();
      thedoc.__form = "Response";
      thedoc.__parentid = $scope.docdetail.__unid;
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
          dataFactory.saveNewResponse(thedoc, function(){
            $scope.detail($scope.parent, $scope.index);
          });
        }
        reader.readAsDataURL(file);
      } else {
        dataFactory.saveNewResponse(thedoc, function(){
          $scope.detail($scope.parent, $scope.index);
        });
      }
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

    getMission();
    function getMission(){
      dataFactory.getMission(function(results){
        $scope.mission = results;
        $scope.categories = results.Categories;
        $scope.doctypes = results.DocType;
      })
    }

    $scope.reset = function(form){
      $location.path('/home');
    }

    $scope.saveMission = function(){
      if (!Array.isArray($scope.mission.Categories)){
        $scope.mission.Categories = $scope.mission.Categories.split(",");
      }
      if (!Array.isArray($scope.mission.DocType)){
        $scope.mission.DocType = $scope.mission.DocType.split(",");
      }
      delete $scope.mission._id;
      dataFactory.saveMission($scope.mission, function(){
        $scope.categories = $scope.mission.Categories;
        $scope.doctypes = $scope.mission.DocType;
        $location.path('/home');
      })
    }

    getDocuments('MainTopic');
  }
]);