(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AdicionarEstoqueController', AdicionarEstoqueController);

    function AdicionarEstoqueController($scope, toaster, ValidationErrors, ProductStock) {
        var vm = this;
        vm.validationErrors = [];

        vm.loading      = false;
        vm.sku          = $scope.ngDialogData.sku;
        vm.productStock = {
            stock_slug    : '',
            product_sku   : vm.sku,
            serial_enabled: true 
        };
        vm.stocks       = [];

        vm.load = function () {
            vm.loading = true;

            ProductStock.addOptions(vm.sku).then(function(response) {
                vm.stocks  = response;
                vm.loading = false;
            });
        };

        vm.load();

        /**
         * Save the product stock
         */
        vm.save = function() {
            ProductStock.save(vm.productStock).then(
                function (response) {
                    if (response) {
                        toaster.pop('success', '', 'Estoque adicionado com sucesso!');
                        $scope.closeThisDialog(true);
                    } else {
                        toaster.pop('error', '', 'Não foi possível adicionar o estoque!');
                    }
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
