(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Produto', ProdutoModel);

        function ProdutoModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'produtos';

            return rest;
        }
})();