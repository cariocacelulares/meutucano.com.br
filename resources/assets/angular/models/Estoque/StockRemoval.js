(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('StockRemoval', StockRemovalModel);

        function StockRemovalModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque/retirada';
 
            return rest;
        }
})();
