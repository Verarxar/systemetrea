(function(angular){
'use strict';

angular
    .module('app', ['ngRoute','ngMaterial','vcRecaptcha', 'directiveModule','ngAria', 'ngMessages','angular-loading-bar','underscore','angularMoment','ui.grid','ui.grid.resizeColumns'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('_', window._)
    // use in views, ng-repeat="x in _.range(3)"
    .run(function ($rootScope) {
     $rootScope._ = window._;
    });
}(this.angular));