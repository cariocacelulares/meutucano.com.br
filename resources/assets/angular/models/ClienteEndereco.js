(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ClienteEndereco', ClienteEnderecoModel);

        function ClienteEnderecoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'enderecos';

            return rest;
        }
})();
