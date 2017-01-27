(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoDetalheController', ProdutoDetalheController);

    function ProdutoDetalheController($stateParams, PedidoHelper, Produto, ProductImei, PedidoProduto, InspecaoTecnica) {
        var vm = this;

        vm.pedidoProdutos    = {};
        vm.imeis             = {};
        vm.inspecoesTecnicas = {};
        vm.produto           = {
            sku : parseInt($stateParams.sku)
        };

        vm.pedidoHelper = PedidoHelper;

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(response) {
                vm.produto = response;
                vm.loading = false;

                PedidoProduto.listBySku(vm.produto.sku).then(function (response) {
                    vm.pedidoProdutos = response;
                });

                ProductImei.listBySku(vm.produto.sku).then(function (response) {
                    vm.imeis = response;
                });

                InspecaoTecnica.listBySku(vm.produto.sku).then(function (response) {
                    vm.inspecoesTecnicas = response;
                });
            });
        };

        vm.load();
    }
})();
