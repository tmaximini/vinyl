'use strict';

angular.module('vinyl')
  .factory('ArtistService', function ($q, Artist) {

    var get = function(id) {
      return Artist.get({ id: id }).$promise;
    };

    return {
      get: get
    };

  });
