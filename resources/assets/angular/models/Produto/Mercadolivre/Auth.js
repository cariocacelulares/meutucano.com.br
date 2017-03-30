(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('MercadolivreAuth', MercadolivreAuthModel);

        function MercadolivreAuthModel(Rest, Restangular) {
            var rest = {};
            rest.baseUrl = 'mercadolivre/auth';

            angular.extend(rest, {
                authUrl: function() {
                    return Restangular.one(this.baseUrl).customGET('url', {});
                }
            });

            return rest;
        }
})();
