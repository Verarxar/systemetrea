(function(angular) {
    'use strict';
    
    angular
        .module('app')
        .controller('ArticleController', ArticleController);


        
    ArticleController.$inject = ['articleservice', '$timeout','$window','$scope','_','moment'];

    function ArticleController(articleservice, $timeout, $window, $scope, _,moment) {
        var vm = this;
        vm.openLink = openLink;
        vm.articleList = {};
        
        articleservice.getArticles()
            .then(function(data){
                vm.dateArray = pushToDateArray(data);
                vm.sortedList = data;
                checkshit(vm.sortedList, vm.dateArray);
                
            },
            function(reason){
                console.log(reason);
            })
            .catch(function(err){
                console.log(err);
            });
            
        function openLink(article){
            console.log("link");
            var redirectWindow = window.open("http://" + article.URL, '_blank');
            redirectWindow.location;
        }
        //Tue May 27 2014 06:56:06
        //"Sat Sep 26 2015 00:00:00"
        function pushToDateArray(obj){
            var dataTable = [];
            var tmpArr = [];
            for(var i in obj){
                var date = new Date(i).toString();
                tmpArr.push(date);
            }
            for(var i = 0; i<tmpArr.length; i++){
                dataTable[i] = new Array(0);
                dataTable[i].push(tmpArr[i]);

            }
            
            dataTable.sort(function (a, b) {
                return new Date(a[0]).getTime() - new Date(b[0]).getTime();
            });
            var tmpsize = tmpArr.length;
            tmpArr = [];
            for(var i = 0; i<tmpsize; i++){
                tmpArr[i] = new Date(dataTable[i][0]).toDateString();
            }
            console.log(obj[tmpArr[0]]);
            return tmpArr;
        }
        

        function checkshit(value, key){
            for(var i = 0; i<key.length; i++){
                vm.articleList[key[i]] = value[key[i]];
            }
        }
       
    }
    
    
    
    
    ////////////////////// TAB FIX  //////////////////////
    /*
    function MdTabsFixDirective() {
      return {
        restrict: 'A',
        require: 'mdTabs',
        link: link
      };
    
      function link($scope, $element, $attrs, mdTabsCtrl) {
        $scope.$watch(function() {
          return $element.clientWidth;
        }, function(newWidth, oldWidth) {
          mdTabsCtrl.maxTabWidth = newWidth;
        });
      }
    }*/
}(this.angular));



