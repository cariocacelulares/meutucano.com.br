(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoComentarioController', PedidoComentarioController);

    function PedidoComentarioController($rootScope, Restangular, toaster) {
        var vm = this;
 
        vm.comentario = null;
        vm.loading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });
 
        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Save comentario
         */
        vm.save = function(pedido) {
            vm.loading = true;

            console.log(pedido);
            console.log(vm.comentario);

            Restangular.one('comentarios').customPOST(vm.comentario).then(function() {
                $rootScope.$broadcast('upload');
                toaster.pop('success', 'Sucesso!', 'Comentário cadastrado com sucesso!');
            });
        };
    }

})();