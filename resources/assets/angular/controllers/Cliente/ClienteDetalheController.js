(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ClienteDetalheController', ClienteDetalheController);

    function ClienteDetalheController($stateParams, Cliente) {
        var vm = this;

        vm.cliente_id = $stateParams.id;
        vm.cliente    = {};
        vm.loading    = false;

        vm.load = function() {
            vm.cliente = {};
            vm.loading = true;

            Cliente.get(vm.cliente_id).then(function(cliente) {
                vm.cliente = cliente;
                vm.loading = false;
            });
        };

        vm.load();
    }
})();