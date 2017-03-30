(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Imei', ImeiModel);

        function ImeiModel(Rest, Restangular) {
            return {
                baseUrl: 'estoque/imei',

                /**
                 * Generate imei list
                 *
                 * @return {Object}
                 */
                generate: function(listSize) {
                    return Restangular.one(
                        this.baseUrl + '/generate?listSize=' + listSize
                    ).get();
                }
            };
        }
})();
