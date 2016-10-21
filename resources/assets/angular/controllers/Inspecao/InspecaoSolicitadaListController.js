(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('InspecaoSolicitadaListController', InspecaoSolicitadaListController);

    function InspecaoSolicitadaListController(toaster, ngDialog, Filter, TableHeader, InspecaoTecnica) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('inspecao_tecnica_solicitada', vm, {
            'inspecao_tecnica.imei': 'LIKE',
            'inspecao_tecnica.created_at': 'BETWEEN',
            'pedidos.codigo_marketplace': 'LIKE',
            'produtos.titulo': 'LIKE',
            'tecnico_table.name': 'LIKE',
            'solicitante_table.name': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('inspecao_tecnica_solicitada', vm);

        vm.load = function() {
            vm.loading = true;

            InspecaoTecnica.solicitadas({
                fields: ['inspecao_tecnica.*'],
                filter: vm.filterList.parse(),
                page: vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };
        vm.load();

        /**
         * Abre o formulário
         *
         * @return {void}
         */
        vm.openForm = function(inspecao) {
            ngDialog.open({
                template: 'views/inspecao/solicitada/form.html',
                controller: 'InspecaoSolicitarFormController',
                controllerAs: 'InspecaoSolicitarForm'
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };

        /**
         * Exclui a inspecao
         *
         * @return {void}
         */
        vm.destroy = function(inspecao) {
            InspecaoTecnica.delete(inspecao.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Inspeção técnica excluida com sucesso!');
            });
        };
    }
})();