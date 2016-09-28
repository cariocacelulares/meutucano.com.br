(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Senha', SenhaModel);

        function SenhaModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'senhas';

            angular.extend(rest, {

                /**
                 * Retorna senhas do usuário
                 *
                 * @param  {int}    id
                 * @param  {Object} params
                 * @return {Object}
                 */
                fromUser: function(params) {
                    return Restangular.one('senhas/minhas').customGET("", params || {});
                }
            });

            return rest;
        }
})();
