(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TarefaListController', TarefaListController);

    function TarefaListController(ngDialog, Filter, TableHeader, Tarefa) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('tarefas', vm, {
            'gamification_tarefas.titulo': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('gamification_tarefas', vm);

        vm.load = function() {
            vm.loading = true;

            Tarefa.getList({
                fields:   ['gamification_tarefas.*'],
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
         * Abre o formulário de tarefas
         *
         * @return {void}
         */
        vm.openForm = function(tarefa) {
            ngDialog.open({
                template: 'views/gamification/tarefas/form.html',
                controller: 'TarefaFormController',
                controllerAs: 'TarefaForm',
                data: {
                    tarefa: tarefa || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };
    }

})();