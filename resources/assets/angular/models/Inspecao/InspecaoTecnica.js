(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('InspecaoTecnica', InspecaoTecnicaModel);

        function InspecaoTecnicaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'inspecao_tecnica';

            return rest;
        }
})();
