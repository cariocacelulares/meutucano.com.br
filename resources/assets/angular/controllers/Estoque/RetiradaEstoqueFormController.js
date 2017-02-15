(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueFormController', RetiradaEstoqueFormController);

    function RetiradaEstoqueFormController($state, $stateParams, ngDialog, toaster, ValidationErrors,
            Usuario, StockRemoval) {
        var vm = this;

        vm.validationErrors = [];
        vm.users            = {};
        vm.registeredImeis  = [];
        vm.registeredSkus   = [];
        vm.stockRemoval     = {
            id      : parseInt($stateParams.id) || null,
            removal_products: {
                imei: [],
                sku : []
            }
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
                    vm.stockRemoval.user_id = vm.stockRemoval.user_id ? vm.stockRemoval.user_id + '' : null;

                    vm.loading      = false;
                });
            }
        };

        vm.load();

        /**
         * Add new products to stock removal by imeis
         */
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
                            vm.stockRemoval.removal_products.imei.push(data[key]);
                            vm.registeredImeis.push(data[key].imei);
                        }
                    }
                }
            });
        };

        /**
         * Add new products to stock removal by sku and qty
         */
        vm.addQty = function() {
            ngDialog.open({
                template: 'views/estoque/retirada/form-quantidade.html',
                controller: 'RetiradaEstoqueQtdFormController',
                controllerAs: 'RetiradaEstoqueQtdForm',
                closeByDocument: false
            }).closePromise.then(function(data) {
                if (data && typeof data.value.produto !== 'undefined') {
                    var produto = data.value.produto;

                    if (vm.registeredSkus.indexOf(produto.sku) < 0) {
                        if (produto.productStocks.length) {
                            for (var key in produto.productStocks) {
                                if (produto.productStocks[key].stock_slug == 'default') {
                                    produto.product_stock_id = produto.productStocks[key].id + '';
                                }
                            }
                        }

                        vm.stockRemoval.removal_products.sku.push(produto);
                        vm.registeredSkus.push(produto.sku);
                    } else {
                        var item = null;
                        for (var key in vm.stockRemoval.removal_products.sku) {
                            if (vm.stockRemoval.removal_products.sku[key].sku == produto.sku) {
                                vm.stockRemoval.removal_products.sku[key].quantity += produto.quantity;
                                break;
                            }
                        }
                    }
                }
            });
        };

        /**
         * Remove product from stock removal
         *
         * @param  {int} index
         * @param  {boolean} sku   if is in sku list
         * @return {void}
         */
        vm.removeProduct = function(index, sku) {
            if (sku === true) {
                delete vm.stockRemoval.removal_products.sku[index];
            } else {
                delete vm.stockRemoval.removal_products.imei[index];
            }
        };

        /**
         * Salva o stockRemoval
         *
         * @return {void}
         */
        vm.save = function() {
            StockRemoval.save(vm.stockRemoval, vm.stockRemoval.id).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Retirada de estoque salva com sucesso!');
                    $state.go('app.estoque.retirada.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        vm.confirm = function() {
            $state.go('app.estoque.retirada.index');
        };

        vm.close = function() {
            $state.go('app.estoque.retirada.index');
        };
    }
})();
