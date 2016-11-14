(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Produto', ProdutoModel);

        function ProdutoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'produtos';

            angular.extend(rest, {
                /**
                 * Gera um novo SKU para o produto
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                generateSku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/generate-sku').customGET(sku || null);
                },

                /**
                 * Checa se o sku existe
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                checkSku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/check-sku').customGET(sku);
                },

                /**
                 * Busca produtos por sku ou titulo baseado no parametro
                 *
                 * @param  {string} term   termo a ser buscado
                 * @param  {int|string}      estado estado do item (novo/seminovo)
                 * @return {Object}
                 */
                search: function(term, estado) {
                    if (typeof estado !== 'undefined' && estado) {
                        estado = '?estado=' + estado;
                    } else {
                        estado = '';
                    }

                    return Restangular.one(rest.baseUrl + '/search/' + term + estado).customGET();
                }
            });

            return rest;
        }
})();