(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('InspecaoSolicitarFormModalController', InspecaoSolicitarFormModalController);

    function InspecaoSolicitarFormModalController($scope, InspecaoTecnica) {
        var vm = this;

        vm.order = $scope.ngDialogData.order;
        vm.pedidoProdutos = [];
        vm.inspecoes = [];

        vm.load = function() {
            for (var key in vm.order.produtos) {
                if (parseInt(vm.order.produtos[key].produto.estado) === 1) {
                    vm.order.produtos[key].solicitacao = {
                        aplicar: true,
                        quantidade: vm.order.produtos[key].quantidade,
                        max: vm.order.produtos[key].quantidade
                    };
                    vm.pedidoProdutos.push(vm.order.produtos[key]);
                }
            }
        };

        vm.load();

        vm.solicitar = function() {
            var solicitacao = [];

            for (var key in vm.pedidoProdutos) {
                if (vm.pedidoProdutos[key].solicitacao.aplicar) {
                    solicitacao.push({
                        pedido_produtos_id: vm.pedidoProdutos[key].id,
                        quantidade: vm.pedidoProdutos[key].solicitacao.quantidade
                    });
                }
            }

            InspecaoTecnica.solicitar(solicitacao).then(function(data) {
                vm.inspecoes = data;
            });
        };
    }
})();