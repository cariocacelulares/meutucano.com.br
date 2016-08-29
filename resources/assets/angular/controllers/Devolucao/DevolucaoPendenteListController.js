(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DevolucaoPendenteListController', DevolucaoPendenteListController);

    function DevolucaoPendenteListController(Filter, TableHeader, Devolucao, ngDialog, toaster) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('devolucoes', vm, {
            'clientes.nome':                               'LIKE',
            'pedido_rastreios.rastreio':                   'LIKE',
            'pedido_rastreio_devolucoes.codigo_devolucao': 'LIKE',
            'pedidos.id':                                  'LIKE',
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('devolucoes', vm);

        /**
         * Load rastreios
         */
        vm.load = function() {
            vm.loading = true;

            Devolucao.pending({
                fields:   ['pedido_rastreio_devolucoes.*'],
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
         * Abre o formulário de Devolução
         *
         * @param  {Object} devolução
         * @return {void}
         */
        vm.openForm = function(devolucao) {
            ngDialog.open({
                template: 'views/devolucao/form.html',
                controller: 'DevolucaoFormController',
                controllerAs: 'DevolucaoForm',
                data: {
                    devolucao: devolucao || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };
    }
})();