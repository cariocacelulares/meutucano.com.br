(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('InspecaoFilaListController', InspecaoFilaListController);

    function InspecaoFilaListController(InspecaoTecnica, Filter, TableHeader, ngDialog) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('inspecao_tecnica_fila', vm, {
            'inspecao_tecnica.imei': 'LIKE',
            'inspecao_tecnica.created_at': 'BETWEEN',
            'pedidos.codigo_marketplace': 'LIKE',
            'produtos.titulo': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('inspecao_tecnica_fila', vm);

        vm.load = function() {
            vm.loading = true;

            InspecaoTecnica.fila({
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