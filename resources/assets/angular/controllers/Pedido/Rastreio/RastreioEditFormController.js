(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EditarController', EditarController);

    function EditarController(Restangular, $rootScope, $scope, toaster, ValidationErrors, Rastreio) {
        var vm = this;

        vm.validationErrors = [];

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.rastreio = $scope.ngDialogData.rastreio;
        } else {
            vm.rastreio = {};
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            vm.validationErrors = [];

            Rastreio.save(vm.rastreio, vm.rastreio.id || null).then(
                function() {
                    $scope.closeThisDialog(true);
                    toaster.pop('success', 'Sucesso!', 'Pedido editado com sucesso!');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
