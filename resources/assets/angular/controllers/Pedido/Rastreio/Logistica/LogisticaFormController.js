(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LogisticaFormController', LogisticaFormController);

    function LogisticaFormController($scope, toaster, Logistica) {
        var vm = this;

        vm.logisticaOriginal = angular.copy($scope.ngDialogData.logistica, vm.logisticaOriginal);
        vm.logistica = $scope.ngDialogData.logistica;

        /**
         * Save the observation
         */
        vm.save = function() {
            Logistica.save(vm.logistica, vm.logistica.id || null).then(function() {
                $scope.closeThisDialog(true);
                toaster.pop('success', 'Sucesso!', 'Logistica reversa salva com sucesso!');
            });
        };
    }

})();