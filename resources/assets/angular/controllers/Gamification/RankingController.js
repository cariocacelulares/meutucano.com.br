(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RankingController', RankingController);

    function RankingController(toaster, Gamification, Voto) {
        var vm = this;

        vm.dados = {};
        vm.meses = {};
        vm.countdown = {};

        var date = new Date();
        vm.mes = (date.getMonth() + 1) + '-' + date.getFullYear();

        vm.load = function(rankInfo) {
            if (typeof rankInfo == 'undefined') {
                rankInfo = false;
            }

            Gamification.ranking(vm.mes).then(function(response) {
                vm.dados = response;
            });

            if (rankInfo) {
                Gamification.rankInfo().then(function(response) {
                    vm.meses = response.list;
                    vm.countdown = response.countdown;
                });
            }
        };

        vm.load(true);

        vm.votar = function(candidato_id) {
            Voto.save({
                'candidato_id': candidato_id
            }).then(function(response) {
                if (typeof response.erro !== 'undefined') {
                    toaster.pop('error', 'Erro!', response.erro);
                } else {
                    toaster.pop('success', 'Voto confirmado!', '');
                    vm.load();
                }
            });
        };
    }

})();