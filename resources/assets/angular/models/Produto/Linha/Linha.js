(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Linha', LinhaModel);

        function LinhaModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'linhas';

            angular.extend(rest, {
                all: function() {
                    return Restangular.all(this.baseUrl).customGET('', {});
                }
            });

            return rest;
        }
})();
