(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('RastreioHelper', function(ngDialog, Rastreio, Devolucao, Pi, Logistica, envService, $window, $httpParamSerializer) {
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
                }
            };
        });
})();
