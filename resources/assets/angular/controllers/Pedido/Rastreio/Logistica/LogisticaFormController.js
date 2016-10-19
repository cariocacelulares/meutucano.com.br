(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LogisticaFormController', LogisticaFormController);

    function LogisticaFormController($scope, toaster, InspecaoTecnicaHelper, Logistica) {
        var vm = this;

        vm.logisticaOriginal = angular.copy($scope.ngDialogData.logistica, vm.logisticaOriginal);
        vm.logistica = $scope.ngDialogData.logistica;

        /**
         * @type {Object}
         */
        vm.inspecaoTecnicaHelper = InspecaoTecnicaHelper.init(vm);

        /**
         * Se o motivo for defeito e a ação for renvio e foram alterados, checa se algum produto do pedido é seminovo
         */
        vm.verifySeminovos = function() {
            if ((vm.logisticaOriginal.motivo !== vm.logistica.motivo || vm.logisticaOriginal.acao !== vm.logistica.acao)
                && (vm.logistica.motivo == '0' && vm.logistica.acao == '0')) {
                vm.inspecaoTecnicaHelper.existsSeminovos(vm.logistica.rastreio_id);
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
                    vm.logistica.inspecoes = {
                        criar: vm.inspecoes.criar,
                        reservar: vm.inspecoes.reservar
                    };
                }

                Logistica.save(vm.logistica, vm.logistica.id || null).then(function() {
                    $scope.closeThisDialog(true);
                    toaster.pop('success', 'Sucesso!', 'Logistica reversa salva com sucesso!');
                });
            }
        };
    }

})();