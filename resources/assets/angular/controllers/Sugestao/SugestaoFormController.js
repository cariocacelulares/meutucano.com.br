(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SugestaoFormController', SugestaoFormController);

    function SugestaoFormController(Restangular,  Usuario) {
        var vm = this;

        vm.pessoas = {};
        vm.sugestao = {};

        vm.load = function() {
            Usuario.getList().then(function(response) {
                vm.pessoas = response;
            });
        };

        vm.load();

        /**
         * Salva a sugestao
         *
         * @return {void}
         */
        vm.save = function() {
            Restangular.all('sugestoes').post(vm.sugestao).then(function() {
                toaster.pop('success', 'Sucesso!', 'Sugestão / crítica enviada com sucesso!');
                $scope.closeThisDialog(true);
            });
        };

        /*if (typeof $scope.ngDialogData.inspecao != 'undefined') {
            vm.inspecao = angular.copy($scope.ngDialogData.inspecao);
        } else {
            vm.inspecao = {};
        }

        vm.load = function() {
            vm.loading = true;

            InspecaoTecnica.get(vm.inspecao.id).then(function(inspecao) {
                vm.inspecao   = inspecao;
                vm.loading = false;
            });
        };

        if (vm.inspecao.id) {
            vm.load();
        }*/

        /**
         * Salva a inspecao
         *
         * @return {void}
         */
        /*vm.save = function() {
            InspecaoTecnica.save(vm.inspecao, vm.inspecao.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Inspeção técnica salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };*/

        /**
         * Exclui a inspecao
         *
         * @return {void}
         */
        /*vm.destroy = function() {
            InspecaoTecnica.delete(vm.inspecao.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Inspeção técnica excluida com sucesso!');
                $scope.closeThisDialog(true);
            });
        };*/
    }
})();