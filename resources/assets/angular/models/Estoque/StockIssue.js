(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('StockIssue', StockIssueModel);

        function StockIssueModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque/baixa';

            return rest;
        }
})();
