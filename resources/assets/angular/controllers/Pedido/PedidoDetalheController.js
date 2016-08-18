(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoDetalheController', PedidoDetalheController);

    function PedidoDetalheController($rootScope, $stateParams, Restangular) {
        var vm = this;
 
        vm.pedido = [];
        vm.loading = false;
        vm.pedido_id = $stateParams.id;

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
         * Load pedido
         */
        vm.load = function() {
            vm.pedido = []; 
            vm.loading = true;

            Restangular.one('pedidos', vm.pedido_id).get().then(function(pedido) {
                vm.pedido = pedido;
                vm.loading = false;
            });
        };
        vm.load();
    }

})();