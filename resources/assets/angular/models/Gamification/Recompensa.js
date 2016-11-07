(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Recompensa', RecompensaModel);

        function RecompensaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'gamification/recompensas';

            return rest;
        }
})();
