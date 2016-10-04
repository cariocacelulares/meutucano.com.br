(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SugestaoListController', SugestaoListController);

    function SugestaoListController(Usuario, Sugestao, Filter, TableHeader, ngDialog) {
        var vm = this;

        vm.usuarios = {};

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('sugestoes', vm, {
            'sugestoes.created_at': 'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('sugestoes', vm);

        vm.loadUsuarios = function() {
            vm.loading = true;

            Usuario.getList().then(function(response) {
                vm.usuarios = response.data;
                vm.loading = false;
            });
        };

        vm.load = function() {
            vm.loading = true;

            Sugestao.getList({
                fields:   ['sugestoes.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading  = false;
                vm.loadUsuarios();
            });
        };

        vm.load();

        vm.parseStatusClass = function(status) {
            if (status == 1) {
                return 'success';
            } else if (status == 2) {
                return 'warning';
            }
        };

        /**
         * Abre o formulário da amrca
         *
         * @return {void}
         */
        vm.openForm = function(sugestao) {
            ngDialog.open({
                template: 'views/sugestoes/detalhe.html',
                controller: 'SugestaoDetalheController',
                controllerAs: 'SugestaoDetalhe',
                data: {
                    sugestao: sugestao || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };
    }
})();