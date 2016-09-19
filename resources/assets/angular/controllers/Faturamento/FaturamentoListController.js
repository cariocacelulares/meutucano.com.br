(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('FaturamentoListController', FaturamentoListController);

    function FaturamentoListController(toaster, Filter, Pedido, TableHeader, RastreioHelper, NotaHelper, PedidoHelper, ComentarioHelper) {
        var vm = this;

        /**
         * @type {Object}
         */
        vm.notaHelper = NotaHelper;

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.pedidoHelper = PedidoHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.comentarioHelper = ComentarioHelper;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('pedidos', vm, {
            'pedidos.codigo_marketplace': 'LIKE',
            'clientes.nome':                       'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('pedidos', vm);

        vm.load = function() {
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
         * Avisa que a chave foi copiada
         * @return {void}
         */
        vm.chaveCopiada = function() {
            toaster.pop('info', '', 'A chave da nota foi copiada para sua área de transferência!');
        };
    }
})();