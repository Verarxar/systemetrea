(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }]);


    


})(this.angular);