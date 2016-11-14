(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Sugestao', SugestaoModel);

        function SugestaoModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'sugestoes';

            return rest;
        }
})();
