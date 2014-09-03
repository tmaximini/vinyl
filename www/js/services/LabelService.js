'use strict';

angular.module('vinyl')
  .factory('LabelService', function ($q, Label) {

    var get = function(id) {
      return Label.get({ id: id }).$promise;
    };

    var getReleases = function(id, options) {

      var deferred = $q.defer();
      var ops = options || {};
      ops.perPage = ops.perPage || 100;
      ops.page = ops.page || 1;

      Label.releases({ id: id }).$promise.then(function(data) {
        deferred.resolve(data.releases);
      });

      return deferred.promise;
    };


    var getRandomLabel = function() {
      // Returns a random number between min (inclusive) and max (exclusive)
      var getRandomArbitrary = function(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }
      return this.getReleases(getRandomArbitrary(0, 9999));
    };

    return {
      get: get,
      getReleases: getReleases,
      getRandomLabel: getRandomLabel
    };

  });
