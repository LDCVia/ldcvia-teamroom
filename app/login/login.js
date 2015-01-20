'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$routeParams', 'dataFactory', '$location', '$rootScope', '$cookieStore',  
  function($scope, $routeParams, dataFactory, $location, $rootScope, $cookieStore) {
    $scope.status = '';
  	$scope.login = function(data) {
      dataFactory.login(data)
        .success(function(response) {
          if (!response.apikey){
            $scope.status = response.error;  
          }else{
            $cookieStore.put('apikey', response.apikey);
            $cookieStore.put('username', response.email);
            $rootScope.apikey = response.apikey;
            $rootScope.user = response;
            $location.path('/home');
          }
        })
        .error(function(error) {
          $scope.status = 'Error logging in: ' + error.message;
        });
    }

}]);