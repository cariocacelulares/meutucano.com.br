(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DevolucaoFormController', DevolucaoFormController);

    function DevolucaoFormController($scope, toaster, Devolucao) {
        var vm = this;

        vm.devolucaoOriginal = angular.copy($scope.ngDialogData.devolucao, vm.devolucaoOriginal);
        vm.devolucao = $scope.ngDialogData.devolucao;

        /**
         * Save the observation
         */
        vm.save = function() {
            Devolucao.save(vm.devolucao, vm.devolucao.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Devolução criada com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();