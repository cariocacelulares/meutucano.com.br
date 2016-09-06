(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('NotaHelper', function(ngDialog, $window, envService, $httpParamSerializer) {
            return {
                /**
                 * Generate XML
                 * @param pedido_id
                 */
                printXML: function(pedido_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/notas/xml/' + pedido_id + '?' + $httpParamSerializer(auth), 'xml');
                },

                /**
                 * Generate DANFE
                 * @param pedido_id
                 */
                printDanfe: function(pedido_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/notas/danfe/' + pedido_id + '?' + $httpParamSerializer(auth), 'danfe');
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