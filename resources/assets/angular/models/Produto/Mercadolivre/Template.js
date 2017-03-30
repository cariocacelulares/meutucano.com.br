(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Template', TemplateModel);

        function TemplateModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'mercadolivre/templates';

            angular.extend(rest, {
                all: function() {
                    return Restangular.all(this.baseUrl).customGET('', {});
                }
            });

            return rest;
        }
})();
