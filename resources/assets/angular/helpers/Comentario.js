(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ComentarioHelper', function($state, ngDialog, SweetAlert, toaster, Comentario) {
            var vm;

            return {
                /**
                 * Retorna uma nova instância
                 * @param  {Object} vm
                 * @return {Object}
                 */
                init: function(vm) {
                    this.vm = vm;

                    return this;
                },

                /**
                 * Abre o modal de comentários do pedido
                 *
                 * @param  {int} pedido_id
                 * @return {void}
                 */
                openModal: function(pedido_id, updateVm) {
                    ngDialog.open({
                        template: 'views/pedido/comentarios-modal.html',
                        data: { pedido_id: pedido_id },
                        controller: 'PedidoComentarioController',
                        controllerAs: 'PedidoComentario'
                    }).closePromise.then(function(data) {
                            if (updateVm &&
                                typeof this.vm != 'undefined' &&
                                typeof this.vm.load != 'undefined') {
                                this.vm.load();
                            }
                    }.bind(this));
                }
            };
        });
})();
