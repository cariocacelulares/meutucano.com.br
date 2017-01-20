(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('NotaHelper', function($httpParamSerializer, $window, SweetAlert, envService, ngDialog, Restangular, toaster) {
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

                    $window.open(envService.read('apiUrl') + '/notas/xml/' + nota_id + '/' + devolucao+ '?' + $httpParamSerializer(auth), 'xml');
                },

                /**
                 * Generate DANFE
                 * @param nota_id
                 */
                printDanfe: function(nota_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/notas/danfe/' + nota_id + '?' + $httpParamSerializer(auth), 'danfe');
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
                }
            };
        });
})();
