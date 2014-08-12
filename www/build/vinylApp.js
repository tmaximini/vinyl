
angular.module('vinyl', ['ionic', 'ngResource', 'OmniAuth'])

  .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
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
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/collection');
  }])

  .run(["$ionicPlatform", function($ionicPlatform) {
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

  .controller('CollectionCtrl', ["$scope", "ArtistService", "LabelService", "OmniAuthService", function($scope, ArtistService, LabelService, OmniAuthService) {
    console.log('hi from CollectionCtrl');

    $scope.collection = [];

    LabelService.getReleases(1234).then(function(releases) {
      $scope.collection = releases;
    });

    $scope.onHold = function () {
      console.log('hold!');
    };


    OmniAuthService.requestToken('http://api.discogs.com/oauth/request_token', 'myKey', 'mySecret', 'http://localhost:8100/#/app/auth');

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
  .factory('LabelService', ["$q", "Label", function ($q, Label) {

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

  }]);

'use strict';


angular.module('OmniAuth', [])
  .service('OmniAuthService', ["$http", function($http) {

    var requestToken = function (endpoint, consumerKey, consumerSecret, callback) {

      var authHeader = 'OAuth oauth_consumer_key="' + consumerKey + '",' +
                       'oauth_nonce="' + Date.now() + '",' +
                       'oauth_signature="' + consumerSecret + '",' +
                       'oauth_signature_method="HMAC-SHA1",' +
                       'oauth_timestamp="' + Date.now() + '",' +
                       'oauth_callback="' + callback + '"';


      console.log(authHeader);

      return $http({
        method: 'GET',
        url: endpoint,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader
        }
      });

    };


    return {
      requestToken: requestToken
    };

  }]);