(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('InspecaoSolicitarFormModalController', InspecaoSolicitarFormModalController);

    function InspecaoSolicitarFormModalController($scope) {
        var vm = this;

        vm.order = $scope.ngDialogData.order;
        vm.pedidoProdutos = [];

        vm.load = function() {
            for (var key in vm.order.produtos) {
                vm.order.produtos[key].solicitacao = {
                    aplicar: true,
                    quantidade: vm.order.produtos[key].quantidade
                };
                vm.pedidoProdutos.push(vm.order.produtos[key]);
            }
        };

        vm.load();
    }
})();