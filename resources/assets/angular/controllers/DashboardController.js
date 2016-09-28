(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DashboardController', DashboardController);

    function DashboardController(Pedido) {
        var vm = this;

        vm.chart = {
            options: {
                chart: {
                    type: 'bar'
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        allowPointSelect: true,
                        states: {
                            select: {
                                color: null,
                                borderWidth:5,
                                borderColor:'Blue'
                            }
                        }
                    }
                }
            },
            title: {
                text: 'Pedidos'
            },
            yAxis: {
                min: 0
            },
            legend: {
                enabled: false
            },
            credits: { enabled: false },
            loading: true
        };

        vm.load = function() {
            Pedido.grafico().then(function(response) {
                vm.chart.loading = false;

                vm.chart.xAxis = {
                    categories: response.marketplaces
                };

                vm.chart.series = [
                    {
                        name: 'Cancelados',
                        data: response.cancelado,
                        color: '#F55753',
                        id: 'cancelados'
                    },
                    {
                        name: 'Pendentes',
                        data: response.pendente,
                        color: '#E6E6E6',
                        id: 'pendentes'
                    },
                    {
                        name: 'Pagos',
                        data: response.pago,
                        color: '#48B0F7',
                        id: 'pagos'
                    },
                    {
                        name: 'Enviados',
                        data: response.enviado,
                        color: '#437DA5',
                        id: 'enviados'
                    },
                    {
                        name: 'Entregues',
                        data: response.entregue,
                        color: '#10CFBD',
                        id: 'entregues'
                    }
                ];
            });
        };

        vm.load();
    }

})();