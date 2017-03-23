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

                    return Restangular.one(this.baseUrl).customGET('grouped', params || null);
                },

                /**
                 * Set status ad to paused
                 *
                 * @return {Object}
                 */
                pause: function(id) {
                    return Restangular.one(this.baseUrl, id).one('pause').customPUT();
                },

                /**
                 * Set status ad to active
                 *
                 * @return {Object}
                 */
                activate: function(id) {
                    return Restangular.one(this.baseUrl, id).one('activate').customPUT();
                }
            });

            return rest;
        }
})();
