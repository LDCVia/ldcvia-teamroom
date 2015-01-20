'use strict';

/* Services */

var dbviewerServices = angular.module('dbviewerServices', ['ngResource']);

dbviewerServices.factory('dataFactory', ['$http', '$rootScope',
  function($http, $rootScope) {
    var urlBase = 'https://local.ldcvia.com:3001/1.0';
    var db = '192-168-0-6-demos-teamroom-nsf';
    var dataFactory = {};

    dataFactory.data = {};
    dataFactory.data.main = {
      start: 0
    };
    dataFactory.data.search = false;
    dataFactory.data.database = db;
    dataFactory.data.urlBase = urlBase;

    dataFactory.login = function(data, callback) {
      return $http.post(urlBase + '/login', JSON.stringify(data)).success(callback);
    }

    dataFactory.getDatabases = function() {
      return $http.get(urlBase + "/databases", {
        headers: {
          'apikey': $rootScope.apikey
        }
      });
    };

    dataFactory.getCollections = function() {
      return $http.get(urlBase + '/collections/' + db, {
        headers: {
          'apikey': $rootScope.apikey
        }
      });
    };

    dataFactory.getDocuments = function(collection, start) {
      return $http.get(urlBase + '/collections/' + db + "/" + collection + "?start=" + start + "&count=10", {
        headers: {
          'apikey': $rootScope.apikey
        }
      });
    };

    dataFactory.getResponses = function(collection, unid) {
      return $http.get(urlBase + '/responses/' + db + "/" + collection + "/" + unid, {
        headers: {
          'apikey': $rootScope.apikey
        }
      });
    }

    dataFactory.getResponseDocuments = function(unids) {
      return $http.post(urlBase + '/documents/' + db, JSON.stringify({'docs': unids}), {
        headers: {
          'apikey': $rootScope.apikey
        }
      });
    }

    dataFactory.getDocument = function(collection, unid) {
      return $http.get(urlBase + '/collections/' + db + "/" + collection + "/" + unid, {
        headers: {
          'apikey': $rootScope.apikey
        }
      });
    }

    dataFactory.searchCollection = function(collection, query) {
      return $http.post(urlBase + '/search/' + db + '/' + collection + "?count=250", JSON.stringify(query), {
        headers: {
          'apikey': $rootScope.apikey
        }
      });
    }

    dataFactory.saveNewDocument = function(collection, data, callback) {
      var date = new Date();
      var time = date.getTime();
      return $http.put(urlBase + '/document/' + db + '/' + collection + '/' + time, JSON.stringify(data), {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    dataFactory.saveNewResponse = function(data, callback) {
      var date = new Date();
      var time = date.getTime();
      return $http.put(urlBase + '/document/' + db + '/Response/' + time, JSON.stringify(data), {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    dataFactory.getCategories = function(callback){
      return $http.get(urlBase + '/list/' + db + '/Mission/Categories', {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    dataFactory.getDocTypes = function(callback){
      return $http.get(urlBase + '/list/' + db + '/Mission/DocType', {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    dataFactory.getMilestones = function(collection, callback){
      return $http.get(urlBase + '/list/' + db + '/' + collection + '/Subject', {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    dataFactory.getUsers = function(callback){
      return $http.get(urlBase + '/users', {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    dataFactory.getMissionID = function(callback){
      $http.get(urlBase + '/list/' + db + '/Mission/__unid', {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    dataFactory.getMission = function(callback) {
      dataFactory.getMissionID(function(missions){
        $http.get(urlBase + '/document/' + db + '/Mission/' + missions[0], {
          headers: {
            'apikey': $rootScope.apikey
          }
        }).success(function(results, status, headers, config){
          dataFactory.data.mission = results;
          dataFactory.data.categories = results.Categories;
          dataFactory.data.doctypes = results.DocType;
          callback(results);
        });
      })
    }

    dataFactory.saveMission = function(data, callback) {
      return $http.post(urlBase + '/document/' + db + '/Mission/' + data.__unid, JSON.stringify(data), {
        headers: {
          'apikey': $rootScope.apikey
        }
      }).success(callback);
    }

    return dataFactory;
  }
]);