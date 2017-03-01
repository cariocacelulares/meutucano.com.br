(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('StockIssue', StockIssueModel);

        function StockIssueModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque/baixa';

            angular.extend(rest, {
                /**
                 * Decrease stock quantity and save issue details
                 * 
                 * @param  {Object} issue
                 * @return {Object}
                 */
                save: function(issue) {
                    return Restangular.one(this.baseUrl).customPOST(issue);
                }
            });

            return rest;
        }
})();
