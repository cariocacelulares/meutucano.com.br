(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('StockRemoval', StockRemovalModel);

        function StockRemovalModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'estoque/retirada';

            angular.extend(rest, {
                /**
                 * Closes stock removal
                 *
                 * @param  {int} id
                 * @return {Object}
                 */
                close: function(id) {
                    return Restangular.one(this.baseUrl + '/fechar', id).customPOST();
                },

                /**
                 * Refresh stock removal products status
                 *
                 * @param  {int} id
                 * @return {Object}
                 */
                refresh: function(id) {
                    return Restangular.one(this.baseUrl + '/atualizar', id).customGET();
                },
            });

            return rest;
        }
})();
