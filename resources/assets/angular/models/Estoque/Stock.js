(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Stock', StockModel);

        function StockModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque';

            return rest;
        }
})();
