(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LinhaListController', LinhaListController);

    function LinhaListController(Linha, Filter, TableHeader) {
        var vm = this;  

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('linhas', vm, {
            'linhas.titulo': 'LIKE'
        });
 
        /**
         * Cabeçalho da tabela
         * @type {TableHeader} 
         */
        vm.tableHeader = TableHeader.init('linhas', vm);

        vm.load = function() {
            vm.loading = true; 
 
            Linha.getList({
                fields:   ['linhas.*'],
                orderBy:  'linhas.created_at',
                order:    'DESC',
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
         * Abre o formulário da linha
         * 
         * @return {void} 
         */
        /*vm.openForm = function(linha) {
            ngDialog.open({
                template: 'views/linha/form.html',
                controller: 'LinhaFormController',
                controllerAs: 'LinhaForm',
                data: {
                    linha: linha || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };*/
    }
})();