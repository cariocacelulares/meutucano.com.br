(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('InspecaoTecnicaFormController', InspecaoTecnicaFormController);

    function InspecaoTecnicaFormController($rootScope, $scope, $state, $stateParams, InspecaoTecnica, Produto, toaster) {
        var vm = this;

       vm.produtos = [];

        if (typeof $scope.ngDialogData.inspecao != 'undefined') {
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
        }

        vm.search = function(term) {
            if (term) {
                Produto.search(term).then(function(response) {
                    vm.produtos = response;
                });
            }
        };

        /**
         * Salva a inspecao
         *
         * @return {void}
         */
        vm.save = function() {
            vm.inspecao.pedido_produtos_id = vm.inspecao.produto.sku;

            InspecaoTecnica.save(vm.inspecao, vm.inspecao.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Inspeção técnica salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };

        /**
         * Exclui a inspecao
         *
         * @return {void}
         */
        vm.destroy = function() {
            InspecaoTecnica.delete(vm.inspecao.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Inspeção técnica excluida com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();