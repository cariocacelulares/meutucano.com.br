(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('InspecaoTecnicaHelper', function(ngDialog, toaster, Rastreio, Pedido, InspecaoTecnica) {
            var vm;

            return {
                /**
                 * Retorna uma nova instância
                 * @param  {Object} vm
                 * @return {Object}
                 */
                init: function(vm) {
                    this.vm = vm;
                    this.vm.inspecoes = false;

                    return this;
                },

                /**
                 * Altera a prioridade da inspecao
                 *
                 * @param  {int} pedido_produtos_id
                 * @param  {bool} updateVm
                 * @return {void}
                 */
                alterarPrioridade: function(pedido_produtos_id, updateVm) {
                    InspecaoTecnica.alterarPrioridade(pedido_produtos_id).then(function() {
                        toaster.pop('success', 'Sucesso!', 'Prioridade alterada com sucesso!');

                        if (typeof this.vm != 'undefined' &&
                            typeof updateVm !== 'undefined' &&
                            updateVm &&
                            typeof this.vm.load != 'undefined' ) {
                            this.vm.load();
                        }
                    }.bind(this));
                },

                /**
                 * Verifica se existe inspecoes para os produtos e então retorna a qual vai associar ou criar
                 *
                 * @param  {int} rastreio_id
                 * @return {Object}
                 */
                verificarInspecoes: function(rastreio_id) {
                    Rastreio.getInspecaoData(rastreio_id).then(function(response) {
                        this.vm.inspecoes = response;
                    }.bind(this));
                },

                /**
                 * Verifica se o algum dos produtos do pedido deste rastreio é seminovo
                 *
                 * @param  {int} rastreio_id
                 * @return {Object}
                 */
                existsSeminovos: function(rastreio_id) {
                    Rastreio.existsSeminovos(rastreio_id).then(function(response) {
                        this.vm.existsSeminovos = response.exists;
                    }.bind(this));
                },

                requestInspection: function(order_id) {
                    Pedido.get(order_id).then(function(order) {
                        ngDialog.open({
                            className: 'ngdialog-theme-default ngdialog-big',
                            template: 'views/inspecao/solicitada/form-modal.html',
                            controller: 'InspecaoSolicitarFormModalController',
                            controllerAs: 'InspecaoSolicitarFormModal',
                            data: {
                                order: order || null
                            }
                        }).closePromise.then(function(data) {
                            if (updateVm &&
                                typeof this.vm != 'undefined' &&
                                typeof this.vm.load != 'undefined' &&
                                data.value === true) {
                                this.vm.load();
                            }
                        }.bind(this));
                    }.bind(this));
                }
            };
        });
})();
