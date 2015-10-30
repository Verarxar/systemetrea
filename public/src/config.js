(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }]);

    app.config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
          .primaryPalette('blue')
          .accentPalette('indigo')
          .warnPalette('red')
          .backgroundPalette('grey', {
              'default' : '50',
            'hue-1'   : '100',
            'hue-2'   : '200',
            'hue-3'   : '300'
          });
          

    $mdThemingProvider.theme('custom')
          .primaryPalette('grey')
          .accentPalette('deep-purple')
          .warnPalette('green');

    $mdThemingProvider.theme('dark')
          .dark();

    }]);
    


})(this.angular);