(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ProductStock', ProductStockModel);

        function ProductStockModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'product-stocks';

            angular.extend(rest, {
                /**
                 * Lista os estoques associados ao sku
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                listBySku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/list/').customGET(sku);
                },

                /**
                 * Envia as informações de entrada do produto
                 *
                 * @param  {int} data informacoes da entrada
                 * @return {Object}
                 */
                entry: function(data) {
                    return Restangular.one(rest.baseUrl + '/entry').customPOST(data);
                }
            });

            return rest;
        }
})();
