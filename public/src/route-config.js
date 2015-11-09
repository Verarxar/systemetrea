(function(angular){
'use strict';

angular
    .module('app')
    .config(config);
    
    config.$inject = ['$routeProvider'];
    
    function config($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: '/views/login/login.html',
                controller: 'LoginController', 
                controllerAs: 'vm',
            })
            .when('/home', {
                templateUrl: '/views/user/user.html',
                controller: 'UserController', 
                controllerAs: 'vm',
            });
    }
    
}(this.angular));
