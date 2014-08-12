'use strict';

angular.module('vinyl')
  .factory('LabelService', function ($q, Label) {

    var get = function(id) {
      return Label.get({ id: id }).$promise;
    };

    var getReleases = function(id, options) {

      var deferred = $q.defer();
      var ops = options || {};
      ops.perPage = ops.perPage || 25;
      ops.page = ops.page || 1;

      Label.releases({ id: id }).$promise.then(function(data) {
        deferred.resolve(data.releases);
      });

      return deferred.promise;
    };

    return {
      get: get,
      getReleases: getReleases
    };

  });
