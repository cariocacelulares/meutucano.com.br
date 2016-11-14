(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Voto', VotoModel);

        function VotoModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'gamification/votos';

            return rest;
        }
})();
