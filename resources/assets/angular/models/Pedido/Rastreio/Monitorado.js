(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Monitorado', MonitoradoModel);

        function MonitoradoModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'rastreio/monitorados';

            angular.extend(rest, {

                /**
                 * Retorna uma lista simples com os rastreios monitorados
                 *
                 * @return {Object}
                 */
                simpleList: function() {
                    return Restangular.all(this.baseUrl + '/simple-list').customGET();
                },
            });

            return rest;
        }
})();
