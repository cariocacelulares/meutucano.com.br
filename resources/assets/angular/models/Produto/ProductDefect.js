(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ProductDefect', ProductDefectModel);

        function ProductDefectModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'produto/defeito';

            return rest;
        }
})();
