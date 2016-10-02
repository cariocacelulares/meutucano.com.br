(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Conquista', ConquistaModel);

        function ConquistaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'gamification/conquistas';

            return rest;
        }
})();
