(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Marca', LinhaModel);

        function LinhaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'marcas';

            return rest;
        }
})();
