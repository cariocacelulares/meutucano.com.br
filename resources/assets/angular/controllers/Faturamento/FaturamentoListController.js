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
                var total = 0;
                vm.tableData = response;
                vm.tableData.data = [];
                for (var k in response.data) {
                    total = 0;
                    response.data[k].desconto = false;

                    for (var i in response.data[k].produtos) {
                        total =+ response.data[k].produtos[i].total * response.data[k].produtos[i].quantidade;
                    }

                    total = parseFloat(parseFloat(total).toFixed(2));
                    response.data[k].total = vm.roundFloat(response.data[k].total);
                    response.data[k].frete_valor = vm.roundFloat(response.data[k].frete_valor);

                    if (vm.roundFloat(response.data[k].total - response.data[k].frete_valor) != total) {
                        response.data[k].desconto = Math.round(100 - ((vm.roundFloat(response.data[k].total - response.data[k].frete_valor) * 100) / total));
                    }

                    vm.tableData.data.push(response.data[k]);
                }

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
