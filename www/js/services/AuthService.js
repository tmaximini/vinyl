'use strict';

angular.module('vinyl')
  .service('AuthService', function ($auth) {

    var isAuthenticated = function() {
      console.log($auth);
    };

    return {
      isAuthenticated: isAuthenticated
    };

  });