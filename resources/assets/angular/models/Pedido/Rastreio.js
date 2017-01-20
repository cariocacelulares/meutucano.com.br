(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Rastreio', RastreioModel);

        function RastreioModel(Rest, Restangular) {
            var rest     = angular.copy(Rest);
            rest.baseUrl = 'rastreios';

            angular.extend(rest, {
                /**
                 * Deleta um registro do recurso
                 *
                 * @param  {int}    id
                 * @return {Object}
                 */
                delete: function(id, delete_note) {
                    return Restangular.one(this.baseUrl, id).customDELETE('', {
                        delete_note: delete_note
                    });
                },

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
                },

                /**
                 * Monitora ou para de monitorar um rastreio
                 *
                 * @param  {int} rastreio_id
                 * @param  {bool} monitorar
                 * @return {Object}
                 */
                monitorar: function(rastreio_id, monitorar) {
                    if (monitorar) {
                        return Restangular.one('rastreio/monitorados').customPOST({ 'rastreio_id': rastreio_id });
                    } else {
                        return Restangular.one('rastreio/monitorados/parar', rastreio_id).customDELETE();
                    }
                },

                /**
                 * Retorna os dados necessários
                 *
                 * @param  {int} rastreio_id
                 * @return {Object}
                 */
                getInspecaoData: function(rastreio_id) {
                    return Restangular.one('rastreios/inspecao-tecnica', rastreio_id).customGET();
                },

                /**
                 * Verfica se existem produtos seminovos
                 *
                 * @param  {int} rastreio_id
                 * @return {Object}
                 */
                existsSeminovos: function(rastreio_id) {
                    return Restangular.one('rastreios/busca-seminovos', rastreio_id).customGET();
                }
            });

            return rest;
        }
})();
