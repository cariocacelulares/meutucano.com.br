(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('FaturamentoListController', FaturamentoListController);

    function FaturamentoListController(toaster, Filter, Pedido, TableHeader, RastreioHelper, NotaHelper, PedidoHelper, ComentarioHelper, $rootScope) {
        var vm = this;

        vm.tableData = [];

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
        vm.comentarioHelper = ComentarioHelper.init(vm);

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('faturamento', vm, {
            'pedidos.codigo_marketplace': 'LIKE',
            'clientes.nome':              'LIKE',
            'pedido_rastreios.rastreio':  'LIKE'
        });

        vm.roundFloat = function(number) {
            return parseFloat(parseFloat(number).toFixed(2));
        }

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('faturamento', vm);

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

        $rootScope.$on('upload', function() {
            vm.load();
        });

        /**
         * Avisa que a chave foi copiada
         * @return {void}
         */
        vm.chaveCopiada = function() {
            toaster.pop('info', '', 'A chave da nota foi copiada para sua área de transferência!');
        };
    }
})();
