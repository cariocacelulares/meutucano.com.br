(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('InspecaoTecnicaListController', InspecaoTecnicaListController);

    function InspecaoTecnicaListController(InspecaoTecnica, Filter, TableHeader, ngDialog) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('inspecao_tecnica', vm, {
            'inspecao_tecnica.imei':               'LIKE',
            'inspecao_tecnica.created_at':     'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('inspecao_tecnica', vm);

        vm.load = function() {
            vm.loading = true;

            InspecaoTecnica.getList({
                fields:   ['inspecao_tecnica.*'],
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
         * Abre o formulário da amrca
         *
         * @return {void}
         */
        vm.openForm = function(inspecao) {
            ngDialog.open({
                template: 'views/inspecao/form.html',
                controller: 'InspecaoTecnicaFormController',
                controllerAs: 'InspecaoTecnicaForm',
                data: {
                    inspecao: inspecao || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };
    }
})();