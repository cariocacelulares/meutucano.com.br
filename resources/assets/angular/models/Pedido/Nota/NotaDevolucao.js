(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('NotaDevolucao', NotaDevolucaoModel);

        function NotaDevolucaoModel(Rest, Restangular) {
            var rest     = angular.copy(Rest);
            rest.baseUrl = 'notas/devolucao';

            angular.extend(rest, {
                /**
                 * Proceed with upload (register defects and order status)
                 *
                 * @param  {int} id         devolucao id
                 * @param  {array} params
                 * @return {Object}
                 */
                proceed: function(id, params) {
                    params = this.parseParams(params);

                    return Restangular.one(this.baseUrl + '/proceed/' + id).customPOST(params);
                }
            });

            return rest;
        }
})();
