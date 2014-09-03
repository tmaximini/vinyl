'use strict';

angular.module('vinyl')
  .service('UserService', function ($q, $window, $http) {

    var collection, wantlist;

    var BASE_URL = 'http://localhost:3000/me/'


    var fetch = function(col) {
      return $http({ medthod: 'GET', url: BASE_URL + col })
                .success(function(data) {
                  if (col === 'collection') {
                    collection = data;
                  }
                  if (col === 'wantlist') {
                    wantlist = data;
                  }
                })
                .error(function(error) {
                  // redirect to auth
                });
    };

    var getCollection = function() {
      var defer = $q.defer();
      if (collection) {
        defer.resolve(collection);
      }
      else {
        this.fetch('collection').then(function() {
          defer.resolve(collection);
        });
      }
      return defer.promise;
    };


    var getWantlist = function() {
      var defer = $q.defer();
      if (wantlist) {
        defer.resolve(wantlist);
      }
      else {
        this.fetch('wantlist').then(function() {
          defer.resolve(wantlist);
        });
      }
      return defer.promise;
    };

    return {
      getCollection: getCollection,
      getWantlist: getWantlist,
      fetch: fetch
    }


  });