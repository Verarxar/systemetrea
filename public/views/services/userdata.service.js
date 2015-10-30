(function(angular) {
    'use strict';
    angular
        .module('app')
        .factory('userdataservice', userdataservice);
        
    userdataservice.$inject = [];
    
    function userdataservice(){
        var user = {
            "email": "",
            "maxPrice": "",
            "captcha": "",
            "percentage": ""
        };
        
        var service = {
            getUser: getUser,
            setUser: setUser,
            setCaptcha: setCaptcha,
            setEmail: setEmail
        };
        return service;
        
        function setUser(data){
            user.email = data.email;
            user.maxPrice = data.maxPrice;
            user.percentage = data.setPercentage;
            console.log("setUser: user in userdata.service: ", user);
        }
        
        function setEmail(email){
            user.email = email;    
            console.log("setEmail done, result: ", user.email);
        }
        
        function setCaptcha(boolean){
            user.captcha = boolean;    
        }
        
        function getUser(){
            return user;
        }
        
    }
}(this.angular));

