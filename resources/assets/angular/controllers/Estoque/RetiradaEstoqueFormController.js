(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueFormController', RetiradaEstoqueFormController);

    function RetiradaEstoqueFormController($stateParams, ValidationErrors, StockRemoval) {
        var vm = this;

        vm.stockRemoval = {
            id: parseInt($stateParams.id) || null,
        };

        vm.load = function() {
            vm.loading = true;

            StockRemoval.get(vm.stockRemoval.id).then(function(stockRemoval) {
                vm.stockRemoval = stockRemoval;
                vm.loading      = false;
            });
        };

        if (vm.stockRemoval.sku)
            vm.load();

        /**
         * Salva o stockRemoval
         *
         * @return {void}
         */
        vm.save = function() {
            StockRemoval.save(vm.stockRemoval, vm.stockRemoval.id).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Retirada salva com sucesso!');

                    ProductStock.refresh(vm.productStocks).then(function (response) {
                        $state.go('app.estoque.retirada.index');
                    });
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
