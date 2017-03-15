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
                 * @param  {Object} params
                 * @return {Object}
                 */
                listBySku: function(sku, params) {
                    params = this.parseParams(params);

                    return Restangular.all(rest.baseUrl + '/list/' + sku).customGET('', params || {});
                },

                /**
                 * Parse imeis and return product info
                 *
                 * @param  {string}  imeis a list of imeis separated by newline
                 * @return {Object}        a list of product info
                 */
                parseImeis: function(imeis) {
                    return Restangular.one(rest.baseUrl + '/parse').customPOST({
                        imeis: imeis
                    });
                },

                /**
                 * Return a history list by imei
                 *
                 * @param  {string} imei
                 * @return {Object}
                 */
                history: function(imei) {
                    return Restangular.one(rest.baseUrl + '/historico', imei).customGET();
                }
            });

            return rest;
        }
})();
