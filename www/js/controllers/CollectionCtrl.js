'use strict';

angular.module('vinyl')

  .controller('CollectionCtrl', function($scope, $window, $ionicLoading, $ionicPopup, ArtistService, LabelService, UserService) {
    console.log('hi from CollectionCtrl');

    $scope.collection = [];
    $scope.userLoggedIn = false;

    // $ionicLoading.show({
    //   template: 'Loading Collection...',
    //   noBackdrop: true
    // });


    // AuthService.testLoggedIn().then(function(isLoggedIn) {
    //   if (!isLoggedIn) {
    //     AuthService.showAuthPopup();
    //   } else {
    //     UserService.getCollection().then(function(data) {
    //       $ionicLoading.hide();
    //       console.log('collection: ', data);
    //       $scope.collection = data.releases;
    //       $scope.pagination = data.pagination;
    //     });
    //   }

    // });

  });