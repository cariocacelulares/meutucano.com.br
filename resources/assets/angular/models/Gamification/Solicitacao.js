(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Solicitacao', SolicitacaoModel);

        function SolicitacaoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'gamification/solicitacao';

            angular.extend(rest, {
                solicitar: function(params) {
                    return Restangular.all(this.baseUrl + '/solicitar').post(params);
                },

                getList: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all(this.baseUrl + '/list').customGET("", params || {});
                }
            });

            return rest;
        }
})();
