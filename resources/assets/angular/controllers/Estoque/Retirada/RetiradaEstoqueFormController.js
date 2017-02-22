(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueFormController', RetiradaEstoqueFormController);

    function RetiradaEstoqueFormController($state, $stateParams, ngDialog, toaster, ValidationErrors,
            Usuario, StockRemoval, StockRemovalProduct) {
        var vm = this;

        vm.validationErrors = [];

        vm.users        = {};
        vm.registered   = [];
        vm.stockRemoval = {
            id              : parseInt($stateParams.id) || null,
            removal_products: []
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

                    if (typeof vm.stockRemoval.removal_products != 'undefined') {
                        for (var key in vm.stockRemoval.removal_products) {
                            var current = vm.stockRemoval.removal_products[key];

                            if (vm.registered.indexOf(current.imei) < 0) {
                                vm.registered.push(current.imei);
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
        vm.add = function(confirm) {
            ngDialog.open({
                template       : 'views/estoque/retirada/adicionar.html',
                controller     : 'RetiradaEstoqueAddFormController',
                controllerAs   : 'RetiradaEstoqueAddForm',
                closeByDocument: false
            }).closePromise.then(function(data) {
                if (data && typeof data.value.products !== 'undefined') {
                    data = data.value.products;

                    for (var key in data) {
                        if (vm.registered.indexOf(data[key].imei) < 0) {
                            vm.stockRemoval.removal_products.push(data[key]);
                            vm.registered.push(data[key].imei);
                        }
                    }
                }
            });
        };

        /**
         * Confirm stock removal products by imei
         */
        vm.confirm = function() {
            ngDialog.open({
                template       : 'views/estoque/retirada/confirmar.html',
                controller     : 'RetiradaEstoqueConfirmFormController',
                controllerAs   : 'RetiradaEstoqueConfirmForm',
                closeByDocument: false,
                data: {
                    removal_id: vm.stockRemoval.id
                }
            }).closePromise.then(function(data) {
                if (data && typeof data.value.imeis !== 'undefined') {
                    data = data.value.imeis;

                    var toConfirm = [];
                    for (var key in data) {
                        var item = data[key];
                        if (item.ok && item.imei) {
                            var index = vm.registered.indexOf(data[key].imei);

                            if (index >= 0) {
                                item = vm.stockRemoval.removal_products[index];

                                if (typeof item !== 'undefined') {
                                    toConfirm.push(item.id);
                                }
                            }
                        }
                    }

                    StockRemovalProduct.confirm(toConfirm, vm.stockRemoval.id).then(function (data) {
                        if (typeof data.count !== 'undefined') {
                            if (data.count > 0) {
                                toaster.pop('success', data.count + ' itens confirmados!', '');
                                vm.load();
                            }
                        }
                    });
                }
            });
        };

        /**
         * Return stock removal products by imei
         */
        vm.return = function() {
            ngDialog.open({
                template       : 'views/estoque/retirada/retornar.html',
                controller     : 'RetiradaEstoqueReturnFormController',
                controllerAs   : 'RetiradaEstoqueReturnForm',
                closeByDocument: false,
                data: {
                    registered: vm.registered
                }
            }).closePromise.then(function(data) {
                if (data && typeof data.value.imeis !== 'undefined') {
                    data = data.value.imeis;

                    var toReturn = [];
                    for (var key in data) {
                        var item = data[key];
                        if (item.ok && item.imei) {
                            var index = vm.registered.indexOf(item.imei);

                            if (index >= 0) {
                                item = vm.stockRemoval.removal_products[index];

                                if (typeof item !== 'undefined') {
                                    toReturn.push(item.id);
                                }
                            }
                        }
                    }

                    StockRemovalProduct.return(toReturn, vm.stockRemoval.id).then(function (data) {
                        if (typeof data.count !== 'undefined') {
                            if (data.count > 0) {
                                toaster.pop('success', data.count + ' itens retornados!', '');
                                vm.load();
                            }
                        }
                    });
                }
            });
        };

        /**
         * Remove product from stock removal
         *
         * @param  {int} index
         * @return {void}
         */
        vm.removeProduct = function(index) {
            delete vm.stockRemoval.removal_products[index];
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

        /**
         * Closes the stock removal
         */
        vm.close = function() {
            StockRemoval.close(vm.stockRemoval.id).then(
                function (data) {
                    toaster.pop('success', '', 'Retirada fechada com sucesso!');
                    $state.go('app.estoque.retirada.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );

        };

        /**
         * Set removal product to returned
         *
         * @param  {int} index
         * @return {void}
         */
        vm.returnProduct = function(index) {
            var id = vm.stockRemoval.removal_products[index].id;

            if (id) {
                vm.loading = true;

                StockRemovalProduct.changeStatus(id, 3).then(function (removalProduct) {
                    vm.loading = false;
                    vm.stockRemoval.removal_products[index] = removalProduct;
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
