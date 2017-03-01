(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoDetalheController', ProdutoDetalheController);

    function ProdutoDetalheController($stateParams, PedidoHelper, Produto, PedidoProduto, InspecaoTecnica, ProductStock) {
        var vm = this;

        vm.pedidoProdutos    = {};
        vm.inspecoesTecnicas = {};
        vm.productStocks     = {};
        vm.produto           = {
            sku : parseInt($stateParams.sku)
        };

        vm.pedidoHelper = PedidoHelper;

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(response) {
                vm.produto = response;
                vm.loading = false;

                ProductStock.listBySku(vm.produto.sku).then(function (response) {
                    vm.productStocks = response;
                });

                PedidoProduto.listBySku(vm.produto.sku).then(function (response) {
                    vm.pedidoProdutos = response;
                });

                InspecaoTecnica.listBySku(vm.produto.sku).then(function (response) {
                    vm.inspecoesTecnicas = response;
                });
            });
        };

        vm.load();
    }
})();
