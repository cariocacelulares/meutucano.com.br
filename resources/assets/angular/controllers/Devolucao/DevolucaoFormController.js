(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DevolucaoFormController', DevolucaoFormController);

    function DevolucaoFormController($rootScope, $scope, toaster, Devolucao) {
        var vm = this;

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.devolucao = $scope.ngDialogData.rastreio;
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
            Devolucao.save(vm.devolucao, vm.devolucao.rastreio_id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Devolução criada com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();