(function(angular) {
    'use strict';
    
    angular
        .module('app')
        .controller('LoginController', LoginController);
        
    LoginController.$inject = ['dataservice','vcRecaptchaService', 'userdataservice', '$location'];

    function LoginController(dataservice, vcRecaptchaService, userdataservice, $location) { 
        var vm = this;
        var  post_data = {
            email: "",
            captcha: ""
        };

        vm.checkCaptcha = checkCaptcha;
        vm.selection = 'captcha';
        vm.noDB = false;
        function checkCaptcha(formValid){
            post_data['email'] = vm.email;
            if(!vm.response && vm.noDB){
                alert("HINT: CHECK THE BOX");
                vm.select = "captcha";
            }else if(!formValid){
                
            }else if(vm.response && formValid && !vm.noDB){
                //console.log("post data is: ", post_data);
                dataservice.checkCaptcha(angular.toJson(post_data))
                    .then(function(data){
                        //console.log("logging data that should be invalid-input-response ", data, " type of", typeof data, " and for the heck of it, data.body: ", data.body);
                        if(data == "invalid-input-response"){
                            vm.selection = 'captcha';
                        }else{
                            console.log("logging the response in login.controller from the checkCaptcha: ", data);
                            userdataservice.setCaptcha(true);
                            signIn();                            
                        }

//                        cbExpiration();
                    },
                    function(reason){
                        vm.response = null;
                        userdataservice.setCaptcha(false);
                        vm.noDB = true;
                        //console.log("in reason", reason);
                    })
                    .catch(function(err){
                        
                        console.log("in err", err);
                    });
            }
        }
        
        function signIn(){
            dataservice.getUser(post_data)
                .then(function(data){
                    //console.log(typeof data);
                    if(data){
                        
                        userdataservice.setUser(data);    

                    }else{
                        userdataservice.setEmail(post_data.email);
                    }
                    //console.log("logging data in login.ctrl .then after getUser call: ", userdataservice.getUser());
                    $location.url('/home');
                    cbExpiration();
                    
                },
                function(reason){
                    //console.log("in reason", reason);
                })
                .catch(function(err){
                    
                    console.log("in err", err);
                });
        }
        
        vm.response = null;
        vm.widgetId = null;
        vm.cbExpiration = cbExpiration;
        //vm.registerAPI = registerAPI;
        vm.cbExpiration = cbExpiration;
        vm.setResponse = setResponse;
        vm.setWidgetId = setWidgetId;
        vm.public = {
            key: '6LfqHQwTAAAAAMDwPHMQgKgRv07y8F9H-IspJjpe'
        };

        function setResponse (response) {
            //console.info('Response: ', response);
            vm.response = response;
            vm.selection = 'button';
            post_data = {
                captcha: vm.response
            };

        }
        
        function setWidgetId(widgetId) {
            //console.info('Created widget ID: %s', widgetId);
            vm.widgetId = widgetId;
        }
        
        function cbExpiration() {
            //console.info('Captcha expired. Resetting response object');
            vm.response = null;
            //vm.selection = 'captcha';
        }        
    }

}(this.angular));