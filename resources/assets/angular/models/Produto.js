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
                 * @param  {Object} params
                 * @return {Object}
                 */
                generateSku: function(params) {
                    params = this.parseParams(params);

                    return Restangular.one(rest.baseUrl + '/generatesku').customGET(params.sku || {});
                }
            });

            return rest;
        }
})();