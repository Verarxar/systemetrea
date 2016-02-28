(function(angular) {
    'use strict';
    angular
        .module('app')
        .directive('argangTemplate', argangTemplate)
        .factory('articleservice', articleservice);
        
    articleservice.$inject = ['$http', 'urlservice','apiService','$q','uiGridConstants'];
    
    function articleservice($http, urlservice, apiService,$q,uiGridConstants){
        var initiated = false;
        var articles;
        
        var service = {
            getArticles: getArticles
        };
        return service;

        function getArticles(){
            if(initiated){
                var tmp = articles;
                return $q.when(tmp);
            }else{
                return apiService.getArticles().then(function(data){
                    var tmp = sortArticles(data);
                    articles = gridDefs(tmp);
                    console.log("final gridstructure", articles);
                    return $q.when(articles);
                });
            }
        }
        
        function sortArticles(article){
            var sortedList = {};
            var dateList = [];
            var orderedArray = [];
            var response;
            for(var i = 0; i < article.length; i++){
                var date = moment(article[i].Prishistorik[0].timestamp).format("YYYY-MM-DD");

                var item = {
                    "Namn": article[i].Namn,
                    "Namn2": article[i].Namn2,
                    "NyttPris": article[i].Prisinklmoms,
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
                item.URL = urlservice.generateLink(item);
        
                if(typeof sortedList[date] == "undefined"){
                    sortedList[date] = [];
                    sortedList[date][0] = item;
                    dateList.push(date.toString());
                    dateList.sort(sortCompare);

                }else{
                    sortedList[date][sortedList[date].length] = (item);
                }
            }
            for(var j = 0; j<dateList.length; j++){
                orderedArray.push(sortedList[dateList[j]]);
            }
            response = {
                dateArray: dateList,
                articles: orderedArray
            };
            /*
            for(var j = 0; j<dateList.length; j++){
                var tmp = {
                    date: dateList[j],
                    articles: sortedList[dateList[j]]
                };
                response.push(tmp);

            }            
            */
            console.log(response);
            initiated = true;
            return response;
        }
        function sortCompare(a, b) {
            if((moment(a).unix() < moment(b).unix())){

                return -1;
            }if((moment(a).unix() > moment(b).unix())){

                return 1;
            }else{

                return 0;
            }
            
        }        
        function gridDefs(data){

            var gridOptions = {
                 /*rowTemplate: '<div ng-click="grid.appScope.openLink( row.entity.URL )" ui-grid-cell></div>',*/
                enableColumnResizing: false,
                columnDefs: [
                    {
                        displayName: 'Namn',

                        field: 'namn',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity.Namn }} {{ row.entity.Namn2 }}</div>'
                    },
                    {
                        displayName: 'Årgång',

                        field: 'argang',
                        cellTemplate: "<argang-template></argang-template>"
                    },
                    {
                        displayName: 'Nytt pris',

                        field: 'NyttPris'
                    },
                    {
                        displayName: 'Tidigare pris',

                        field: 'GammaltPris',
                        cellTemplate: '<div class="ui-grid-cell-contents" hide-mg hide-lg flex><div id="sold-out-wrap" ng-show="article.Slut"><div class="sold-out"></div></div><div hide-mg hide-lg>{{ row.entity.GammaltPris }}</div></div>'
                    },
                    {
                        displayName: 'Land',

                        field: 'Ursprunglandnamn'
                    },
                    {
                        displayName: 'Varugrupp',

                        field: 'Varugrupp'
                    },
                    {
                        displayName: 'Varnummer',

                        field: 'Varnummer',
                        cellTemplate: '<div class="ui-grid-cell-contents" hide-mg hide-lg flex>{{ row.entity.Varnummer }}</div>'
                    },
                    {
                        displayName: 'Alkoholhalt',

                        field: 'Alkoholhalt',
                        cellTemplate: '<div class="ui-grid-cell-contents" hide-mg hide-lg flex>{{ row.entity.Alkoholhalt }}</div>'
                    },
                    {
                        displayName: 'Förpackning',

                        field: 'Förpackning',
                        cellTemplate: '<div class="ui-grid-cell-contents" hide-mg hide-lg flex>{{ row.entity.Forpackning }}</div>'
                    },
                    {
                        displayName: 'Prissänkt i procent',

                        field: 'PrissanktProcent',
                        sort: {
                            priority: 0,
                            direction: uiGridConstants.DESC,
                        },
                        cellTemplate: '<div class="ui-grid-cell-contents" flex style="color:red;">{{ row.entity.PrissanktProcent }}</div>'
                    },{
                        displayName: 'Länk',

                        field: 'URL',
                        cellTemplate: '<a href="" ng-click="grid.appScope.artCtrl.openLink( row.entity.URL )">Url</a>'
                    },{
                        displayName: 'Utgången',
                        field: 'Slut',
                        cellTemplate: "<div ng-show='row.entity.Slut'>Slut</div>"
                    }
                    
                ],
                data: data.articles[data.articles.length-1]
            };
            console.log("This is data.articles[data.articles.length-1]", data.articles[data.articles.length-1]);
            console.log("This is data.articles.length", data.articles.length);
            var uiGridStructure = {
                content: data,
                gridOptions: gridOptions
            };            
            
            return uiGridStructure;
        }
    

    
    }
        function argangTemplate() {
            var directive = 
            {
                restrict: 'EA',
                template: 
                "<div class='ui-grid-cell-contents'>"+
                        "<div class='ui-grid-cell-contents'>{{ row.entity.Argang }}</div>"+

                "</div>"
            };
            return directive;
        }
    
}(this.angular));

