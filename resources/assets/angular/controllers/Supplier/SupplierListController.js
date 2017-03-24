(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SupplierListController', SupplierListController);

    function SupplierListController(Supplier, Filter, TableHeader) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('suppliers', vm, {
            'suppliers.cnpj'       : 'LIKE',
            'suppliers.name'       : 'LIKE',
            'suppliers.created_at' : 'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('suppliers', vm);

        vm.load = function() {
            vm.loading = true;

            Supplier.getList({
                fields:   ['suppliers.*'],
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
