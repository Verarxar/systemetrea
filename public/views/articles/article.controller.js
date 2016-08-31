(function(angular) {
    'use strict';
    
    angular
        .module('app')
        .controller('ArticleController', ArticleController);
        

        
    ArticleController.$inject = ['articleservice', '$timeout','$window','$scope','_','moment'];

    function ArticleController(articleservice, $timeout, $window, $scope, _,moment) {
        var artCtrl = this;
        artCtrl.openLink = openLink;
        artCtrl.swapData = swapData;
        artCtrl.gridOptions = {};
        artCtrl.dateArray = [];
        
        articleservice.getArticles()
            .then(function(data){
                //artCtrl.list = data;
                artCtrl.dates = data.content.dateArray;
                artCtrl.articles = {};
                for(var i = 0; i<data.content.articles.length; i++){
                    artCtrl.articles[artCtrl.dates[i]] = [];
                    artCtrl.articles[artCtrl.dates[i]].push(data.content.articles[i]);
                }
                //artCtrl.articles = data.content.articles;
                artCtrl.selected = artCtrl.dates[artCtrl.dates.length-1];
                artCtrl.gridOptions = data.gridOptions;
                artCtrl.content = data.content.articles;
                artCtrl.dateArray = data.content.dateArray;
                artCtrl.selectedDate = data.content.dateArray[data.content.dateArray.length-1];
                console.log(artCtrl.gridOptions);
                return artCtrl.gridOptions;
                //console.log("artCtrl.gridOptions", artCtrl.list);
                //return artCtrl.list;

            })
            .catch(function(err){
                console.log(err);
            });

        function openLink(article){
            console.log("link: ", article);
            var redirectWindow = window.open("http://" + article, '_blank');
            redirectWindow.location;
        }
        
        function swapData(date) {
            console.log("printing page: ", date);
            artCtrl.selectedDate = date;
            artCtrl.gridOptions.data = artCtrl.articles[date][0];
        };

    }
        
        

    
}(this.angular));



