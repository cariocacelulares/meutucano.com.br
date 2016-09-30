(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DashboardController', DashboardController);

    function DashboardController(Pedido) {
        var vm = this;

        vm.ordersDate = {};

        vm.chartOrdersStatus = {
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
            Pedido.totalOrdersDate().then(function(response) {
                vm.ordersDate = response;
            });

            Pedido.totalOrdersStatus().then(function(response) {
                vm.chartOrdersStatus.loading = false;

                vm.chartOrdersStatus.xAxis = {
                    categories: response.marketplaces
                };

                vm.chartOrdersStatus.series.push({
                    name: 'Cancelados',
                    data: response.cancelado,
                    color: '#F55753',
                    id: 'cancelados'
                });

                vm.chartOrdersStatus.series.push({
                    name: 'Pendentes',
                    data: response.pendente,
                    color: '#E6E6E6',
                    id: 'pendentes'
                });

                vm.chartOrdersStatus.series.push({
                    name: 'Pagos',
                    data: response.pago,
                    color: '#48B0F7',
                    id: 'pagos'
                });

                vm.chartOrdersStatus.series.push({
                    name: 'Enviados',
                    data: response.enviado,
                    color: '#437DA5',
                    id: 'enviados'
                });

                vm.chartOrdersStatus.series.push({
                    name: 'Entregues',
                    data: response.entregue,
                    color: '#10CFBD',
                    id: 'entregues'
                });

                var maior = 0;
                var total = 0;
                for (var i = 0; i < vm.chartOrdersStatus.series[0].data.length; i++) {
                    total = 0;

                    for (var k in vm.chartOrdersStatus.series) {
                        total += vm.chartOrdersStatus.series[k].data[i];
                    }

                    if (total > maior)
                        maior = total;
                }
                 vm.chartOrdersStatus.yAxis.max = maior;

            });
        };

        vm.load();
    }

})();