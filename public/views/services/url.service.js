(function(angular) {
    'use strict';
    angular
        .module('app')
        .service('urlservice', urlservice);

    function urlservice($http){
        var service = {
            generateLink: generateLink
        };
        return service;

        function generateLink(article){
            var link = "";
            var URL = "www.systembolaget.se";
            var searchquery = "/?searchquery=" + article.Varnummer;
            var subcategory = "";
            var bottletypegroup = "";
            var volymiml = article.Volymiml;
            switch(article.Varugrupp){
                case "Rött Vin": subcategory = "&subcategory=Rött"; break;
                case "Vitt vin": subcategory = "&subcategory=Vitt"; break;
                case "Öl": subcategory = "&subcategory=Öl"; break;
                case "Okryddad sprit": subcategory = "&subcategory=Öl"; break;
                case "Cider": subcategory = "&subcategory=Cider"; break;
                case "Cognac": subcategory = "&subcategory=Cognac"; break;
                case "Calvados": subcategory = "&subcategory=Calvados"; break;
                case "Kryddad sprit": subcategory = "&subcategory=Kryddad"; break;
                case "Whisky": subcategory = "&subcategory=Whisky"; break;
                case "Mousserande vin": subcategory = "&subcategory=Mousserande%20vin"; break;
                case "Smaksatt vin": subcategory = "&subcategory=Smaksatt%20vin"; break;
                case "Likör": subcategory = "&subcategory=Likör"; break;
                case "Aniskryddad sprit": subcategory = "&subcategory=Aniskryddad%20sprit"; break;
                case "Armagnac": subcategory = "&subcategory=Armagnac"; break;
                case "Portvin": subcategory = "&subcategory=Portvin"; break;
                case "Gin": subcategory = "&subcategory=Gin"; break;
                case "Smaksatt sprit": subcategory = "&subcategory=Smaksatt%20sprit"; break;
                case "Övrigt starkvin": subcategory = "&subcategory=Övrigt%20starkvin"; break;
                case "Vermouth": subcategory = "&subcategory=Vermouth"; break;
                case "Rosévin": subcategory = "&subcategory=Rosévin"; break;
                case "Aperitif": subcategory = "&subcategory=Aperitif"; break;
                case "Brandy och Vinsprit": subcategory = "&subcategory=Brandy%20och%20Vinsprit"; break;
                case "Punsch": subcategory = "&subcategory=Punsch"; break;
                case "Grappa och Marc": subcategory = "&subcategory=Grappa%20och%20Marc"; break;
                case "Sprit av frukt": subcategory = "&subcategory=Sprit%20av%20frukt"; break;
                case "Fruktvin": subcategory = "&subcategory=Fruktvin"; break;
                case "Bitter": subcategory = "&subcategory=Bitter"; break;
                case "Sake": subcategory = "&subcategory=Sake"; break;
                case "Rom": subcategory = "&subcategory=Rom"; break;
                case "Vin av flera typer": subcategory = "&subcategory=Vin%20av%20flera%20typer"; break;
                case "Tequila och Mezcal": subcategory = "&subcategory=Tequila%20och%20Mezcal"; break;
                case "Övrig sprit": subcategory = "&subcategory=Övrig%20sprit"; break;
                case "Sherry": subcategory = "&subcategory=Sherry"; break;
                case "Blanddrycker": subcategory = "&subcategory=Blanddrycker"; break;
                case "Alkoholfritt": subcategory = "&subcategory=Alkoholfritt"; break;
                case "Glögg och Glühwein": subcategory = "&subcategory=Glögg%20och%20Glühwein"; break;
                case "Madeira": subcategory = "&subcategory=Madeira"; break;
                case "Montilla": subcategory = "&subcategory=Montilla"; break;
                case "Drinkar och Cocktails": subcategory = "&subcategory=Drinkar%20och%20Cocktails"; break;
                case "Mjöd": subcategory = "&subcategory=Mjöd"; break;
                case "Genever": subcategory = "&subcategory=Genever"; break;
                case "Rosé": subcategory = "&subcategory=Rosé"; break;
                case "Vita": subcategory = "&subcategory=Vita"; break;
                case "Röda": subcategory = "&subcategory=Röda"; break;
            }
            switch(article.Forpackning){
                case "Flaska": {
                    
                    if(volymiml == 375){
                        bottletypegroup = "&bottletypegroup=Halvflaskor"; break;    
                    }if(volymiml == 750){
                        bottletypegroup = "&bottletypegroup=Helflaskor"; break;    
                    }else{
                        bottletypegroup = "&bottletypegroup=flaskor"; break;
                    }
                }
                case "Magnum": {
                    bottletypegroup = "&bottletypegroup=Flaskor%2CStörre%20flaskor"; break;
                }
                case "PET-flaska": {
                    bottletypegroup = "&bottletypegroup=Flaskor%2CPET-flaskor"; break;
                }
                case "Fat": {
                    bottletypegroup = "&bottletypegroup=Fat"; break;
                }
                case "Burk": {
                    bottletypegroup = "&bottletypegroup=Burkar"; break;
                } 
                case "Box": {
                    bottletypegroup = "&bottletypegroup=Boxar"; break;
                }
                case "Papp": {
                    bottletypegroup = "&bottletypegroup=Pappförpackningar"; break;
                }                   
            }
            link = URL + searchquery + subcategory + bottletypegroup;
            return link;
        }
    }
}(this.angular));

