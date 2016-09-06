(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Comentario', ComentarioModel);

        function ComentarioModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'comentarios';

            angular.extend(rest, {
                /**
                 * Retorna os comentários de um pedido ordenados de forma descrescente por data
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                getFromOrder: function(params) {
                    params = this.parseParams(params);
                    return Restangular.all('comentarios').customGET(params || {});
                },
            });

            return rest;
        }
})();
