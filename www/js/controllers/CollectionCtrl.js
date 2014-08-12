'use strict';

angular.module('vinyl')

  .controller('CollectionCtrl', function($scope, ArtistService, LabelService, OmniAuthService) {
    console.log('hi from CollectionCtrl');

    $scope.collection = [];

    LabelService.getReleases(1234).then(function(releases) {
      $scope.collection = releases;
    });

    $scope.onHold = function () {
      console.log('hold!');
    };


    OmniAuthService.requestToken('http://api.discogs.com/oauth/request_token', 'myKey', 'mySecret', 'http://localhost:8100/#/app/auth');

  });