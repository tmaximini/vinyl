'use strict';

angular.module('vinyl')
  .factory('Realease', function ($resource, $cacheFactory) {

    var cache = $cacheFactory('releasesCache');

    return $resource('/releases/:id/',
      {
        id: '@id'
      },
      {
        cache: cache
      });
  });