(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ClienteFormController', ClienteFormController);

    function ClienteFormController($stateParams, Cliente) {
        var vm = this;

        vm.enderecos = [];
        vm.loading   = false;
        vm.cliente   = {
            id : parseInt($stateParams.id) || null,
        };

        vm.addAddress = function() {
            vm.enderecos.push({
                cliente_id: vm.cliente.id || null
            });
        }

        vm.load = function() {
            if (vm.cliente.id) {
                Cliente.get(vm.cliente.id).then(function(response) {
                    vm.cliente = response;
                });

                Endereco.byClient(vm.cliente.id).then(function(response) {
                    vm.enderecos = response;

                    if (!vm.enderecos.length) {
                        vm.addAddress();
                    }
                });
            } else if (!vm.enderecos.length) {
                vm.addAddress();
            }
        }

        vm.load();
    }
})();
