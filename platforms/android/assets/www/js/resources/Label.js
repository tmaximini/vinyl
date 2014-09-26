'use strict';

angular.module('vinyl')
  .factory('Label', function ($resource, $cacheFactory) {
    var cache = $cacheFactory('labelsCache');
    return $resource('/labels/:id/',
      {
        id: '@id'
      },
      {
        releases: {
          method: 'GET',
          url: '/labels/:id/releases',
          cache: cache,
          params: {
            page: 1,
            pageSize: 50
          }
        }
      });
  });