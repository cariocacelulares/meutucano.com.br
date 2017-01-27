(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('InspecaoTecnica', InspecaoTecnicaModel);

        function InspecaoTecnicaModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'inspecao_tecnica';

            angular.extend(rest, {
                /**
                 * Lista as inspecoes sem pedido e revisadas associadas ao sky
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                listBySku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/list/').customGET(sku);
                },

                /**
                 * Retorna uma inspecao pelo pedido produto
                 *
                 * @param  {int} pedido_produtos_id
                 * @return {Object}
                 */
                getByPedidoProduto: function(pedido_produtos_id) {
                    return Restangular.one(this.baseUrl + '/get', pedido_produtos_id).get();
                },

                /**
                 * Retorna as inspecoes não revisadas
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                fila: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all(this.baseUrl + '/fila').customGET("", params || {});
                },

                /**
                 * Retorna as inspecoes solicitadas pelo usuário atual
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                solicitadas: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all(this.baseUrl + '/solicitadas').customGET("", params || {});
                },

                /**
                 * Altera a prioridade da inspecao
                 *
                 * @param  {int} pedido_produtos_id
                 * @return {Object}
                 */
                alterarPrioridade: function(pedido_produtos_id) {
                    return Restangular.one(this.baseUrl + '/priority', pedido_produtos_id).customPOST();
                },

                /**
                 * Cria uma reserva
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                reserva: function(params) {
                    return Restangular.all(this.baseUrl + '/reserva').post(params);
                },

                /**
                 * Verifica uma reserva
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                verificarReserva: function(params) {
                    return Restangular.all(this.baseUrl + '/verificar-reserva').post(params);
                },

                /**
                 * Solicitar inspeções tecnicas
                 *
                 * @param  {array} params Um array com o pedido_produto_id e quantidade
                 * @return {Object}
                 */
                solicitar: function(params) {
                    return Restangular.all(this.baseUrl + '/solicitar').post({orderProducts: params});
                }
            });

            return rest;
        }
})();
