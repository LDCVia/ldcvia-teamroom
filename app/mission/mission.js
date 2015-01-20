'use strict';

angular.module('myApp.mission', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/mission', {
    templateUrl: 'mission/mission.html',
    controller: 'MissionCtrl'
  });
}])

.controller('MissionCtrl', ['$scope', '$routeParams', 'dataFactory', '$location', '$rootScope', 
  function($scope, $routeParams, dataFactory, $location, $rootScope) {
    $scope.apikey = $rootScope.apikey;
    $scope.urlBase = dataFactory.data.urlBase;
    $scope.database = dataFactory.data.database;
    $scope.main = dataFactory.data.main;

    $scope.reset = function(form){
      $location.path('/home');
    }

    getMission();
    function getMission(){
      dataFactory.getMission(function(results){
        $scope.mission = dataFactory.data.mission;
        $scope.categories = dataFactory.data.categories;
        $scope.doctypes = dataFactory.data.doctypes;
      })
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

  }
]);