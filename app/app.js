'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngCookies', 
  'myApp.login',
  'myApp.home',
  'myApp.mission',
  'myApp.newdocument',
  'myApp.version',
  'dbviewerServices',
  'dbviewerFilters', 
  'textAngular'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    otherwise({
      redirectTo: '/home'
    });
}]).
run(function($rootScope, $location, $cookieStore) {
  // register listener to watch route changes
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    if ($cookieStore.get('apikey')){
      $rootScope.apikey = $cookieStore.get('apikey');
      $rootScope.user = $cookieStore.get('user');
    }
    if ($rootScope.apikey == null) {
      // no logged user, we should be going to #login
      if (next.templateUrl == "/login/login.html") {
        // already going to #login, no redirect needed
      } else {
        // not going to #login, we should redirect now
        $location.path("/login");
      }
    }
  });
});

myApp.controller('menuitems', ['$scope', '$routeParams', 'dataFactory', '$location', '$rootScope', '$cookieStore',
  function($scope, $routeParams, dataFactory, $location, $rootScope, $cookieStore) {
    $scope.menuitems = [{
      'label': 'Home',
      'link': '#/home'
    }, {
      'label': 'Mission',
      'link': '#/mission'
    }, {
      'label': 'New Document',
      'link': '#/newdocument'
    }];
    $scope.selected = 0;
    $scope.selectTab = function(index) {
      $scope.selected = index;
    }

    $scope.doSearch = function() {
      var query = {
        "filters": [{
          "operator": "contains",
          "field": "Body__parsed",
          "value": $scope.searchterm
        }, {
          "operator": "contains",
          "field": "Subject",
          "value": $scope.searchterm
        }, {
          "operator": "contains",
          "field": "From",
          "value": $scope.searchterm
        }, {
          "operator": "contains",
          "field": "DocType",
          "value": $scope.searchterm
        }]
      }

      dataFactory.searchCollection("MainTopic", query).success(function(memos) {
        dataFactory.searchCollection("Response", query).success(function(replies) {
          dataFactory.searchCollection("ResponseToResponse", query).success(function(replies2) {
            var out = {};
            out.count = memos.count + replies.count + replies2.count;
            out.data = memos.data.concat(replies.data);
            out.data = memos.data.concat(replies2.data);
            dataFactory.data.documents = out;
            dataFactory.data.main.total = out.count;
            dataFactory.data.search = true;
          });
        })
      });
    }

    $scope.logout = function(){
      $cookieStore.remove('apikey');
      window.location.reload();
    }
  }
])
