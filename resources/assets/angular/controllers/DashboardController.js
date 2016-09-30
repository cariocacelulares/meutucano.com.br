(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DashboardController', DashboardController);

    function DashboardController(Pedido) {
        var vm = this;

        vm.chart = {
            credits: false,
            loading: true,
            size: {
                height: 276,
            },
            options: {
                title: false,
                legend: false,
                chart: {
                    type: 'bar'
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        allowPointSelect: true
                    }
                }
            },
            yAxis: {
                title: false
            },
            xAxis: {},
            series: []
        };

        vm.load = function() {
            Pedido.grafico().then(function(response) {
                vm.chart.loading = false;

                vm.chart.xAxis = {
                    categories: response.marketplaces
                };

                vm.chart.series.push({
                    name: 'Cancelados',
                    data: response.cancelado,
                    color: '#F55753',
                    id: 'cancelados'
                });

                vm.chart.series.push({
                    name: 'Pendentes',
                    data: response.pendente,
                    color: '#E6E6E6',
                    id: 'pendentes'
                });

                vm.chart.series.push({
                    name: 'Pagos',
                    data: response.pago,
                    color: '#48B0F7',
                    id: 'pagos'
                });

                vm.chart.series.push({
                    name: 'Enviados',
                    data: response.enviado,
                    color: '#437DA5',
                    id: 'enviados'
                });

                vm.chart.series.push({
                    name: 'Entregues',
                    data: response.entregue,
                    color: '#10CFBD',
                    id: 'entregues'
                });

                var maior = 0;
                var total = 0;
                for (var i = 0; i < vm.chart.series[0].data.length; i++) {
                    total = 0;

                    for (var k in vm.chart.series) {
                        total += vm.chart.series[k].data[i];
                    }

                    if (total > maior)
                        maior = total;
                }
                 vm.chart.yAxis.max = maior;

            });
        };

        vm.load();
    }

})();