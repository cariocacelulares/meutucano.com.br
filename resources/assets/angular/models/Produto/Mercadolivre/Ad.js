(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Ad', AdModel);

        function AdModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'mercadolivre/ads';

            angular.extend(rest, {
                /**
                 * List ads grouped by product
                 *
                 * @return {Object}
                 */
                groupedByProduct: function(params) {
                    var params = this.parseParams(params);

                    return Restangular.one(this.baseUrl + '/grouped').customGET('', params || null);
                }
            });

            return rest;
        }
})();
