(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AdListController', AdListController);

    function AdListController(Filter, TableHeader, Ad, toaster, MercadolivreAuth) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('mercadolivre', vm, {
            'produtos.sku' : 'LIKE',
            'produtos.titulo' : 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('mercadolivre', vm);

        vm.load = function() {
            vm.loading = true;

            Ad.groupedByProduct({
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

        MercadolivreAuth.authUrl().then(function(response) {
            vm.authUrl = response.url;
        });

        vm.publish = function(id) {
            Ad.publish(id).then(function(response) {
                toaster.pop('success', 'Sucesso!', 'Anúncio publicado com sucesso!');
                vm.load();
            });
        }

        vm.pause = function(id) {
            Ad.pause(id).then(function(response) {
                toaster.pop('success', 'Sucesso!', 'Anúncio pausado com sucesso!');
                vm.load();
            });
        }

        vm.activate = function(id) {
            Ad.activate(id).then(function(response) {
                toaster.pop('success', 'Sucesso!', 'Anúncio ativado com sucesso!');
                vm.load();
            });
        }

        vm.manualSync = function(sku, code) {
            Ad.manualSync(sku, code).then(function(response) {
                toaster.pop('success', 'Sucesso!', 'Anúncio sincronizado com sucesso!');
                vm.load();
            });
        }
    }
})();
