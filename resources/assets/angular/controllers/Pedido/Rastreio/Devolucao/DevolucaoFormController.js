(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DevolucaoFormController', DevolucaoFormController);

    function DevolucaoFormController($scope, toaster, InspecaoTecnicaHelper, Devolucao) {
        var vm = this;

        vm.devolucaoOriginal = angular.copy($scope.ngDialogData.devolucao, vm.devolucaoOriginal);
        vm.devolucao = $scope.ngDialogData.devolucao;

        /**
         * @type {Object}
         */
        vm.inspecaoTecnicaHelper = InspecaoTecnicaHelper.init(vm);

        /**
         * Se o motivo for defeito e a ação for renvio e foram alterados, checa se algum produto do pedido é seminovo
         */
        vm.verifySeminovos = function() {
            if ((vm.devolucaoOriginal.motivo !== vm.devolucao.motivo || vm.devolucaoOriginal.acao !== vm.devolucao.acao)
                && (vm.devolucao.motivo == '5' && vm.devolucao.acao == '0')) {
                vm.inspecaoTecnicaHelper.existsSeminovos(vm.devolucao.rastreio_id);
            } else {
                vm.existsSeminovos = false;
            }
        };

        /**
         * Save the observation
         */
        vm.save = function() {
            if (vm.existsSeminovos == true && vm.inspecoes === false) {
                toaster.pop('warning', 'Atenção!', 'Este pedido possui produtos seminovos, antes de reenviar, você precisa requisitar as inspeções técnicas!');
            } else {
                if (vm.existsSeminovos) {
                    vm.devolucao.inspecoes = {
                        criar: vm.inspecoes.criar,
                        reservar: vm.inspecoes.reservar
                    };
                }

                Devolucao.save(vm.devolucao, vm.devolucao.id || null).then(function() {
                    toaster.pop('success', 'Sucesso!', 'Devolução criada com sucesso!');
                    $scope.closeThisDialog(true);
                });
            }
        };
    }

})();