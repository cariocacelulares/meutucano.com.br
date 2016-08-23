(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('RastreioHelper', function (Rastreio, ngDialog) {
            return {

                /**
                 * Devolução
                 * @param rastreio
                 */
                devolucao: function(rastreio) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/devolucao.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'DevolucaoController',
                        controllerAs: 'Devolucao',
                        data: {
                            rastreio: rastreio
                        }
                    });
                },

                /**
                 * Logística reversa
                 * @param rastreio
                 */
                logistica: function(rastreio) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/logistica.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'LogisticaController',
                        controllerAs: 'Logistica',
                        data: {
                            rastreio: rastreio
                        }
                    });
                },

                /**
                 * Editar rastreio
                 * @param rastreio
                 */
                editar: function(rastreio) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/editar.html',
                        controller: 'EditarController',
                        controllerAs: 'Editar',
                        data: {
                            rastreio: rastreio
                        }
                    });
                }
            };
        });
})();
