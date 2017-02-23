(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EstoqueFormController', EstoqueFormController);

    function EstoqueFormController($state, $stateParams, toaster, ValidationErrors, Stock) {
        var vm = this;
        vm.validationErrors = [];

        vm.loading = false;
        vm.stock   = {
            slug: $stateParams.slug || null
        };

        vm.load = function() {
            if (vm.stock.slug) {
                vm.loading = true;

                Stock.get(vm.stock.slug).then(function (stock) {
                    vm.stock   = stock;
                    vm.loading = false;
                });
            }
        };

        vm.load();

        /**
         * Salva o stock
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Stock.save(vm.stock, vm.stock.slug).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Estoque salvo com sucesso!');
                    $state.go('app.estoque.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Exclui o stock
         *
         * @return {void}
         */
        vm.destroy = function() {
            Stock.delete(vm.stock.slug).then(function() {
                toaster.pop('success', 'Sucesso!', 'Estoque excluido com sucesso!');
                $state.go('app.estoque.index');
            });
        };
     }
})();
