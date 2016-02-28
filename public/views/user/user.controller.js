(function(angular) {
    'use strict';
    
    angular
        .module('app')
        .controller('UserController', UserController)
        .config(['$mdThemingProvider', function($mdThemingProvider){
            // Configure a dark theme with primary foreground yellow
            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('deep-orange')
                .dark();
        }]);
        
    UserController.$inject = ['dataservice', '$window', '$scope', 'userdataservice','$location'];

    function UserController(dataservice, $window, $scope, userdataservice, $location) {
        var vm = this;
        /* FOR TESTING, USE THIS
        vm.forTesting = {
            "email": "mt@aabbcc.xx",
            "percentage": 25,
            "maxPrice": 500
        };
        vm.shutDown = false;
        vm.selectedIndex = 1;
        oldUser(vm.forTesting);
        vm.userFound = true;
        */
        /* FOR REAL PRODUCTION BUSINESS, USE THIS
        vm.user = userdataservice.getUser();

        $scope.$watch('vm.user', function(current, original){
            console.log("vm.user: ", vm.user);
            console.log("current: ", current, " current.captcha: ", current.captcha);
            if(current.captcha == null || current.captcha == ""){
                vm.shutDown = true;
                $location.url('/');
            }else{
                if(current.maxPrice != "" && (typeof current.maxPrice != "undefined")){
                    vm.shutDown = false;
                    vm.userFound = true;
                    vm.selectedIndex = 1;
                    oldUser(vm.user);
                    generateNumbers();
                }else{
                    vm.shutDown = false;
                    vm.selectedIndex = 0;
                    newUser(vm.user);
                    generateNumbers();
                }   
            }
        });
         */////////////  %%%%¤¤¤¤¤¤¤¤¤##############¤¤¤¤¤¤¤¤¤%%%%%%%%%%%%%
        vm.user = userdataservice.getUser();
        vm.scannedDate = getLastDate();
        //Date format library
        vm.forTesting = {
            "email": "mt@aabbcc.xx",
            "percentage": 25,
            "maxPrice": 500
        };
        vm.shutDown = false;
        vm.selectedIndex = 1;
        oldUser(vm.forTesting);
        vm.userFound = true;
        //Function declarations
        vm.checkMax = checkMax;
        vm.decreaseMax = decreaseMax;
        vm.increaseMax = increaseMax;
        vm.refreshPage = refreshPage;
        vm.resetForm = resetForm;
        vm.formValidation = formValidation;
        vm.savedCheck = savedCheck;
        
        //Variable initialization
        vm.topCap = 1000;
        vm.maxPrice = 500;
        vm.percentage = 20;
        vm.message = "";
        vm.percentageList = [];
        
        //Validation initialization
        vm.decreaseBlock = false;
        vm.error = false;
        vm.increaseBlock = false;
        vm.serverPinging = false;
        vm.serverPinged = false;
        vm.userSaved = false;

        
        function checkMax(){
            if(vm.topCap> 25000){
                vm.increaseBlock = true;
                vm.topCap = 25000;
            }else{
                vm.increaseBlock = false;
            }
            if(vm.topCap< 20){
                vm.decreaseBlock = true;
            }else{
                vm.decreaseBlock = false;
            }
        }
        function decreaseMax(){
            vm.topCap = Math.ceil(vm.topCap/= 2);
            vm.maxPrice = Math.ceil(vm.maxPrice /=2);
            checkMax();
        }
        function increaseMax(){
            vm.topCap*= 2;
            checkMax();
        }
        
        function formValidation(){
            if(vm.percentage >4 && vm.percentage < 76){
                vm.serverPinging = true;
                addUser();
                vm.error = false;
                
            }else{
                vm.message = "The set percentage must be a number between (and including...) 5 and 75";
                vm.error = true;
            }
        }
        function resetForm(form){
            console.log("in else");
            vm.topCap= 1000;
            vm.maxPrice = 500;
            vm.percentage = 20;
        }
        
        function refreshPage(){
            $window.location.reload(true);
        }
        
        function logContent(){
            console.log("content of vm.data: " + vm.data);
        }
        

        function addUser(){
            vm.serverPinging = true;
            console.log("email to factory is:", vm.email);
            dataservice.addUser(vm.email, vm.maxPrice, vm.percentage)
                .then(function(data){
                    vm.userFound = true;
                    vm.serverPinged = false;
                    vm.userSaved = true;
                    vm.selected = 1;
                    vm.serverPinging = false;
                    vm.selectedIndex = 1;
   

//                    console.log("console loggin' dat return: ", data, data.email);
                },
                function(reason){
                    console.log(reason);
                    vm.message = "unable to save user. Reload the page or something."
                })
                .catch(function(err){
                    console.log(err);
                    vm.message = "Some sort of error happened, noone knows why but it looks like this: ", err;
                });
        }
        
        function oldUser(user){
            vm.maxPrice = user.maxPrice;
            vm.percentage = user.percentage;   
            vm.email = user.email;
            while(vm.maxPrice > vm.maxPrice){
                vm.increaseMax();
            }
            
        }
        
        function newUser(user){
            vm.topCap = 1000;
            vm.percentage = 20;
            vm.maxPrice = 500;
            vm.email = user.email;
        }
        
        function generateNumbers(){
            for(var i = 5; i <76; i++){
                vm.percentageList.push(i);
            }
        }
        
        function savedCheck(){
            vm.userSaved = false;
        }
        
        function getLastDate(){
            dataservice.getLastDate()
                .then(function(data){
                    vm.scannedDate = data;
                },
                function(reason){
                    console.log(reason);
                    vm.message = "unable to fetch date. Reload the page or something.";
                })
                .catch(function(err){
                    console.log(err);
                    vm.message = "Some sort of error happened, noone knows why but it looks like this: ", err;
                });
        }        
    } 

}(this.angular));