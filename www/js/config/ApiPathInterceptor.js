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
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('ApiPathInterceptor');
  });
