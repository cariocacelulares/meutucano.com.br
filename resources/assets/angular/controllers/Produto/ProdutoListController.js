(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoListController', ProdutoListController);

    function ProdutoListController(Filter, TableHeader, Produto) {
        var vm = this;

        /**
         * Filtros 
         * @type {Filter}
         */
        vm.filterList = Filter.init('produtos', vm, {
            'produtos.titulo' : 'LIKE',
            'produtos.estoque': 'BETWEEN',
            'produtos.valor'  : 'BETWEEN'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('produtos', vm);

        vm.load = function() {
            vm.loading = true;

            Produto.getList({
                fields:   ['produtos.*'],
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
