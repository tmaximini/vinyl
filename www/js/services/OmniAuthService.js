'use strict';


angular.module('OmniAuth', [])
  .service('OmniAuthService', function($http) {

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

  });