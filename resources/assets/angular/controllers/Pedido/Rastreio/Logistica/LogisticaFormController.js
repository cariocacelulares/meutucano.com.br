(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LogisticaFormController', LogisticaFormController);

    function LogisticaFormController($scope, toaster, ValidationErrors, Logistica) {
        var vm = this;

        vm.validationErrors = [];

        vm.logisticaOriginal = angular.copy($scope.ngDialogData.logistica, vm.logisticaOriginal);
        vm.logistica = $scope.ngDialogData.logistica;

        /**
         * Save the observation
         */
        vm.save = function() {
            vm.validationErrors = [];

            Logistica.save(vm.logistica, vm.logistica.id || null).then(
                function() {
                    $scope.closeThisDialog(true);
                    toaster.pop('success', 'Sucesso!', 'Logistica reversa salva com sucesso!');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }

})();
