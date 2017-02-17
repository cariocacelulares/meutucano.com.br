(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueQtdFormController', RetiradaEstoqueQtdFormController);

    function RetiradaEstoqueQtdFormController($scope, toaster, Produto) {
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
            if (vm.produto.estoque < vm.quantity) {
                toaster.pop(
                    'error',
                    'Quantidade insuficiente!',
                    'Você está tentando retirar ' +
                    vm.quantity + ' unidades, mas existem ' +
                    'apenas ' + vm.produto.estoque + ' em estoque!'
                );
            } else {
                Produto.getStocks(vm.produto.sku).then(function (response) {
                    response.produto.quantity = vm.quantity;

                    toaster.pop('success', 'Sucesso!', 'O produto foi adicionado!');
                    $scope.closeThisDialog(response);
                });
            }
        };
    }
})();
