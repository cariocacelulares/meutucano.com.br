(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Troca', TrocaModel);

        function TrocaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'gamification/trocas';

            return rest;
        }
})();
