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

            var parsedFilter = vm.filterList.parse();
            for (var k in parsedFilter) {
                if (parsedFilter[k].value.indexOf(',') >= 0) {
                    parsedFilter[k].value = parsedFilter[k].value.split(',');
                    parsedFilter[k].operator = 'IN';
                }
            }

            Pedido.faturamento({
                filter:   parsedFilter,
                fields:   ['pedidos.*'],
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
