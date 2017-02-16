(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueFormController', RetiradaEstoqueFormController);

    function RetiradaEstoqueFormController($state, $stateParams, ngDialog, toaster, ValidationErrors,
            Usuario, StockRemoval, StockRemovalProduct) {
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

                    var current = null;
                    if (typeof vm.stockRemoval.removal_products.imei != 'undefined') {
                        for (var key in vm.stockRemoval.removal_products.imei) {
                            current = vm.stockRemoval.removal_products.imei[key];

                            if (vm.registeredImeis.indexOf(current.imei) < 0) {
                                vm.registeredImeis.push(current.imei);
                            }
                        }
                    }

                    if (typeof vm.stockRemoval.removal_products.sku != 'undefined') {
                        for (var key in vm.stockRemoval.removal_products.sku) {
                            current = vm.stockRemoval.removal_products.sku[key];

                            if (vm.registeredSkus.indexOf(current.sku) < 0) {
                                vm.registeredSkus.push(current.sku);
                            }
                        }
                    }

                    vm.loading = false;
                });
            }
        };

        vm.load();

        /**
         * Add new products to stock removal by imeis
         */
        vm.addImeis = function(confirm) {
            ngDialog.open({
                template: 'views/estoque/retirada/form-imeis.html',
                controller: 'RetiradaEstoqueImeisFormController',
                controllerAs: 'RetiradaEstoqueImeisForm',
                closeByDocument: false,
                data: {
                    confirm: confirm
                }
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
        vm.addQty = function(confirm) {
            ngDialog.open({
                template: 'views/estoque/retirada/form-quantidade.html',
                controller: 'RetiradaEstoqueQtdFormController',
                controllerAs: 'RetiradaEstoqueQtdForm',
                closeByDocument: false,
                data: {
                    confirm: confirm
                }
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

        /**
         * Set removal product to returned
         *
         * @param  {int} index
         * @param  {boolean} sku   if is in sku list
         * @return {void}
         */
        vm.returnProduct = function(index, sku) {
            if (sku === true) {
                var id = vm.stockRemoval.removal_products.sku[index].id;
            } else {
                var id = vm.stockRemoval.removal_products.imei[index].id;
            }

            if (id) {
                vm.loading = true;
                var status = 3;
                StockRemovalProduct.changeStatus(id, status).then(function (removalProduct) {
                    vm.loading = false;

                    if (sku === true) {
                        vm.stockRemoval.removal_products.sku[index] = removalProduct;
                    } else {
                        vm.stockRemoval.removal_products.imei[index] = removalProduct;
                    }
                });
            }
        };

        /**
         * Returns a style status class
         *
         * @param  {int} status removal product status
         * @return {string}     color status class
         */
        vm.parseStatusClass = function(status) {
            switch (status) {
                case 0: return 'default'; // Retirado
                case 1: return 'info';    // Entregue
                case 2: return 'success'; // Enviado
                case 3: return 'danger';  // Devolvido
            }
        };
    }
})();
