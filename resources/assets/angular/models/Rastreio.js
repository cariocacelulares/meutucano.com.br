(function() {
    'use strict';

    angular
        .module('MeuTucano') 
        .service('Rastreio', RastreioModel);

        function RastreioModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'rastreios';

            angular.extend(rest, {

                /**
                 * Retorna os rastreios importantes 
                 * 
                 * @param  {Object} params 
                 * @return {Object}        
                 */
                important: function(params) {
                    params = this.parseParams(params);
                    
                    return Restangular.all('rastreios/important').customGET("", params || {});
                }
            });

            return rest;
        }
})();
