(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Rest', function (Restangular) {
            return {
                baseUrl: '',

                getList: function(params) {
                    if (params.hasOwnProperty('join')) {
                        params.join = JSON.stringify(params.join);
                    }

                    if (params.hasOwnProperty('filter')) {
                        params.filter = JSON.stringify(params.filter);
                    }

                    if (params.hasOwnProperty('fields')) {
                        params.fields = JSON.stringify(params.fields);
                    }

                    return Restangular.all(this.baseUrl).customGET("", params || {});
                },

                get: function(id) {
                    return Restangular.one(this.baseUrl, id).get();
                }
            };
    });
})();
