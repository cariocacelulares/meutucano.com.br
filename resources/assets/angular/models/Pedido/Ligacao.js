(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Ligacao', LigacaoModel);

        function LigacaoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'ligacoes';

            angular.extend(rest, {
                /**
                 * Retorna as ligacoes de um pedido ordenados de forma descrescente por data
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                getFromOrder: function(params) {
                    params = this.parseParams(params);
                    return Restangular.all('ligacoes').customGET(params || {});
                },
            });

            return rest;
        }
})();
