'use strict';

angular.module('vinyl')

  .controller('CollectionCtrl', function($scope, $ionicLoading, ArtistService, LabelService, OmniAuthService) {
    console.log('hi from CollectionCtrl');

    $scope.collection = [];

    $ionicLoading.show({
        template: 'Loading Data...',
        noBackdrop: true
    });

    // Returns a random number between min (inclusive) and max (exclusive)
    function getRandomArbitrary(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }

    LabelService.getReleases(getRandomArbitrary(1, 9999)).then(function(releases) {
      $scope.collection = releases;
      $ionicLoading.hide();
    });

    $scope.onHold = function () {
      console.log('hold!');
    };


    OmniAuthService.requestToken('http://api.discogs.com/oauth/request_token', 'myKey', 'mySecret', 'http://localhost:8100/#/app/auth');




  });