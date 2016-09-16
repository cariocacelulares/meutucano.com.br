(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Pedido', PedidoModel);

        function PedidoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'pedidos';

            angular.extend(rest, {
                /**
                 * Retorna os pedidos prontos para serem faturados
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                faturamento: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('pedidos/faturamento').customGET("", params || {});
                }
            });

            return rest;
        }
})();
