
angular.module('vinyl', ['ionic', 'ngResource', 'satellizer'])

  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $authProvider) {

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
  })

  .run(function($ionicPlatform, $rootScope, $location, $auth) {

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
  });
