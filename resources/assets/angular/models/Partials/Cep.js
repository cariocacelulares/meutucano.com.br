(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Cep', CepModel);

        function CepModel(Restangular) {
            return {
                baseUrl: 'cep',

                /**
                 * Get address by cep
                 *
                 * @param  {string} cep onlynumbers
                 * @return {Object}
                 */
                getAddress: function(cep) {
                    return Restangular.one(this.baseUrl, cep).get();
                }
            };
        }
})();
