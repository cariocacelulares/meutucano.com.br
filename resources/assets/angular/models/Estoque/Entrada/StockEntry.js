(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('StockEntry', StockEntryModel);

        function StockEntryModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque/entrada';

            return rest;
        }
})();
