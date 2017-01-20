(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DeleteRastreioController', DeleteRastreioController);

    function DeleteRastreioController($scope, toaster, ValidationErrors, Rastreio) {
        var vm = this;

        vm.validationErrors = [];
        vm.rastreio_id      = parseInt($scope.ngDialogData.id);
        vm.delete_note      = null;

        /**
         * Delete rastreio
         */
        vm.save = function() {
            vm.validationErrors = [];

            Rastreio.delete(vm.rastreio_id, vm.delete_note).then(
                function() {
                    $scope.closeThisDialog(true);
                    toaster.pop('warning', 'Sucesso!', 'Rastreio deletado com sucesso!');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
