(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('StockEntry', StockEntryModel);

        function StockEntryModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque/entrada';

            angular.extend(rest, {
                /**
                 * Confirm entry
                 *
                 * @param  {int} id
                 * @return {Object}
                 */
                confirm: function(id) {
                    return Restangular.one(this.baseUrl + '/confirm', id).customPOST();
                }
            });

            return rest;
        }
})();
