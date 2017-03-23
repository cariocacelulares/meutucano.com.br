(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Marca', MarcaModel);

        function MarcaModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'marcas';

            angular.extend(rest, {
                all: function() {
                    return Restangular.all(rest.baseUrl).customGET('', {});
                }
            });

            return rest;
        }
})();
