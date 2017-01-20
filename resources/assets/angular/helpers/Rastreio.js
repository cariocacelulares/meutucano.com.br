(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('RastreioHelper', function($window, $httpParamSerializer, SweetAlert, envService, ngDialog, toaster, Rastreio, Devolucao, Pi, Logistica) {
            var vm;

            var codigo = {
                servico: null,
                rastreio: null
            };

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
                 * Devolução
                 * @param rastreio
                 */
                devolucao: function(id, updateVm) {
                    Devolucao.get(id).then(function(devolucao) {
                        ngDialog.open({
                            template: 'views/rastreio/devolucao/form.html',
                            controller: 'DevolucaoFormController',
                            controllerAs: 'DevolucaoForm',
                            data: {
                                devolucao: devolucao || { rastreio_id: id }
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
                },

                /**
                 * Mostra o motivo do cancelamento em um SweetAlert
                 *
                 * @param  {string} note delete_note
                 * @return {void}
                 */
                showNote: function(note) {
                    SweetAlert.swal({
                        title             : '',
                        text              : note,
                        confirmButtonText : 'Ok'
                    });
                },

                /**
                 * Devolução
                 * @param rastreio
                 */
                delete: function(id, updateVm) {
                    ngDialog.open({
                        template: 'views/rastreio/delete.html',
                        controller: 'DeleteRastreioController',
                        controllerAs: 'DeleteRastreio',
                        data: {
                            id: id
                        }
                    }).closePromise.then(function(data) {
                        if (updateVm &&
                            typeof this.vm != 'undefined' &&
                            typeof this.vm.load != 'undefined') {
                            this.vm.load();
                        }
                    }.bind(this));
                },

                /**
                 * PI
                 * @param rastreio
                 */
                pi: function(id, updateVm) {
                    Pi.get(id).then(function(pi) {
                        ngDialog.open({
                            template: 'views/rastreio/pi/form.html',
                            className: 'ngdialog-theme-default ngdialog-big',
                            controller: 'PiFormController',
                            controllerAs: 'PiForm',
                            data: {
                                pi: pi || { rastreio_id: id }
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
                },

                /**
                 * Logística reversa
                 * @param rastreio
                 */
                logistica: function(id, updateVm) {
                    Logistica.get(id).then(function(logistica) {
                        ngDialog.open({
                            template: 'views/rastreio/logistica/form.html',
                            className: 'ngdialog-theme-default ngdialog-big',
                            controller: 'LogisticaFormController',
                            controllerAs: 'Logistica',
                            data: {
                                logistica: logistica || { rastreio_id: id }
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
                },

                /**
                 * Editar rastreio
                 * @param rastreio
                 */
                editar: function(rastreio_id, updateVm) {
                    Rastreio.get(rastreio_id).then(function(rastreio) {
                        ngDialog.open({
                            template: 'views/rastreio/partials/editar.html',
                            controller: 'EditarController',
                            controllerAs: 'Editar',
                            data: {
                                rastreio: rastreio
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
                },

                /**
                 * Imprime etiqueta
                 *
                 * @param rastreio_id
                 */
                printEtiqueta: function(rastreio_id) {
                    var auth = {
                        token: localStorage.getItem('satellizer_token')
                    };

                    $window.open(envService.read('apiUrl') + '/rastreios/etiqueta/' + rastreio_id + '?' + $httpParamSerializer(auth), 'etiqueta');
                },

                /**
                 * Imprime histórico
                 *
                 * @param rastreio_id
                 */
                printHistorico: function(rastreio_id) {
                    var auth = {
                        token: localStorage.getItem('satellizer_token')
                    };

                    $window.open(envService.read('apiUrl') + '/rastreios/historico/' + rastreio_id + '?' + $httpParamSerializer(auth), 'historico');
                },

                /**
                 * Força a geração ou regeração da imagem do rastreio
                 *
                 * @param  {int} rastreio_id
                 * @param  {bool} updateVm
                 * @return {void}
                 */
                imagem: function(rastreio_id, updateVm) {
                    Rastreio.historico(rastreio_id).then(function() {
                        if (updateVm &&
                            typeof this.vm != 'undefined' &&
                            typeof this.vm.load != 'undefined') {
                            this.vm.load();
                        }
                    }.bind(this));
                },

                /**
                 * Gera um código de rsastreio
                 *
                 * @param  {int} servico pac|sedex
                 * @return {void}
                 */
                generateCode: function(servico) {
                    if (typeof servico == 'undefined') {
                        servico = this.codigo.servico;
                    }

                    this.codigo.rastreio = 'Gerando...';

                    Rastreio.codigo(servico).then(function(response) {
                        this.codigo.rastreio = response.codigo;

                        if (response.hasOwnProperty('error')) {
                            this.codigo.rastreio = 'Códigos esgotados!';
                            toaster.pop('error', 'Erro', response.error);
                        }

                        if (response.hasOwnProperty('msg')) {
                            toaster.pop('warning', 'Atenção', response.msg);
                        }
                    }.bind(this));
                },

                /**
                 * Apenas notifica que o clipboard foi copiado
                 *
                 * @return {void}
                 */
                codeCopied: function() {
                    toaster.pop('success', 'Sucesso!', 'O código foi copiado para sua área de transferência.');
                },

                /**
                 * Monitora ou para de monitorar um rastreio
                 *
                 * @param  {int} rastreio_id
                 * @param  {bool} monitorar
                 * @param  {bool} updateVm
                 * @return {void}
                 */
                monitorar: function(rastreio_id, monitorar, updateVm) {
                    Rastreio.monitorar(rastreio_id, monitorar).then(function() {
                        toaster.pop('success', 'Sucesso!', 'Agora você está monitorando este rastreio.');

                        if (updateVm &&
                            typeof this.vm != 'undefined') {
                            if (typeof this.vm.loadRastreios != 'undefined') {
                                this.vm.loadRastreios();
                            } else if (typeof this.vm.load != 'undefined') {
                                this.vm.load();
                            }
                        }
                    }.bind(this));
                },

                /**
                 * Retorna a classe da label para o status do rastreio
                 *
                 * @param  {string|int} rastreio_status
                 * @return {string}
                 */
                parseStatusClass: function(rastreio_status) {
                    switch (rastreio_status) {
                        case '1':
                        case '7':
                        case '8':
                            return 'info';
                        case '2':
                            return 'warning';
                        case '4':
                            return 'success';
                        case '3':
                        case '5':
                        case '6':
                            return 'danger';
                    }
                }
            };
        });
})();
