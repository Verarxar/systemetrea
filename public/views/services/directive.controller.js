 (function(angular){
    angular
        .module('directiveModule',[])
        .directive('submitField', submitField)
        .directive('articleTabs', articleTabs)
        .directive('optionsTab', optionsTab)
        .directive('dateTab', dateTab);
        
        function submitField() {
            var directive = 
            {
                restrict: 'E',
                templateUrl: "./views/user/submit-field.html",
            };
            return directive;
        }
        
        function articleTabs() {
            var directive =  
                {
                  restrict: 'E',
                  controller: 'ArticleController',
                  controllerAs: 'artCtrl',
                  templateUrl: "./views/articles/article-tabs.html"
                };
            return directive;
        }
            
         function optionsTab() {
            var directive = 
                {
                  restrict: 'E',
                  templateUrl: "./views/user/options-tab.html",
                };
            return directive;
        }
        
        function dateTab() {
            var directive = 
                {
                  restrict: 'E',
                  templateUrl: "./views/articles/dateTabs/date-tabs.html",
                };
            return directive;
        }
        
}(this.angular));