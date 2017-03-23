(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Category', CategoryModel);

        function CategoryModel(Rest, Restangular) {
            var rest = {};
            rest.baseUrl = 'mercadolivre/categories';

            angular.extend(rest, {
                all: function(id) {
                    return Restangular.one(this.baseUrl, id).customGET('', {});
                },

                sub: function(id) {
                    return Restangular.one(this.baseUrl + '/sub', id).customGET('', {});
                },

                predict: function(title) {
                    return Restangular.all(this.baseUrl + '/predict').customGET('', {
                        title: title
                    });
                }
            });

            return rest;
        }
})();
