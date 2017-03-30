(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DefeitoListController', DefeitoListController);

    function DefeitoListController(Filter, TableHeader, ProductDefect) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('product_defects', vm, {
            'produtos.sku'               : 'LIKE',
            'product_imeis.imei'         : 'LIKE',
            'description'                : 'LIKE',
            'product_defects.created_at' : 'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('product_defects', vm);

        vm.load = function() {
            vm.loading = true;

            ProductDefect.getList({
                fields:   ['product_defects.*'],
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
