(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TrocaListController', TrocaListController);

    function TrocaListController(toaster, ngDialog, Filter, TableHeader, Troca) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('gamification_trocas', vm, {
            'gamification_trocas.titulo': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('gamification_trocas', vm);

        vm.load = function() {
            vm.loading = true;

            Troca.getList({
                fields:   ['gamification_trocas.*'],
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
         * Abre o formulário de trocas
         *
         * @return {void}
         */
        vm.openForm = function(troca) {
            ngDialog.open({
                template: 'views/gamification/trocas/form.html',
                controller: 'TrocaFormController',
                controllerAs: 'TrocaForm',
                data: {
                    troca: troca || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };

        vm.aprove = function(troca) {
            troca.status = 1;

            Troca.save(troca, troca.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Troca aprovada com sucesso!');
                vm.load();
            });
        };
    }

})();