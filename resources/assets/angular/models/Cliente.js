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
                 * Retorna os rastreios importantes
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                detail: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('clientes/detail').customGET(params || {});
                }
            });

            return rest;
        }
})();
