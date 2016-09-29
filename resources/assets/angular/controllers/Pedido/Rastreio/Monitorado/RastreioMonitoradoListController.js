(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RastreioMonitoradoListController', RastreioMonitoradoListController);

    function RastreioMonitoradoListController(Filter, TableHeader, RastreioHelper, Monitorado) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('rastreios_monitorados', vm, {
                'pedidos.codigo_marketplace':  'LIKE',
                'clientes.nome':                        'LIKE',
                'pedido_rastreios.rastreio':        'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('rastreios_monitorados', vm);

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        /**
         * Load rastreios
         */
        vm.load = function() {
            vm.loading = true;

            Monitorado.getList({
                fields:   ['pedido_rastreio_monitorados.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading = false;
            });
        };
        vm.load();
    }
})();