(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoFormController', ProdutoFormController);

    function ProdutoFormController($stateParams, Produto, toaster, TabsHelper, Linha, Marca, Atributo) {
        var vm = this;

        vm.produto = {
            sku: $stateParams.sku || null,
            unidade: 'un',
            ativo: '1'
        };

        vm.tabsHelper = TabsHelper;
        vm.linhas = {};
        vm.marcas = {};
        vm.atributos = {};

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(produto) {
                vm.produto = produto;

                if (!vm.produto.unidade)
                    vm.produto.unidade = 'un';

                if (vm.produto.ativo === null)
                    vm.produto.ativo = '1';

                if (vm.produto.linha_id)
                    vm.loadAtributos();

                vm.loading = false;
            });
        };

        vm.loadMarcas = function() {
            vm.loading = true;

            Marca.getList().then(function(marcas) {
                vm.marcas = marcas;
                vm.loading = false;
            });
        };

        vm.loadLinhas = function() {
            vm.loading = true;

            Linha.getList().then(function(linhas) {
                vm.linhas = linhas;
                vm.loading = false;
            });
        };

        vm.loadAtributos = function() {
            vm.loading = true;

            Atributo.fromLinha(vm.produto.linha_id).then(function(atributos) {
                vm.atributos = atributos;
                vm.loading = false;
            });
        };

        if (vm.produto.sku)
            vm.load();

        if (vm.produto.linha_id)
            vm.loadAtributos();

        vm.loadMarcas();
        vm.loadLinhas();

        vm.linhaChange = function() {
            vm.produto.linha_id = vm.produto.linha.id;
            vm.loadAtributos();
        };

        /**
         * Salva o produto
         *
         * @return {void}
         */
        vm.save = function() {
            Produto.save(vm.produto, vm.produto.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto salvo com sucesso!');
            });
        };

        /**
         * Exclui o produto
         *
         * @return {void}
         */
        vm.destroy = function() {
            Produto.delete(vm.produto.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto excluido com sucesso!');
            });
        };
    }
})();