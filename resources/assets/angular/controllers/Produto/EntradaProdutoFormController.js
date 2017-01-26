(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EntradaProdutoFormController', EntradaProdutoFormController);

    function EntradaProdutoFormController($scope, $stateParams, toaster, ValidationErrors, ProductStock) {
        var vm = this;

        vm.validationErrors = [];
        vm.productStock     = null;
        vm.productStocks    = [];

        vm.entrada = {
            sku        : parseInt($stateParams.sku),
            stock_slug : null,
            quantity   : null,
            imeis      : null
        };

        /**
         * Loads available product stock list
         */
        vm.load = function () {
            ProductStock.listBySku(vm.entrada.sku).then(function (response) {
                vm.productStocks = response;

                if (vm.productStocks.length > 0) {
                    vm.productStock       = vm.productStocks[0];
                    vm.entrada.stock_slug = vm.productStock.stock.slug;
                }
            });
        };

        vm.load();

        /**
         * Trigged on stock is selected
         */
        vm.changeStock = function () {
            vm.productStock = vm.productStocks.filter(function (productStock) {
                return productStock.stock_slug == vm.entrada.stock_slug;
            });

            if (vm.productStock.length > 0) {
                vm.productStock = vm.productStock[0];
            } else {
                vm.productStock = null;
            }
        };

        /**
         * Send entry data
         */
        vm.save = function () {
            vm.validationErrors = [];

            ProductStock.entry(vm.entrada).then(
                function (response) {
                    toaster.pop('success', 'Sucesso!', 'Entrada realizada com sucesso!');
                    $scope.closeThisDialog(true);
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
