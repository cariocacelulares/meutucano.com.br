(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AllnationProductListController', AllnationProductListController);

    function AllnationProductListController(Filter, TableHeader, AllnationProduct) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('allnation_products', vm, {
            'allnation_products.category': 'LIKE',
            'allnation_products.brand': 'LIKE',
            'allnation_products.ean': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('allnation_products', vm);

        vm.load = function() {
            vm.loading = true;

            AllnationProduct.getList({
                fields:   ['allnation_products.*'],
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