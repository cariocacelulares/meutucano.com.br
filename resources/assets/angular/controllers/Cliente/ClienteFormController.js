(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ClienteFormController', ClienteFormController);

    function ClienteFormController($state, $stateParams, toaster, ValidationErrors, Cep, Cliente) {
        var vm = this;

        vm.validationErrors = [];
        vm.loading          = false;
        vm.cliente          = {
            id        : parseInt($stateParams.id) || null,
            enderecos : []
        };

        vm.addAddress = function() {
            vm.cliente.enderecos.push({
                cliente_id: vm.cliente.id || null
            });
        }

        vm.load = function() {
            if (vm.cliente.id) {
                Cliente.get(vm.cliente.id).then(function(response) {
                    vm.cliente = response;
                });

                Endereco.byClient(vm.cliente.id).then(function(response) {
                    vm.cliente.enderecos = response;

                    if (!vm.cliente.enderecos.length) {
                        vm.addAddress();
                    }
                });
            } else if (!vm.cliente.enderecos.length) {
                vm.addAddress();
            }
        }

        vm.load();

        vm.getAddress = function(addressIndex) {
            if (typeof vm.cliente.enderecos[addressIndex] !== 'undefined'
                && typeof vm.cliente.enderecos[addressIndex].cep !== 'undefined'
                && vm.cliente.enderecos[addressIndex].cep
            ) {
                Cep.getAddress(vm.cliente.enderecos[addressIndex].cep).then(function(response) {
                    vm.cliente.enderecos[addressIndex] = {
                        bairro      : response.bairro,
                        cidade      : response.cidade,
                        complemento : response.complemento,
                        numero      : response.numero,
                        rua         : response.rua,
                        uf          : response.uf
                    };
                });
            }
        }

        /**
         * Salva o cliente
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Cliente.save(vm.cliente, vm.cliente.id).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Cliente salvo com sucesso!');
                    $state.go('app.clientes.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Exclui o cliente
         *
         * @return {void}
         */
        vm.destroy = function() {
            Cliente.delete(vm.cliente.sku).then(function() {
                toaster.pop('success', 'Sucesso!', 'Cliente excluido com sucesso!');
                $state.go('app.clientes.index');
            });
        };
    }
})();
