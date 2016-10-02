(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PerfilController', PerfilController);

    function PerfilController(Gamification) {
        var vm = this;

        vm.usuario = {};

        vm.grafico = {
            credits: false,
            loading: true,
            size: {
                height: 254,
            },
            options: {
                tooltip: {
                    followPointer: true,
                    formatter: function () {
                        return 'Dia ' + this.x + ': <b>' + this.y + '</b> tarefas';
                    }
                },
                chart: {
                    type: 'areaspline'
                },
                title: false,
                legend: false,
            },
            yAxis: {
                title: {
                    text: 'Tarefas'
                },
                min: 0
            },
            xAxis: {
                categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
            },
            series: []
        };

        vm.load = function() {
            vm.loading = true;

            Gamification.perfil().then(function(response) {
                vm.usuario = response.usuario;
                vm.grafico.series.push({
                    name: 'Tarefas',
                    data: response.grafico
                });

                vm.grafico.loading = false;
                vm.loading = false;
            });
        };

        vm.load();
    }

})();