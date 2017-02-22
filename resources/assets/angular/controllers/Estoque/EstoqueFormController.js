(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EstoqueFormController', EstoqueFormController);

    function EstoqueFormController($state, $stateParams, toaster, ValidationErrors, Filter, TableHeader,
            ProductStock, Stock) {
        var vm = this;
        vm.validationErrors = [];

        vm.loading       = false;
        vm.productStocks = [];
        vm.stock         = {
            slug: $stateParams.slug || null
        };

        vm.load = function() {
            if (vm.stock.slug) {
                vm.loading = true;

                Stock.get(vm.stock.slug).then(function (stock) {
                    vm.stock   = stock;
                    vm.loading = false;

                    vm.loadProducts();
                });
            }
        };

        vm.load();

        /**
         * Salva o stock
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Stock.save(vm.stock, vm.stock.slug).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Estoque salvo com sucesso!');
                    $state.go('app.estoque.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Exclui o stock
         *
         * @return {void}
         */
        vm.destroy = function() {
            Stock.delete(vm.stock.slug).then(function() {
                toaster.pop('success', 'Sucesso!', 'Estoque excluido com sucesso!');
                $state.go('app.estoque.index');
            });
        };

        /**
         * Daqui pra baixo é em relação a listagem de estoque dos produtos
         */

         /**
          * Filtros
          * @type {Filter}
          */
         vm.filterList = Filter.init('stock_products', vm, {
             'produtos.sku'   : 'LIKE',
             'produtos.titulo': 'LIKE'
         });

         /**
          * Cabeçalho da tabela
          * @type {TableHeader}
          */
         vm.tableHeader = TableHeader.init('stock_products', vm);

         vm.loadProducts = function() {
             vm.loading = true;

             ProductStock.listBySlug(vm.stock.slug, {
                 fields:   ['product_stocks.*'],
                 filter:   vm.filterList.parse(),
                 page:     vm.tableHeader.pagination.page,
                 per_page: vm.tableHeader.pagination.per_page
             }).then(function(response) {
                 vm.tableData = response;
                 vm.loading   = false;
             });
         };
    }
})();
