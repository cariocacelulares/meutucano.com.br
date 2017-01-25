(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Endereco', EnderecoModel);

        function EnderecoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'enderecos';

            angular.extend(rest, {
                /**
                 * Retorna os enderecos de um cliente
                 *
                 * @param  {Object} clientId id do cliente
                 * @return {Object}
                 */
                byClient: function(clientId) {
                    return Restangular.all(baseUrl + '/cliente/', clientId).customGET();
                }
            });

            return rest;
        }
})();
