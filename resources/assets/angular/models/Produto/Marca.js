(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Marca', MarcaModel);

        function MarcaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'marcas';

            return rest;
        }
})();
