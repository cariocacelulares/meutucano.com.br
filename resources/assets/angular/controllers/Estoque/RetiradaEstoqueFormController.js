(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueFormController', RetiradaEstoqueFormController);

    function RetiradaEstoqueFormController($stateParams, ngDialog, toaster, ValidationErrors,
            Usuario, StockRemoval) {
        var vm = this;

        vm.users           = {};
        vm.registeredImeis  = [];
        vm.stockRemoval    = {
            id      : parseInt($stateParams.id) || null,
            products: []
        };

        vm.load = function() {
            vm.loading = true;

            Usuario.getList().then(function(response) {
                vm.users   = response;
                vm.loading = false;
            });


            if (vm.stockRemoval.id) {
                vm.loading = true;

                StockRemoval.get(vm.stockRemoval.id).then(function(stockRemoval) {
                    vm.stockRemoval = stockRemoval;
                    vm.loading      = false;
                });
            } else {
                vm.stockRemoval.created_at = new Date();
            }

            vm.stockRemoval.closed_at = 'Em aberto';
        };

        vm.load();

        vm.addImeis = function() {
            ngDialog.open({
                template: 'views/estoque/retirada/form-imeis.html',
                controller: 'RetiradaEstoqueImeisFormController',
                controllerAs: 'RetiradaEstoqueImeisForm',
                closeByDocument: false
            }).closePromise.then(function(data) {
                if (data && typeof data.value.products !== 'undefined') {
                    data = data.value.products;

                    for (var key in data) {
                        if (vm.registeredImeis.indexOf(data[key].imei) < 0) {
                            vm.stockRemoval.products.push(data[key]);
                            vm.registeredImeis.push(data[key].imei);
                        }
                    }
                }
            });
        };

        vm.addQty = function() {
            ngDialog.open({
                template: 'views/estoque/retirada/form-quantidade.html',
                controller: 'RetiradaEstoqueQtdFormController',
                controllerAs: 'RetiradaEstoqueQtdForm',
                closeByDocument: false
            }).closePromise.then(function(data) {
                if (data && typeof data.value.products !== 'undefined') {
                    // #TODO: quando tentar adicionar um produto que já, existe, soma qtd
                    data = data.value.products;

                    for (var key in data) {
                        vm.stockRemoval.products.push(data[key]);
                    }
                }
            });
        };

        vm.removeProduct = function(index) {
            delete vm.stockRemoval.products[index];
        };

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
