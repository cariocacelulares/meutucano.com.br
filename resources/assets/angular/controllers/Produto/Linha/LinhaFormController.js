(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $state, $stateParams, Restangular, Linha, toaster, ngDialog) {
        var vm = this;

        vm.linha = {
            id: $stateParams.id || null,
            atributos: [],
            removidos: {
                atributos: [],
                opcoes: []
            }
        };

        vm.load = function() {
            vm.loading = true;

            Linha.get(vm.linha.id).then(function(linha) {
                vm.linha = linha;
                vm.loading = false;

                vm.linha.removidos = {
                    atributos: [],
                    opcoes: []
                };
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
            vm.linha.removidos.atributos.push(
                vm.linha.atributos[index].id
            );

            vm.linha.atributos.splice(index, 1);
        };

        /**
         * Quando uma tag é removida
         *
         * @return {void}
         */
        vm.removeTag = function(tag) {
            vm.linha.removidos.opcoes.push(tag.id);
        };

        /**
         * Quando di que a tag é invalda
         * Checa e entao adiciona
         *
         * @return {void}
         */
        vm.checkTag = function(tag, index) {
            if (tag) {
                tag.id = null;
                vm.linha.atributos[index].opcoes.push(tag);
            }
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