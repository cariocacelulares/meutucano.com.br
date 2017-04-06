(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DeleteNotaController', DeleteNotaController);

    function DeleteNotaController($scope, toaster, ValidationErrors, Nota) {
        var vm = this;

        vm.validationErrors = [];
        vm.nota_id          = parseInt($scope.ngDialogData.id);
        vm.delete_note      = null;
        vm.returnStock      = false;

        /**
         * Delete nota
         */
        vm.remove = function() {
            vm.validationErrors = [];

            Nota.delete(vm.nota_id, vm.delete_note, vm.returnStock).then(
                function() {
                    $scope.closeThisDialog(true);
                    toaster.pop('warning', 'Sucesso!', 'Nota deletada com sucesso!');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
