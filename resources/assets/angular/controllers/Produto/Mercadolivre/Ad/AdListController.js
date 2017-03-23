(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AdListController', AdListController);

    function AdListController(Filter, TableHeader, Ad) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('mercadolivre', vm, {
            'produtos.sku' : 'LIKE',
            'produtos.titulo' : 'LIKE'
        });

        /** 
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('mercadolivre', vm);

        vm.load = function() {
            vm.loading = true;

            Ad.groupedByProduct({
                fields:   ['produtos.*'],
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
