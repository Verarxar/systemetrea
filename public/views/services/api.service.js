(function(angular) {
    'use strict';
    angular
        .module('app')
        .factory('apiService', apiService);
        
    apiService.$inject = ['$http', 'urlservice'];
    
    function apiService($http, urlservice){
        var service = {
            getArticles: getArticles
        };
        return service;

        function getArticles(){
            return $http({
                url: '/articles/getArticles',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(getDataComplete)
              .catch(getDataFailed);
    
            function getDataComplete(response) {
                //console.log("Article data response: ", response.data);
                return response.data;
            }

            function getDataFailed(error) {
                console.log(error('JSON Failed for getArticles.' + error.data));
            }
        }

        
    }

}(this.angular));

