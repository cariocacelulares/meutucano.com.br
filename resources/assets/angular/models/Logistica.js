(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Logistica', LogisticaModel);

        function LogisticaModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'logisticas';

            return rest;
        }
})();
