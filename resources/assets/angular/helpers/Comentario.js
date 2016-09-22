(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ComentarioHelper', function($state, ngDialog, SweetAlert, toaster, Comentario) {
            var vm;

            return {
                /**
                 * Abre o modal de comentários do pedido
                 *
                 * @param  {int} pedido_id
                 * @return {void}
                 */
                openModal: function(pedido_id) {
                    ngDialog.open({
                        template: 'views/pedido/comentarios-modal.html',
                        data: { pedido_id: pedido_id },
                        controller: 'PedidoComentarioController',
                        controllerAs: 'PedidoComentario'
                    });
                }
            };
        });
})();
