'use strict';

angular.module('vinyl')
  .factory('Artist', function ($resource, $cacheFactory) {

    var cache = $cacheFactory('artistsCache');

    return $resource('/artists/:id/',
      {
        id: '@id'
      },
      {
        cache: cache
      });
  });