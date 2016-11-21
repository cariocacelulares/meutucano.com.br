(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Devolucao', Devolucao);

        function Devolucao(envService, Upload, Rest, Restangular) {
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

                /**
                 * Cria um novo registro do recurso
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                create: function(params) {
                    return Upload.upload({
                        url: envService.read('apiUrl') + '/' + this.baseUrl,
                        method: 'POST',
                        headers: { Authorization: 'Bearer '+ localStorage.getItem('satellizer_token') },
                        data: params
                    });
                }
            });

            return rest;
        }
})();
