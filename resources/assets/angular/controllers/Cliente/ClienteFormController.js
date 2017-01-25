(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ClienteFormController', ClienteFormController);

    function ClienteFormController($state, $stateParams, toaster, ValidationErrors, Cep, Endereco, Cliente) {
        var vm = this;

        vm.validationErrors = [];
        vm.loading          = false;
        vm.cliente          = {
            id        : parseInt($stateParams.id) || null,
            enderecos : []
        };

        /**
         * Add a empty address
         */
        vm.addAddress = function() {
            vm.cliente.enderecos.push({
                cliente_id: vm.cliente.id || null
            });
        }

        /**
         * On form loads
         */
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

        /**
         * Get and fill address by cep
         * @param  {int} addressIndex
         */
        vm.getAddress = function(addressIndex) {
            if (typeof vm.cliente.enderecos[addressIndex] !== 'undefined'
                && typeof vm.cliente.enderecos[addressIndex].cep !== 'undefined'
                && vm.cliente.enderecos[addressIndex].cep
            ) {
                Cep.getAddress(vm.cliente.enderecos[addressIndex].cep).then(function(response) {
                    vm.cliente.enderecos[addressIndex].bairro      = response.bairro;
                    vm.cliente.enderecos[addressIndex].cidade      = response.cidade;
                    vm.cliente.enderecos[addressIndex].complemento = response.complemento;
                    vm.cliente.enderecos[addressIndex].numero      = response.numero;
                    vm.cliente.enderecos[addressIndex].rua         = response.rua;
                    vm.cliente.enderecos[addressIndex].uf          = response.uf;
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
