'use strict';

angular.module('vinyl')
  .controller('LoginCtrl', function($scope, $auth) {

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function(data) {
        console.log('authenitcated: ', data);
      });
    };

  });