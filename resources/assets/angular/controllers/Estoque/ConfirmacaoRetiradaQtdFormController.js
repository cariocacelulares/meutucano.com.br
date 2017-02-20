(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ConfirmacaoRetiradaQtdFormController', ConfirmacaoRetiradaQtdFormController);

    function ConfirmacaoRetiradaQtdFormController($scope, toaster, Produto) {
        var vm = this;

        vm.quantity = 1;
        vm.produto  = null;
        vm.produtos = [];

        /**
         * Busca pelo produto por sku e titulo
         *
         * @param  {string} term termo de Busca
         * @return {Object}      resultado da busca
         */
        vm.search = function(term) {
            if (term) {
                Produto.search(term).then(function(response) {
                    vm.produtos = response;
                });
            }
        };

        /**
         * Send imeis and get products
         */
        vm.save = function () {
            vm.produto.quantity = vm.quantity;

            $scope.closeThisDialog({
                produto: vm.produto
            });
        };
    }
})();
