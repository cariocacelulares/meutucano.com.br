(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $state, $stateParams, Restangular, Linha, toaster, ngDialog) {
        var vm = this;

        vm.linha = {
            id: $stateParams.id || null,
            atributos: []
        };

        vm.load = function() {
            vm.loading = true;

            Linha.get(vm.linha.id).then(function(linha) {
                vm.linha = linha;

                var aux = [];
                for (var i in vm.linha.atributos) {
                    if (vm.linha.atributos[i].opcoes.length) {
                        for (var j in vm.linha.atributos[i].opcoes) {
                            aux.push(vm.linha.atributos[i].opcoes[j].valor);
                        }
                        vm.linha.atributos[i].opcoes = aux;
                    }
                }
                aux = null;

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
            vm.linha.atributos.unshift({});
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

        /**
         * Exclui a linha
         *
         * @return {void}
         */
        vm.destroy = function() {
            Linha.delete(vm.linha.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Linha excluida com sucesso!');
                $state.go('app.produtos.linhas.index');
            });
        };
    }
})();