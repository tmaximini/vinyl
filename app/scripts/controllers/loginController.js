'use strict';

/**
 * @ngdoc function
 * @name Vinyl.controller:LoginController
 * @description
 * # LoginController
 */
angular.module('Vinyl')
  .controller('LoginController', function($scope, $cordovaOauth) {

    $scope.handleLogin = function() {
      console.log('handleLogin!!');
        $cordovaOauth.discogs2('DsEvNWcHepADZKygepwO', 'lcgkGWEVfGwHNQgJwHuHIxEjXzGSDjtq').then(function(result) {
            console.log('Response Object -> ' + angular.fromJson(result));
        }, function(error) {
            console.log('Error -> ' + error);
        });
    };

  });
