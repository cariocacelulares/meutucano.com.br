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
                 * Generate DANFE
                 *
                 * @param rastreio_id
                 */
                printEtiqueta: function(rastreio_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/rastreios/etiqueta/' + rastreio_id + '?' + $httpParamSerializer(auth), 'etiqueta');
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
                },

                /**
                 * Cancela nota
                 * @param pedido_id
                 */
                cancelar: function(pedido_id) {
                    Restangular.one('pedidos', pedido_id).remove().then(function() {
                        $rootScope.$broadcast('upload');
                        toaster.pop('success', 'Sucesso!', 'Pedido deletado com sucesso!');
                    });
                }
            };
        });
})();