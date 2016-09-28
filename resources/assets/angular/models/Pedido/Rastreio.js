(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Rastreio', RastreioModel);

        function RastreioModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'rastreios';

            angular.extend(rest, {
                /**
                 * Retorna os rastreios importantes
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                important: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('rastreios/important').customGET("", params || {});
                },

                /**
                 * Atualiza o status de todos rastreios
                 *
                 * @return {Object}
                 */
                refreshAll: function() {
                    return Restangular.all('rastreios/refresh_all').customPUT();
                },

                /**
                 * Força a geração ou regeração da imagem do rastreio
                 *
                 * @param  {int} rastreio_id
                 * @return {void}
                 */
                historico: function(rastreio_id) {
                    return Restangular.one('rastreios/historico/', rastreio_id).customPUT();
                },

                /**
                 * Gera um código de rastreio
                 *
                 * @param  {int} servico pac|sedex
                 * @return {void}
                 */
                codigo: function(servico) {
                    return Restangular.one('codigos/gerar', servico).customGET();
                }
            });

            return rest;
        }
})();