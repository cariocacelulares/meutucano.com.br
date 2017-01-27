(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ProductImei', ProductImeiModel);

        function ProductImeiModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'product-imeis';

            angular.extend(rest, {
                /**
                 * Lista os imeis associados ao sku
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                listBySku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/list/').customGET(sku);
                }
            });

            return rest;
        }
})();
