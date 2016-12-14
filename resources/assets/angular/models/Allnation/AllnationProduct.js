(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('AllnationProduct', AllnationProductModel);

        function AllnationProductModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'allnation/products';

            angular.extend(rest, {
                createProduct: function(params) {
                    return Restangular.one(this.baseUrl + '/create_product').customPOST(params || {});
                }
            });

            return rest;
        }
})();