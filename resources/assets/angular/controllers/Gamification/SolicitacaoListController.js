(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SolicitacaoListController', SolicitacaoListController);

    function SolicitacaoListController(toaster, Filter, TableHeader, Solicitacao) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('gamification_solicitacoes', vm, {
            'usuarios.name': 'LIKE',
            'gamification_tarefas.titulo': 'LIKE',
            'gamification_solicitacoes.descricao': 'LIKE',
            'gamification_solicitacoes.status': '='
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('gamification_solicitacoes', vm);

        vm.load = function() {
            vm.loading = true;

            Solicitacao.getList({
                fields:   ['gamification_solicitacoes.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };
        vm.load();

        vm.aprove = function(solicitacao) {
            solicitacao.status = '1';

            Solicitacao.save(solicitacao, solicitacao.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Solicitação aprovada com sucesso!');
                vm.load();
            });
        };

        vm.reject = function(solicitacao) {
            solicitacao.status = '0';

            Solicitacao.save(solicitacao, solicitacao.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Solicitação aprovada com sucesso!');
                vm.load();
            });
        };
    }

})();