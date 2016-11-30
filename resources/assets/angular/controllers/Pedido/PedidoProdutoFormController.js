(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoProdutoFormController', PedidoProdutoFormController);

    function PedidoProdutoFormController($scope, toaster, PedidoProduto, Produto, InspecaoTecnica) {
        var vm = this;

       vm.produtos = [];

        if (typeof $scope.ngDialogData.pedidoProduto != 'undefined') {
            vm.pedidoProduto = angular.copy($scope.ngDialogData.pedidoProduto);
        } else {
            vm.pedidoProduto = {};
        }
        vm.original = vm.pedidoProduto;

        if (typeof $scope.ngDialogData.pedido_id != 'undefined') {
            vm.pedidoProduto.pedido_id = angular.copy($scope.ngDialogData.pedido_id);
        }

        vm.load = function() {
            vm.loading = true;

            PedidoProduto.get(vm.pedidoProduto.id).then(function(pedidoProduto) {
                vm.pedidoProduto = pedidoProduto;

                if (typeof vm.pedidoProduto.produto !== 'undefined' && vm.pedidoProduto.produto) {
                    vm.produtos = [ vm.pedidoProduto.produto ];
                }

                vm.loading = false;
            });
        };

        if (vm.pedidoProduto.id) {
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
         * Salva o pedidoProduto
         *
         * @return {void}
         */
        vm.save = function() {
            if (typeof vm.pedidoProduto.produto !== 'undefined') {
                vm.pedidoProduto.produto_sku = vm.pedidoProduto.produto.sku;
            }

            var modificado = (vm.original.produto_sku != vm.pedidoProduto.produto_sku && typeof vm.original.id != 'undefined');
            if (modificado) {
                vm.pedidoProduto.imei = null;
            }

            PedidoProduto.save(vm.pedidoProduto, vm.pedidoProduto.id || null).then(function(response) {
                toaster.pop('success', 'Sucesso!', 'Produto do pedido salvo com sucesso!');

                if (response.produto.estado != 1 || !modificado) {
                    $scope.closeThisDialog(true);
                } else {
                    InspecaoTecnica.getByPedidoProduto(response.id).then(function(data) {
                        $scope.closeThisDialog({
                            'pedidoProduto': response,
                            'inspecao': data
                        });
                    });
                }
            });
        };

        /**
         * Exclui o pedidoProduto
         *
         * @return {void}
         */
        vm.destroy = function() {
            PedidoProduto.delete(vm.pedidoProduto.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto do pedido excluído com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();