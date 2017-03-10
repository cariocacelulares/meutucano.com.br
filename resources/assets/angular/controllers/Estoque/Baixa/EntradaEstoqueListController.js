(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EntradaEstoqueListController', EntradaEstoqueListController);

    function EntradaEstoqueListController(toaster, Filter, TableHeader, Usuario, StockIssue) {
        var vm = this;

        vm.users = {};

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('stock_issue', vm, {
            'product_imeis.imei' : 'LIKE',
            'created_at'        : 'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('stock_issue', vm);

        vm.load = function() {
            vm.loading = true;

            Usuario.getList().then(function(response) {
                vm.users = response.data;
            });

            StockIssue.getList({
                fields:   ['stock_issues.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };

        vm.load();

        vm.destroy = function(issue) {
            StockIssue.delete(issue.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Baixa excluida com sucesso!');
                vm.load();
            });
        };
    }

})();
