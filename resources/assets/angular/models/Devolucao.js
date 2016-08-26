(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Devolucao', Devolucao);

        function Devolucao(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'devolucoes';

            angular.extend(rest, {
                /**
                 * Retorna as Devolucaoes pendentes de resposta
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                pending: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('devolucoes/pending').customGET("", params || {});
                },
            });

            return rest;
        }
})();
