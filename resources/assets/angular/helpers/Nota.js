(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('NotaHelper', function(ngDialog, $window, envService, $httpParamSerializer) {
            return {
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
                email: function(pedido_id, email) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/email.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'EmailController',
                        controllerAs: 'Email',
                        data: {
                            pedido_id: pedido_id,
                            email: email
                        }
                    });
                }
            };
        });
})();