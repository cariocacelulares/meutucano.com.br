(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DevolucaoFormController', DevolucaoFormController);

    function DevolucaoFormController($rootScope, $scope, toaster) {
        var vm = this;

        if (typeof $scope.ngDialogData.devolucao != 'undefined') {
            vm.devolucao = angular.copy($scope.ngDialogData.devolucao);
        } else {
            vm.devolucao = {};
        }

        if (!vm.devolucao) {
            vm.devolucao = {
                /*motivo_status: vm.devolucao.status,
                rastreio_ref: { valor: vm.devolucao.valor },*/
                pago_cliente: '0'
            };
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            Marca.save(vm.devolucao, vm.devolucao.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Devolução criada com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();