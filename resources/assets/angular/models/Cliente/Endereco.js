(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Endereco', EnderecoModel);

        function EnderecoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'enderecos';

            return rest;
        }
})();
