(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TrocaFormController', TrocaFormController);

    function TrocaFormController($scope, toaster, Troca, Recompensa, Gamification) {
        var vm = this;

        if (typeof $scope.ngDialogData.troca != 'undefined') {
            vm.troca = angular.copy($scope.ngDialogData.troca);
        } else {
            vm.troca = {
                recompensa: false
            };
        }

        vm.imagem = null;
        vm.recompensas = {};
        vm.perfil = {};

        vm.load = function() {
            vm.loading = true;

            if (vm.troca.id) {
                Troca.get(vm.troca.id).then(function(troca) {
                    vm.troca = troca;
                    vm.loading = false;
                });
            }

            Gamification.get().then(function(perfil) {
                vm.perfil = perfil;
                vm.loading = false;
            });

            // #TODO: pegar infos do cara pra mostrar a grana vermelha e os itens destavados.. barra de rolagem na tabela
        };

        vm.load();

        vm.loadRecompensas = function() {
            Recompensa.getList().then(function(response) {
                vm.recompensas = response.data;
            });
        };

        vm.loadRecompensas();

        vm.setRecompensa = function(recompensa) {
            if (recompensa != false) {
                if (recompensa.valor > vm.perfil.moedas && recompensa.nivel > vm.perfil.nivel) {
                    toaster.pop('warning', 'Nível e moedas insuficientes', 'Você ainda não pode receber estas recompensas :\\');
                } else if (recompensa.valor > vm.perfil.moedas) {
                    toaster.pop('warning', 'Moedas insuficientes', 'Você ainda não tem as moedas necessárias :\\');
                } else if (recompensa.nivel > vm.perfil.nivel) {
                    toaster.pop('warning', 'Nível insuficiente', 'Você ainda não está no nível necessário :\\');
                } else {
                    vm.troca.recompensa = recompensa;
                }
            } else {
                vm.troca.recompensa = recompensa;
            }
        };

        /**
         * Salva a troca
         *
         * @return {void}
         */
        vm.save = function() {
            Troca.save(vm.troca, vm.troca.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Troca salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();