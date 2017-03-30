(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ImeiListController', ImeiListController);

    function ImeiListController($stateParams, Filter, TableHeader, ProductImei, Stock) {
        var vm = this;

        vm.sku       = $stateParams.sku || null;
        vm.tableData = null;
        vm.loading   = false;
        vm.stocks    = [];

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('imeis', vm, {
            'imei': 'LIKE',
            'product_imeis.created_at': 'BETWEEN',
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('imeis', vm);

        vm.load = function() {
            vm.loading = true;

            if (vm.sku) {
                ProductImei.listBySku(vm.sku, {
                    fields:   ['imeis.*'],
                    filter:   vm.filterList.parse(),
                    page:     vm.tableHeader.pagination.page,
                    per_page: vm.tableHeader.pagination.per_page
                }).then(function(response) {
                    vm.tableData = response;
                    vm.loading   = false;
                });
            } else {
                vm.loading = false;
            }

            Stock.getList().then(function (data) {
                vm.stocks = data.data;
            });
        };

        vm.load();
    }

})();
