(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Cliente', ClienteModel);

        function ClienteModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'clientes';

            angular.extend(rest, {
                /**
                 * Retorna o detalhe do cliente
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                detail: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('clientes/detail').customGET(params || {});
                },

                /**
                 * Altera o e-mail do cliente
                 *
                 * @param  {int} cliente_id
                 * @param  {string} email
                 * @return {Object}
                 */
                changeEmail: function(cliente_id, email) {
                    return Restangular.one('clientes/email/' + cliente_id).customPUT({ 'email': email });
                }
            });

            return rest;
        }
})();
