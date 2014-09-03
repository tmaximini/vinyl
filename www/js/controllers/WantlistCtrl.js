'use strict';

angular.module('vinyl')

  .controller('WantlistCtrl', function($scope, $window, $ionicLoading, $ionicPopup, ArtistService, LabelService, UserService, AuthService) {
    console.log('hi from WantlistCtrl');

    $scope.collection = [];
    $scope.userLoggedIn = false;
    var loginWindow;

    $ionicLoading.show({
      template: 'Loading Wantlist...',
      noBackdrop: true
    });


    AuthService.testLoggedIn().then(function(isLoggedIn) {
      if (!isLoggedIn) {
        AuthService.showAuthPopup();
      } else {
        UserService.getWantlist().then(function(data) {
          $ionicLoading.hide();
          console.log('collection: ', data);
          $scope.collection = data.wants;
          $scope.pagination = data.pagination;
        });
      }

    });

  });