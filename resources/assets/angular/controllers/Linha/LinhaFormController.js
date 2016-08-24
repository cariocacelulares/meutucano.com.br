(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $state, $stateParams, Restangular, Linha, toaster) {
        var vm = this;
  
        vm.linha           = {
            id: $stateParams.id || null,
            atributos: []
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
         * Adiciona um atributo
         * 
         * @return {void} 
         */
        vm.addAttribute = function() { 
            vm.linha.atributos.push(vm.novoAtributo);
            vm.novoAtributo = {};
        };

        /**
         * Remove um atributo
         * 
         * @return {void} 
         */
        vm.removeAttribute = function(index) { 
            vm.linha.atributos.splice(index, 1);
        };

        /**
         * Salva a linha
         * 
         * @return {void} 
         */
        vm.save = function() {
            Linha.save(vm.linha, vm.linha.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Linha salva com sucesso!');
                $state.go('app.produtos.linhas.index');
            });
        };
    }
})();