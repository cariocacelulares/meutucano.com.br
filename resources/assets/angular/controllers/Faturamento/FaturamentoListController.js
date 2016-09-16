(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('FaturamentoListController', FaturamentoListController);

    function FaturamentoListController(Pedido, Filter, TableHeader) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('pedidos', vm, {
            'pedidos.codigo_marketplace': 'LIKE',
            'clientes.nome':              'LIKE',
            'pedidos.total':              'BETWEEN',
            'pedidos.created_at':         'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('pedidos', vm);

        vm.load = function(teste) {
            vm.loading = true;

            Pedido.faturamento({
                fields:   ['pedidos.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };
        vm.load();

        /**
         * Retorna a classe de status do pedido
         *
         * @param  {Pedido} pedido
         * @return {string}
         */
        vm.parseStatusClass = function(pedido) {
            switch (pedido.status) {
                case '1':
                case '2':
                    return 'info';
                case '3':
                    return 'success';
                case '4':
                case '5':
                    return 'danger';
            }
        };
    }

})();