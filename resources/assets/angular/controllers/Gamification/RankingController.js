(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RankingController', RankingController);

    function RankingController(toaster, Gamification, Voto) {
        var vm = this;

        vm.dados = {};

        vm.load = function() {
            Gamification.ranking().then(function(response) {
                vm.dados = response;
            });
        };

        vm.load();

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