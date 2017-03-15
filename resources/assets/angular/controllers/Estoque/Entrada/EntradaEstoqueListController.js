(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EntradaEstoqueListController', EntradaEstoqueListController);

    function EntradaEstoqueListController(Filter, TableHeader, StockEntry) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('stock_entry', vm, {
            'stock_entry_invoices.key'   : 'LIKE',
            'stock_entry_invoices.number': 'LIKE',
            'suppliers.name'             : 'LIKE',
            'stock_entries.created_at'   : 'BETWEEN',
            'stock_entries.confirmed_at' : 'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('stock_entry', vm);

        vm.load = function() {
            vm.loading = true;

            StockEntry.getList({
                fields:   ['stock_entries.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };

        vm.load();

        vm.destroy = function(entry) {
            StockEntry.delete(entry.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Entrada excluida com sucesso!');
                vm.load();
            });
        };
    }

})();
