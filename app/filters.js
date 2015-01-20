'use strict';

/* Filters */

angular.module('dbviewerFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
})
.filter('notesname', function() {
  return function(input) {
    if (!input){
      return "";
    }
  	try{
      input = JSON.parse(input);
    }catch(e){
      input = [input];
    }
    var out = [];
    for (var i=0; i<input.length; i++){
      var name = input[i];
      if (name.indexOf("CN=") > -1){
        name = name.replace("CN=", "");
        name = name.replace("OU=", "");
        name = name.replace("O=", "");
      }
      out.push(name);
    }
    return out.join(",");
  }
})
.filter('implodelist', function() {
  return function(input) {
    if (Array.isArray(input)){
      return input.join(", ");
    }else{
      return input;
    }
  }
}).filter('gethtml', ['$sce', function($sce){
  return function(input){
    return $sce.trustAsHtml(input);
  }
}])
