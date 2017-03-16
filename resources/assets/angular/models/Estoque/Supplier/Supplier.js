(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Supplier', SupplierModel);

        function SupplierModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'supplier';

            angular.extend(rest, {
                /**
                 * Search supplier by cnpj
                 *
                 * @param  {string} cnpj
                 * @return {Object}
                 */
                search: function(cnpj) {
                    return Restangular.one(this.baseUrl + '/search', cnpj).customGET();
                }
            });

            return rest;
        }
})();
