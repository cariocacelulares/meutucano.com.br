(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ConquistaListController', ConquistaListController);

    function ConquistaListController(ngDialog, Filter, TableHeader, Conquista) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('conquistas', vm, {
            'gamification_conquistas.titulo': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('gamification_conquistas', vm);

        vm.load = function() {
            vm.loading = true;

            Conquista.getList({
                fields:   ['gamification_conquistas.*'],
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
         * Abre o formulário de conquistas
         *
         * @return {void}
         */
        vm.openForm = function(conquista) {
            ngDialog.open({
                template: 'views/gamification/conquistas/form.html',
                controller: 'ConquistaFormController',
                controllerAs: 'ConquistaForm',
                data: {
                    conquista: conquista || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };
    }

})();