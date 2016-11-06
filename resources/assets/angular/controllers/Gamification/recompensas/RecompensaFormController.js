(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RecompensaFormController', RecompensaFormController);

    function RecompensaFormController($scope, toaster, Recompensa) {
        var vm = this;

        if (typeof $scope.ngDialogData.recompensa != 'undefined') {
            vm.recompensa = angular.copy($scope.ngDialogData.recompensa);
        } else {
            vm.recompensa = {};
        }

        vm.load = function() {
            vm.loading = true;

            Recompensa.get(vm.recompensa.id).then(function(recompensa) {
                vm.recompensa = recompensa;
                vm.loading = false;
            });
        };

        if (vm.recompensa.id) {
            vm.load();
        }

        /**
         * Salva a recompensa
         *
         * @return {void}
         */
        vm.save = function() {
            Recompensa.save(vm.recompensa, vm.recompensa.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Recompensa salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };

        /**
         * Exclui a recompensa
         *
         * @return {void}
         */
        vm.destroy = function() {
            Recompensa.delete(vm.recompensa.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Recompensa excluida com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();