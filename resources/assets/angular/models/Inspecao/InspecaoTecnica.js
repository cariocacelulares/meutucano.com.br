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
                 * Retorna as PI's pendentes de resposta
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                fila: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all(this.baseUrl + '/fila').customGET("", params || {});
                },

                /**
                 * Altera a prioridade da inspecao
                 *
                 * @param  {int} pedido_produtos_id
                 * @return {Object}
                 */
                alterarPrioridade: function(pedido_produtos_id) {
                    return Restangular.one(this.baseUrl + '/priority', pedido_produtos_id).customPOST();
                }
            });

            return rest;
        }
})();
