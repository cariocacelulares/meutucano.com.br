(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('PedidoHelper', function($state, ngDialog, SweetAlert, toaster, Pedido) {
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
                 * Fatura um pedido
                 *
                 * @param  {int} pedido_id
                 * @param  {boolean} updateVm  se deve atualizar a vm após a fatura
                 * @return {void}
                 */
                faturar: function(pedido_id, updateVm) {
                    Pedido.faturar(pedido_id).then(function() {
                        toaster.pop('success', 'Sucesso!', 'Pedido faturado com sucesso!');

                        if (typeof this.vm != 'undefined' &&
                            typeof updateVm !== 'undefined' &&
                            updateVm &&
                            typeof this.vm.load != 'undefined' ) {
                            this.vm.load();
                        }
                    }.bind(this));
                },

                /**
                 * Cancela o pedido, caso não for do site nem do mercado livre, pede um número de protocolo
                 * @param  {Object} pedido
                 * @param  {string} redirect rota a ser redirecionado após o cancelamento
                 * @param  {boolean} updateVm se deve atualizar a vm após o cancelamento
                 * @return {void}
                 */
                cancel: function(pedido, redirect, updateVm) {
                    if (pedido.marketplace.toLowerCase() == 'site' || pedido.marketplace.toLowerCase() == 'mercadolivre') {
                        SweetAlert.swal({
                            title: "Tem certeza?",
                            text: "Esta ação não poderá ser desfeita!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText: "Não",
                            confirmButtonColor: "#F55752",
                            confirmButtonText: "Sim!"
                        }, function(isConfirm) {
                            if (isConfirm) {
                                this.vm.loading = true;

                                Pedido.status(pedido.id, {
                                    'status': 5
                                }).then(function(pedido) {
                                    toaster.pop('success', 'Sucesso!', 'Pedido cancelado com sucesso!');
                                    this.vm.loading = false;

                                    if (typeof this.vm != 'undefined' && pedido) {
                                        if (typeof redirect !== 'undefined' && redirect) {
                                            $state.go(redirect);
                                        } else if (typeof updateVm !== 'undefined' && updateVm && typeof this.vm.load != 'undefined' ) {
                                            this.vm.load();
                                        }
                                    }
                                }.bind(this));
                            }
                        }.bind(this));
                    } else {
                        ngDialog.open({
                            template: 'views/pedido/form_cancelamento.html'
                        }).closePromise.then(function(data) {
                            if (!isNaN(data.value) && data.value !== null) {
                                this.vm.loading = true;

                                Pedido.status(pedido.id, {
                                    'status': 5,
                                    'protocolo': data.value
                                }).then(function(pedido) {
                                    toaster.pop('success', 'Sucesso!', 'Pedido cancelado com sucesso!');
                                    this.vm.loading = false;

                                    if (typeof this.vm != 'undefined' && pedido) {
                                        if (typeof redirect !== 'undefined' && redirect) {
                                            $state.go(redirect);
                                        } else if (typeof updateVm !== 'undefined' && updateVm && typeof this.vm.load != 'undefined' ) {
                                            this.vm.load();
                                        }
                                    }
                                }.bind(this));
                            }
                        }.bind(this));
                    }
                }
            };
        });
})();
