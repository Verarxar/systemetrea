(function(angular) {
    'use strict';
    angular
        .module('app')
        .factory('dataservice', dataservice);
        
    dataservice.$inject = ['$http'];
    
    function dataservice($http){
        var service = {
            addUser: addUser,
            getUser: getUser,
            checkCaptcha: checkCaptcha
        };
        return service;

        function addUser(email, value, setPercentage) {
                return $http.post("/api/addUser", JSON.stringify({ email: email, value: value, setPercentage: setPercentage}))
                .then(addUserComplete)
                .catch(addUserFailed);
    
            function addUserComplete(response) {
                console.log("addUser response: ", response.data);
                return response.data;
            }
    
            function addUserFailed(error) {
                console.log(error('JSON Failed for addUser.' + error.data));
            }
        }
        
        function getUser(post_data){
            console.log("loggign user in data.service, getUser: ", post_data);
            return $http({
                url: '/api/getUser/'+post_data.email,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(getUserComplete)
              .catch(getUserFailed);

            function getUserComplete(response) {
                console.log("getUserComplete.service response: ", response);
                
                return response.data;
            }

            function getUserFailed(error) {
                console.log(error('getUserFailed.service Failed: ' + error.data));
            }
        }

        function checkCaptcha(post_data){
            return $http({
                url: '/api/register',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: post_data
            }).then(checkCaptchaComplete)
              .catch(checkCaptchaFailed);

            function checkCaptchaComplete(response) {
                console.log("checkCaptchaComplete: ", response.data);
                return response.data;
            }
    
            function checkCaptchaFailed(error) {
                console.log(error('checkCaptchaFailed.service Failed: ' + error.data));
                return error.data;
            }
            
        }
        
    }

}(this.angular));

