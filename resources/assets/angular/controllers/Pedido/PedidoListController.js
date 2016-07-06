(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoListController', PedidoListController);

    function PedidoListController($rootScope, Restangular, toaster) {
        var vm = this;

        vm.pedidos = [];
        vm.loading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });
 
        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Load notas
         */
        vm.load = function() {
            vm.pedidos = [];
            vm.loading = true;

            Restangular.all('pedidos').getList().then(function(pedidos) {
                vm.pedidos = pedidos;
                vm.loading = false;
            });
        };
        vm.load();
    }

})();