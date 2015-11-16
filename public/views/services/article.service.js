(function(angular) {
    'use strict';
    angular
        .module('app')
        .factory('articleservice', articleservice);
        
    articleservice.$inject = ['$http', 'urlservice'];
    
    function articleservice($http, urlservice){
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
                return sortArticles(response.data);
            }

            function getDataFailed(error) {
                console.log(error('JSON Failed for getArticles.' + error.data));
            }
        }
        
        function sortArticles(article){
            var sortedList = {};
            for(var i = 0; i < article.length; i++){
                var date = new Date(article[i].Prishistorik[0].timestamp).toDateString();

                var tmpList = {
                    "Namn": article[i].Namn,
                    "Namn2": article[i].Namn2,
                    "NyPris": article[i].Prisinklmoms,
                    "GammaltPris": article[i].Prishistorik[1].pris,
                    "Ursprunglandnamn": article[i].Ursprunglandnamn,
                    "Varnummer": article[i].Varnummer,
                    "Varugrupp": article[i].Varugrupp,
                    "Alkoholhalt": article[i].Alkoholhalt,
                    "PrissanktDatum": date,
                    "PrissanktProcent": article[i].PrissanktProcent,
                    "Forpackning": article[i].Forpackning,
                    "Volymiml": article[i].Volymiml,
                    "Argang": article[i].Argang,
                    "Slut": article[i].Slut,
                    "URL": ""
                };
                tmpList.URL = urlservice.generateLink(tmpList);
        
                if(typeof sortedList[date] == "undefined"){
                    sortedList[date] = [];
                    sortedList[date][0] = tmpList;
                    
                }else{
                    sortedList[date][sortedList[date].length] = (tmpList);
                }
            }
            return sortedList;
        }
        

            
            
        
        
    }

}(this.angular));

