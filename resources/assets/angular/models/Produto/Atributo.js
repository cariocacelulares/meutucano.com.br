(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Atributo', AtributoModel);

        function AtributoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'atributos';

            angular.extend(rest, {
                /**
                 * Retorna os atributos relacionado a uma linha
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                fromLinha: function(params) {
                    params = this.parseParams(params);
                    // console.log(params);

                    return Restangular.all('atributos/linha').customGET(params || {});
                }
            });

            return rest;
        }
})();
