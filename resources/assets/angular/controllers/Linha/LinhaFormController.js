(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $stateParams, Restangular, Linha, toaster) {
        var vm = this;
  
        vm.loading = false;
        vm.linha   = {
            id: $stateParams.id || null
        };

        vm.load = function() {
            vm.loading = true;

            Linha.get(vm.linha.id).then(function(linha) {
                vm.linha   = linha;
                vm.loading = false;
            });
        };

        if (vm.linha.id) {
            vm.load();
        }

        /**
         * Salva a linha
         * 
         * @return {void} 
         */
        vm.save = function() {
            Linha.save(vm.linha, vm.linha.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Linha salva com sucesso!');
            });
        };
    }
})();