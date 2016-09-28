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
                fromUser: function(id, params) {
                    return Restangular.one('senhas', id || 0).customGET("", params || {});
                }
            });

            return rest;
        }
})();
