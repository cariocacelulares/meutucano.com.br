(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ClienteFormController', ClienteFormController);

    function ClienteFormController($stateParams, Cep, Cliente) {
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

        vm.getAddress = function(addressIndex) {
            if (typeof vm.enderecos[addressIndex] !== 'undefined'
                && typeof vm.enderecos[addressIndex].cep !== 'undefined'
                && vm.enderecos[addressIndex].cep
            ) {
                Cep.getAddress(vm.enderecos[addressIndex].cep).then(function(response) {
                    vm.enderecos[addressIndex] = {
                        bairro      : response.bairro,
                        cep         : response.cep || vm.enderecos[addressIndex].cep,
                        cidade      : response.cidade,
                        complemento : response.complemento,
                        numero      : response.numero,
                        rua         : response.rua,
                        uf          : response.uf
                    };
                });
            }
        }
    }
})();
