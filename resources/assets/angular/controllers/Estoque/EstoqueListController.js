(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EstoqueListController', EstoqueListController);

    function EstoqueListController(Filter, TableHeader, Stock) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('stocks', vm, {
            'title': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('stocks', vm);

        vm.load = function() {
            vm.loading = true;

            Stock.getList({
                fields:   ['stocks.*'],
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
