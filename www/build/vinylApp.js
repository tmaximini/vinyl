
angular.module('vinyl', ['ionic', 'ngResource', 'satellizer'])

  .config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "$authProvider", function($stateProvider, $urlRouterProvider, $httpProvider, $authProvider) {

    $authProvider.oauth1({
      url: 'http://localhost:3000/auth/discogs',
      name: 'discogs',
      type: '1.0',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      popupOptions: { width: 495, height: 645 }
    });

    $httpProvider.defaults.withCredentials = true;

    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })
      .state('app.collection', {
        url: '/collection',
        views: {
          'menuContent': {
            templateUrl: 'templates/collection.html',
            controller: 'CollectionCtrl',
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl',
          }
        }
      })
      .state('app.wantlist', {
        url: '/wantlist',
        views: {
          'menuContent': {
            templateUrl: 'templates/wantlist.html',
            controller: 'WantlistCtrl',
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/collection');
  }])

  .run(["$ionicPlatform", "$rootScope", "$location", "$auth", function($ionicPlatform, $rootScope, $location, $auth) {

    console.log($auth, $auth.isAuthenticated);

    $rootScope.$on('$stateChangeStart', function($auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/login');
      }
    });

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }]);

'use strict';

angular.module('vinyl')
  .factory('ApiPathInterceptor', function() {

    var API_ENDPOINT = 'http://api.discogs.com';

    var _isExternal = function(request) {
      return request.url.indexOf('://') !== -1;
    };

    var _isView = function(request) {
      return request.url.indexOf('templates/') === 0 && request.url.indexOf('.html') === request.url.length - 5;
    };

    var _isConfig = function(request) {
      return request.url === 'config.json';
    };

    var _isLocalCall = function(request) {
      return request.config && request.config.localCall;
    };

    var _mustPrefixServerUrl = function(request) {
      return !(_isExternal(request) || _isView(request) || _isConfig(request) || _isLocalCall(request));
    };

    return {
      request: function(request) {
        if (_mustPrefixServerUrl(request)) {
          request.url = request.url[0] === '/' ? (API_ENDPOINT + request.url) : (API_ENDPOINT + '/' + request.url);
        }
        return request;
      }
    };
  })

  // push it
  .config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push('ApiPathInterceptor');
  }]);

'use strict';

angular.module('vinyl')

  .controller('AppCtrl', ["$scope", function($scope) {
    console.log('hi from AppCtrl');
  }]);
'use strict';

angular.module('vinyl')

  .controller('CollectionCtrl', ["$scope", "$window", "$ionicLoading", "$ionicPopup", "ArtistService", "LabelService", "UserService", function($scope, $window, $ionicLoading, $ionicPopup, ArtistService, LabelService, UserService) {
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

  }]);
'use strict';

angular.module('vinyl')
  .controller('LoginCtrl', ["$scope", "$auth", function($scope, $auth) {

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };

  }]);
'use strict';

angular.module('vinyl')

  .controller('WantlistCtrl', ["$scope", "$window", "$ionicLoading", "$ionicPopup", "ArtistService", "LabelService", "UserService", "AuthService", function($scope, $window, $ionicLoading, $ionicPopup, ArtistService, LabelService, UserService, AuthService) {
    console.log('hi from WantlistCtrl');

    $scope.collection = [];
    $scope.userLoggedIn = false;
    var loginWindow;

    $ionicLoading.show({
      template: 'Loading Wantlist...',
      noBackdrop: true
    });


    AuthService.testLoggedIn().then(function(isLoggedIn) {
      if (!isLoggedIn) {
        AuthService.showAuthPopup();
      } else {
        UserService.getWantlist().then(function(data) {
          $ionicLoading.hide();
          console.log('collection: ', data);
          $scope.collection = data.wants;
          $scope.pagination = data.pagination;
        });
      }

    });

  }]);
'use strict';

angular.module('vinyl')
  .factory('Artist', ["$resource", "$cacheFactory", function ($resource, $cacheFactory) {

    var cache = $cacheFactory('artistsCache');

    return $resource('/artists/:id/',
      {
        id: '@id'
      },
      {
        cache: cache
      });
  }]);
'use strict';

angular.module('vinyl')
  .factory('Label', ["$resource", "$cacheFactory", function ($resource, $cacheFactory) {
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
  }]);
'use strict';

angular.module('vinyl')
  .factory('Realease', ["$resource", "$cacheFactory", function ($resource, $cacheFactory) {

    var cache = $cacheFactory('releasesCache');

    return $resource('/releases/:id/',
      {
        id: '@id'
      },
      {
        cache: cache
      });
  }]);
'use strict';

angular.module('vinyl')
  .factory('ArtistService', ["$q", "Artist", function ($q, Artist) {

    var get = function(id) {
      return Artist.get({ id: id }).$promise;
    };

    return {
      get: get
    };

  }]);

'use strict';

angular.module('vinyl')
  .service('AuthService', ["$auth", function ($auth) {

    var isAuthenticated = function() {
      console.log($auth);
    };

    return {
      isAuthenticated: isAuthenticated
    };

  }]);
'use strict';

angular.module('vinyl')
  .factory('LabelService', ["$q", "Label", function ($q, Label) {

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

  }]);

'use strict';

angular.module('vinyl')
  .service('UserService', ["$q", "$window", "$http", function ($q, $window, $http) {

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


  }]);