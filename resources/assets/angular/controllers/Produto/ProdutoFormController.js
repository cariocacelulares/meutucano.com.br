(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoFormController', ProdutoFormController);

    function ProdutoFormController($state, $stateParams, ngDialog, toaster,
        ValidationErrors, Produto, Linha, Marca, ProductStock) {
        var vm = this;

        vm.editedSku = parseInt($stateParams.sku) || null;
        vm.produto   = {
            sku    : vm.editedSku,
            estado : '0'
        };

        vm.linhas = {};
        vm.marcas = {};

        vm.validationErrors = [];
        vm.productStocks    = [];

        vm.loadProductStocks = function() {
            ProductStock.listBySku(vm.produto.sku).then(function (response) {
                vm.productStocks = response;
            });
        };

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(produto) {
                vm.produto = produto;
                vm.loading = false;

                vm.loadProductStocks();
            });
        };

        if (vm.produto.sku) {
            vm.load();
        }

        vm.loadLinhas = function() {
            Linha.all().then(function(linhas) {
                vm.linhas = linhas;
            });
        }();

        vm.loadMarcas = function() {
            Marca.all().then(function(marcas) {
                vm.marcas = marcas;
            });
        }();

        /**
         * Salva o produto
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Produto.save(Object.assign({}, vm.produto, { originalSku : vm.editedSku }), vm.editedSku).then(
                function() {
                    ProductStock.refresh(vm.productStocks).then(function(response) {
                        toaster.pop('success', 'Sucesso!', 'Produto salvo com sucesso!');
                        $state.go('app.produtos.index');
                    });
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Exclui o produto
         *
         * @return {void}
         */
        vm.destroy = function() {
            Produto.delete(vm.produto.sku).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto excluido com sucesso!');
                $state.go('app.produtos.index');
            });
        };

        /**
         * Open transfer modal
         *
         * @param  {object} productStock
         */
        vm.transfer = function(productStock) {
            ngDialog.open({
                template       : 'views/estoque/transferir.html',
                controller     : 'TransferirEstoqueController',
                controllerAs   : 'TransferirEstoque',
                closeByDocument: false,
                data: {
                    productStock: productStock
                }
            }).closePromise.then(function(data) {
                vm.loadProductStocks();
            });
        };

        /**
         * Open add product stock modal
         */
        vm.addProductStock = function() {
            ngDialog.open({
                template       : 'views/estoque/adicionar-estoque.html',
                controller     : 'AdicionarEstoqueController',
                controllerAs   : 'AdicionarEstoque',
                closeByDocument: false,
                data: {
                    sku: vm.produto.sku
                }
            }).closePromise.then(function(data) {
                vm.loadProductStocks();
            });
        };
    }
})();
