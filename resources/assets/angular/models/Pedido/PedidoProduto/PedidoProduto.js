(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('PedidoProduto', PedidoProdutoModel);

        function PedidoProdutoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'pedido-produto';

            return rest;
        }
})();
