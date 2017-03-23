(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TemplateListController', TemplateListController);

    function TemplateListController(Filter, TableHeader, Template) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('mercadolivre.templates', vm, {
            'mercadolivre_templates.title' : 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('mercadolivre.templates', vm);

        vm.load = function() {
            vm.loading = true;

            Template.getList({
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };

        vm.load();
    }
})();
