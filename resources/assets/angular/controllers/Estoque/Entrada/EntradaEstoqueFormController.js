(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EntradaEstoqueFormController', EntradaEstoqueFormController);

    function EntradaEstoqueFormController($state, envService, toaster,
            ValidationErrors, Upload, Cep, SelectProductHelper, ProductStock, StockEntry) {
        var vm = this;

        vm.validationErrors = [];
        vm.searchAddress    = true;
        vm.originalProducts = [];

        vm.taxes    = false;
        vm.modified = false;
        vm.loading  = false;
        vm.entry    = {
            supplier: {},
            invoice : {},
            products: []
        };

        vm.selectProductHelper = SelectProductHelper;

        /**
         * Set stock prop when product stock changed
         *
         * @param  {Object} product
         * @return {void}
         */
        vm.stockChanged = function(product) {
            for (var key in product.stocks) {
                if (product.stocks[key].id == product.product_stock_id) {
                    product.stock = product.stocks[key];

                    break;
                }
            }
        }

        /**
         * Add new empty product to the list
         */
        vm.addProduct = function() {
            vm.entry.products.push([]);
        }

        /**
         * Open modal to select a product
         * @param {[type]} product [description]
         */
        vm.setProduct = function(product) {
            vm.selectProductHelper.open().then(function(data) {
                var produto = data.value;

                if (produto && typeof produto.sku != 'undefined' && produto.sku) {
                    product.product = produto;
                    product.product_sku = produto.sku;

                    if (product.title == '' || !product.title) {
                        product.title = produto.titulo;
                    }

                    ProductStock.listBySku(product.product_sku).then(function(stocks) {
                        product.stocks = stocks;
                    });
                }
            });
        }

        /**
         * Show/hide taxes from products table
         */
        vm.toggleTaxes = function() {
            vm.taxes = !vm.taxes;
        }

        /**
         * If not set, search supplier by cnpj
         */
        vm.cnpjChanged = function() {
            if ((typeof vm.entry.supplier.id == 'undefined' || !vm.entry.supplier) && vm.entry.supplier.cnpj.length === 14) {
                Supplier.search(vm.entry.supplier.cnpj).then(function(supplier) {
                    vm.entry.supplier = supplier;
                });
            }
        }

        /**
         * If can, search address by cep
         */
        vm.cepChanged = function() {
            if (vm.searchAddress && vm.entry.supplier.cep.length === 8) {
                Cep.getAddress(vm.entry.supplier.cep).then(function(address) {
                    vm.entry.supplier.neighborhood = address.bairro;
                    vm.entry.supplier.cep          = address.cep;
                    vm.entry.supplier.city         = address.cidade;
                    vm.entry.supplier.complement   = address.complemento;
                    vm.entry.supplier.number       = address.numero;
                    vm.entry.supplier.street       = address.rua;
                    vm.entry.supplier.uf           = address.uf;
                    vm.entry.supplier.country      = 'Brasil';
                });
            }
        }

        /**
         * Upload entry invoice
         * @param  {array} files
         */
        vm.upload = function(files) {
            if (files.length && typeof files[0] !== 'undefined') {
                var file = files[0];
            } else {
                toaster.pop('error', 'Arquivo inválido!', 'Não foi possível importar o arquivo');
                return;
            }

            if (file) {
                vm.loading = true;

                Upload.upload({
                    url: envService.read('apiUrl') + '/estoque/entrada/nota/upload',
                    headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                    data: {
                        file: file
                    }
                }).success(function(response) {
                    vm.loading = false;

                    if (!response.error) {
                        vm.entry.invoice  = response.object.invoice || null;
                        vm.entry.products = response.object.products || null;
                        vm.entry.supplier = response.object.supplier || null;

                        vm.originalProducts = angular.copy(vm.entry.products) || null;
                        vm.modified         = false;
                        vm.searchAddress    = false;
                    }
                }).error(function() {
                    toaster.pop('error', 'Erro no upload!', 'Erro ao enviar arquivos, tente novamente!');
                });
            }
        };

        /**
         * Check if description is needded and saves
         */
        vm.save = function() {
            vm.modified = !angular.equals(vm.entry.products, vm.originalProducts);

            if (vm.modified && (typeof vm.entry.description == 'undefined' || !vm.entry.description.length)) {
                return;
            }

            vm.validationErrors = [];

            StockEntry.save(vm.entry).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Entrada salva com sucesso!');
                    $state.go('app.estoque.entrada.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
