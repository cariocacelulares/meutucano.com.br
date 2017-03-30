(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('PedidoProduto', PedidoProdutoModel);

        function PedidoProdutoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'pedido-produtos';

            angular.extend(rest, {
                /**
                 * Lista os pedido produtos pendentes associados ao sku
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                listBySku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/list/').customGET(sku);
                }
            });

            return rest;
        }
})();
