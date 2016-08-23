(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $stateParams, Restangular, Linha) {
        var vm = this;
  
        vm.linha_id = $stateParams.id;
        vm.linha    = {};
        vm.loading   = false;


        vm.load = function() {
            vm.linha  = {}; 
            vm.loading = true;

            Linha.get(vm.linha_id).then(function(linha) {
                vm.linha  = linha;
                vm.loading = false;
            });
        };
        vm.load();
    }
})();