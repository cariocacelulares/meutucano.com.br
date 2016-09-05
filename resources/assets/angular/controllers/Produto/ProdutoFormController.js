(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoFormController', ProdutoFormController);

    function ProdutoFormController($state, $stateParams, Produto, toaster, TabsHelper, Linha, Marca, Atributo) {
        var vm = this;
        var original = {
            linha_id: null,
            attrs: null
        };

        vm.produto = {
            sku: $stateParams.sku || null,
            unidade: 'un',
            ativo: '1'
        };

        vm.tabsHelper = TabsHelper;
        vm.linhas = {};
        vm.marcas = {};

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(produto) {
                vm.produto = produto;

                if (!vm.produto.unidade)
                    vm.produto.unidade = 'un';

                if (vm.produto.ativo === null)
                    vm.produto.ativo = '1';

                if (vm.produto.linha_id)
                    original.linha_id = vm.produto.linha_id;

                if (vm.produto.linha_id && vm.produto.atributos) {
                    original.attrs = vm.produto.atributos;
                }

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

        vm.loadMarcas = function() {
            vm.loading = true;

            Marca.getList().then(function(marcas) {
                vm.marcas = marcas;
                vm.loading = false;
            });
        };

        vm.loadAtributos = function() {
            vm.loading = true;

            if (vm.produto.linha_id == original.linha_id && original.attrs !== null) {
                vm.produto.atributos = original.attrs;
            } else {
                Atributo.fromLinha(vm.produto.linha_id).then(function(atributos) {
                    vm.produto.atributos = atributos;
                    vm.loading = false;
                });
            }
        };

        if (vm.produto.sku)
            vm.load();

        if (vm.produto.linha_id)
            vm.loadAtributos();

        vm.loadLinhas();
        vm.loadMarcas();

        /*
         * Recarrega as linhas ao alterar
         */
        vm.linhaChange = function() {
            vm.produto.linha_id = vm.produto.linha.id;
            vm.loadAtributos();
        };

        /*
         * Retona um novo SKU para o produto
         */
        vm.generateSku = function() {
            Produto.generateSku(vm.produto).then(function(product) {
                vm.produto.sku = product.sku;
                $state.go('app.produtos.form', {sku: product.sku}, {notify: false});

                toaster.pop('success', 'Sucesso!', 'Um novo SKU foi gerado para este produto!');
            });
        };

        /**
         * Salva o produto
         *
         * @return {void}
         */
        vm.save = function() {
            Produto.save(vm.produto, vm.produto.sku || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto salvo com sucesso!');
                $state.go('app.produtos.index');
            });
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
    }
})();