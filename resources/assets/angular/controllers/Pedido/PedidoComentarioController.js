(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoComentarioController', PedidoComentarioController);

    function PedidoComentarioController($rootScope, $stateParams, $scope, Restangular, toaster, ngDialog, Comentario) {
        var vm = this;

        vm.comentarios = [];
        vm.pedido_id = (typeof $scope.ngDialogData !== 'undefined' ? $scope.ngDialogData.pedido_id : null) || $stateParams.id;
        vm.loading = false;

        /**
         * Load comentarios
         */
        vm.load = function() {
            vm.loading = true;

            Comentario.getFromOrder(vm.pedido_id).then(function(comentarios) {
                vm.loading = false;
                vm.comentarios = comentarios;
            });
        };

        vm.load();

        /**
         * Save comentario
         */
        vm.save = function() {
            vm.loading = true;

            Comentario.save({
                'pedido_id':  vm.pedido_id,
                'comentario': vm.comentario
            }).then(function() {
                vm.loading = false;
                vm.comentario = null;
                vm.formComentario.$setPristine();

                vm.load();
                toaster.pop('success', 'Sucesso!', 'Comentário cadastrado com sucesso!');
            });
        };

        /**
         * Destroy comentário
         */
        vm.destroy = function(comentario) {
            vm.loading = true;

            Comentario.delete(comentario).then(function() {
                vm.loading = false;
                vm.load();
                toaster.pop('success', 'Sucesso!', 'Comentário excluído com sucesso!');
            });
        };
    }
})();