(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Logistica', LogisticaModel);

        function LogisticaModel(envService, Upload, Rest, Restangular) {
            var rest     = angular.copy(Rest);
            rest.baseUrl = 'logisticas';

            angular.extend(rest, {

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
