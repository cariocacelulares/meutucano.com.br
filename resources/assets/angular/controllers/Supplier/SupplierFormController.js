(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SupplierFormController', SupplierFormController);

    function SupplierFormController($state, $stateParams, toaster, ValidationErrors, Cep, Supplier) {
        var vm = this;

        vm.validationErrors = [];
        vm.loading          = false;
        vm.supplier         = {
            id        : parseInt($stateParams.id) || null
        };

        /**
         * On form loads
         */
        vm.load = function() {
            if (vm.supplier.id) {
                Supplier.get(vm.supplier.id).then(function(response) {
                    vm.supplier = response;
                });
            }
        }

        vm.load();

        /**
         * If can, search address by cep
         */
        vm.cepChanged = function() {
            if (typeof vm.supplier.cep != 'undefined' && vm.supplier.cep.length >= 8) {
                Cep.getAddress(vm.supplier.cep).then(function(address) {
                    vm.supplier.neighborhood = address.bairro      || vm.supplier.neighborhood;
                    vm.supplier.cep          = address.cep         || vm.supplier.cep;
                    vm.supplier.city         = address.cidade      || vm.supplier.city;
                    vm.supplier.complement   = address.complemento || vm.supplier.complement;
                    vm.supplier.number       = address.numero      || vm.supplier.number;
                    vm.supplier.street       = address.rua         || vm.supplier.street;
                    vm.supplier.uf           = address.uf          || vm.supplier.uf;
                    vm.supplier.country      = vm.supplier.country || 'Brasil';
                });
            }
        }

        /**
         * Salva o supplier
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Supplier.save(vm.supplier, vm.supplier.id).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Fornecedor salvo com sucesso!');
                    $state.go('app.suppliers.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Exclui o supplier
         *
         * @return {void}
         */
        vm.destroy = function() {
            Supplier.delete(vm.supplier.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Fornecedor excluido com sucesso!');
                $state.go('app.suppliers.index');
            });
        };
    }
})();
