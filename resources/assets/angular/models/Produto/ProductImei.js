(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ProductImei', ProductImeiModel);

        function ProductImeiModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'produto-imei';

            angular.extend(rest, {
                /**
                 * Lista os imeis associados ao sku
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                listBySku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/list/').customGET(sku);
                },

                /**
                 * Parse imeis and return product info
                 * @param  {string}  imeis a list of imeis separated by newline
                 * @return {Object}        a list of product info
                 */
                parseImeis: function(imeis) {
                    return Restangular.one(rest.baseUrl + '/parse').customPOST({
                        imeis: imeis
                    });
                }
            });

            return rest;
        }
})();
