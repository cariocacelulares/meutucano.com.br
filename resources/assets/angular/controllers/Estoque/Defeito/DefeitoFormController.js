(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DefeitoFormController', DefeitoFormController);

    function DefeitoFormController($state, $stateParams, toaster, ValidationErrors, ProductDefect) {
        var vm = this;

        vm.validationErrors = [];
        vm.defect = {
            id: $stateParams.id || null
        };

        vm.load = function() {
            if (vm.defect.id) {
                ProductDefect.get(vm.defect.id).then(function (response) {
                    vm.defect = response;
                    vm.imei   = vm.defect.product_imei.imei;
                });
            }
        };

        vm.load();

        vm.save = function() {
            vm.validationErrors = [];

            ProductDefect.save(vm.defect, vm.defect.id).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Defeito registrado com sucesso!');
                    $state.go('app.estoque.defeitos.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        vm.destroy = function() {
            ProductDefect.delete(vm.defect.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Defeito excluido com sucesso!');
                $state.go('app.estoque.defeitos.index');
            });
        };
    }
})();
