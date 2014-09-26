'use strict';

angular.module('vinyl')
  .service('AuthService', function ($q, $window, $http) {

    var user = null;
    var userLoggedIn = false;

    var showAuthPopup = function() {
      $window.open('http://localhost:3000/auth', '_blank', 'location=no,toolbar=no');
    };

    var testLoggedIn = function() {
      var deferred = $q.defer();
      $http.get('http://localhost:3000/me')
        .success(function(data) {
          console.log('data:', data);
          if (!data.error && data.username) {
            console.log('user is logged in!');
            userLoggedIn = true;
            deferred.resolve(userLoggedIn);
          } else {
            console.log('user is NOT logged in!');
            userLoggedIn = false;
            deferred.resolve(userLoggedIn);
          }
        });
      return deferred.promise;
    };




    return {
      showAuthPopup: showAuthPopup,
      testLoggedIn: testLoggedIn
    };


  });