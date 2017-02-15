(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueListController', RetiradaEstoqueListController);

    function RetiradaEstoqueListController(Filter, TableHeader, StockRemoval) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('stock_removal', vm, {
            'closed_at' : 'BETWEEN',
            'created_at': 'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('stock_removal', vm);

        vm.load = function() {
            vm.loading = true;

            StockRemoval.getList({
                fields:   ['stock_removals.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };

        vm.load();
    }

})();
