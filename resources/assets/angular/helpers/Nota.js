(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('NotaHelper', function($state, $httpParamSerializer, $window,
                SweetAlert, envService, ngDialog, Restangular, toaster, Upload) {
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
                 * Abre o form de exclusão da nota
                 * @param nota_id
                 */
                delete: function(id, updateVm) {
                    ngDialog.open({
                        template: 'views/nota/delete.html',
                        controller: 'DeleteNotaController',
                        controllerAs: 'DeleteNota',
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
                 * Generate XML
                 * @param nota_id
                 * @param devolucao
                 */
                printXML: function(nota_id, devolucao) {
                    if (typeof devolucao != 'undefined') {
                        devolucao = devolucao ? 1 : 0;
                    } else {
                        devolucao = 0;
                    }

                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(
                        envService.read('apiUrl') +
                        '/notas/xml/' + nota_id +
                        '/' + devolucao +
                        '?' + $httpParamSerializer(auth),
                        'xml'
                    );
                },

                /**
                 * Generate DANFE
                 * @param nota_id
                 */
                printDanfe: function(nota_id, devolucao) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(
                        envService.read('apiUrl') +
                        '/notas/danfe/' +
                        nota_id +
                        '/' + (devolucao ? 1 : 0) +
                        '?' + $httpParamSerializer(auth), 'danfe'
                    );
                },

                /**
                 * Enviar nota por e-mail
                 * @param rastreio
                 */
                email: function(nota_id) {
                    Restangular.one('notas/email', nota_id).customPOST().then(function(response) {
                        if (typeof response.send !== 'undefined' && response.send === true) {
                            toaster.pop('success', 'Sucesso!', 'O e-mail foi enviado ao cliente');
                        } else {
                            toaster.pop('error', 'Falha!', 'Não foi possível enviar o e-mail ao cliente');
                        }
                    });
                },

                uploadDevolucao: function(files) {
                    if (files.length && typeof files[0] !== 'undefined') {
                        var file = files[0];
                    } else {
                        toaster.pop('error', 'Arquivo inválido!', 'Não foi possível importar o arquivo');
                        return;
                    }

                    if (file) {
                        Upload.upload({
                            url: envService.read('apiUrl') + '/notas/devolucao/upload',
                            headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                            data: {
                                file: file
                            }
                        }).success(function(response) {
                            if (response.error) {
                                toaster.pop('error', 'Ocorreu um erro!', response.message);
                            } else if (!response.object.devolucao) {
                                toaster.pop('error', '', 'Ocorreu um erro desconhecido, tente novamente.');
                            } else {
                                ngDialog.open({
                                    template: 'views/nota/devolucao/form.html',
                                    controller: 'NotaDevolucaoFormController',
                                    controllerAs: 'NotaDevolucaoForm',
                                    data: {
                                        devolucao: response.object.devolucao,
                                        products : response.object.products
                                    },
                                    className: 'ngdialog-theme-default ngdialog-extra-big',
                                    closeByDocument: false
                                }).closePromise.then(function(data) {
                                    if (data) {
                                        $state.reload();
                                    }
                                });
                            }
                        });
                    }
                }
            };
        });
})();
