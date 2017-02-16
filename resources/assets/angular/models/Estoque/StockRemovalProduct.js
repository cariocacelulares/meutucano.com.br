(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('StockRemovalProduct', StockRemovalProductModel);

        function StockRemovalProductModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque/retirada/produto';

            angular.extend(rest, {
                /**
                 * Change stock removal product status
                 *
                 * @param  {int} id
                 * @param  {int} status
                 * @return {Object}
                 */
                changeStatus: function(id, status) {
                    return Restangular.one(this.baseUrl + '/status', id).customPOST({ status: status });
                }
            });

            return rest;
        }
})();
