(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RecompensaListController', RecompensaListController);

    function RecompensaListController(ngDialog, Filter, TableHeader, Recompensa) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('gamification_recompensas', vm, {
            'gamification_recompensas.titulo': 'LIKE',
            'gamification_recompensas.valor': '>=',
            'gamification_recompensas.nivel': '>='
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('gamification_recompensas', vm);

        vm.load = function() {
            vm.loading = true;

            Recompensa.getList({
                fields:   ['gamification_recompensas.*'],
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
         * Abre o formulário de recompensas
         *
         * @return {void}
         */
        vm.openForm = function(recompensa) {
            ngDialog.open({
                template: 'views/gamification/recompensas/form.html',
                controller: 'RecompensaFormController',
                controllerAs: 'RecompensaForm',
                data: {
                    recompensa: recompensa || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };
    }

})();