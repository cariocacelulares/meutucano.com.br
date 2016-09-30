(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DashboardController', DashboardController);

    function DashboardController(RastreioHelper, Monitorado, Pedido) {
        var vm = this;

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        // Dados dos pedidos
        vm.ordersDate = {};

        // Configuração do gráfico com marketplaces
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

        // Configuração do gráfico por meses
        vm.chartOrders = {
            mes: null,
            ano: null,
            credits: false,
            loading: true,
            size: {
                height: 276,
            },
            options: {
                tooltip: {
                    followPointer: true,
                    shared: true,
                    headerFormat: '<span style="font-size: 10px">Dia {point.key}</span><br/>'
                },
                title: false,
                legend: false,
            },
            yAxis: {
                title: false,
                min: 0
            },
            xAxis: {
                categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
            },
            series: []
        };

        /**
         * Carrega os dados dos pedidos
         */
        vm.loadTotalOrdersDate = function() {
            Pedido.totalOrdersDate().then(function(response) {
                vm.ordersDate = response;
            });
        };

        /**
         * Carrega os pedidos por marketplaces por status
         */
        vm.loadTotalOrdersStatus = function() {
            vm.chartOrdersStatus.loading = true;

            Pedido.totalOrdersStatus().then(function(response) {
                vm.chartOrdersStatus.loading = false;

                vm.chartOrdersStatus.xAxis = {
                    categories: response.marketplaces
                };

                vm.chartOrdersStatus.series = [];

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

        /**
         * Carrega os dados do gráfico por mês
         *
         * @param  {bool} clear limpar meses, manter apens o primeiro
         */
        vm.loadTotalOrders = function(clear) {
            vm.chartOrders.loading = true;

            if (clear === true) {
                vm.chartOrders.mes = null;
                vm.chartOrders.ano = null;
            }

            Pedido.totalOrders(vm.chartOrders.mes, vm.chartOrders.ano).then(function(response) {
                if (response.mes == 1) {
                    vm.chartOrders.mes = 12;
                    vm.chartOrders.ano = response.ano - 1;
                } else {
                    vm.chartOrders.mes = response.mes - 1;
                    vm.chartOrders.ano = response.ano;
                }

                // Ajusta o tamanho máximo do gráfico
                if (response.data.length > vm.chartOrders.xAxis.categories.length) {
                    for (var i = vm.chartOrders.xAxis.categories.length; i < response.data.length; i++) {
                        vm.chartOrders.xAxis.categories.push(i);
                    }
                }

                vm.chartOrders.loading = false;

                if (clear === true) {
                    vm.chartOrders.series = [];
                    vm.chartOrders.options.legend = false;
                }

                vm.chartOrders.series.push({
                    name: response.name,
                    data: response.data
                });

                if (vm.chartOrders.series.length > 1) {
                    vm.chartOrders.options.legend = {};
                }
            });
        };

        /**
         * Carrega os rastreios monitorados
         */
        vm.loadRastreios = function() {
            vm.loading = true;

            vm.rastreiosMonitorados = {};

            Monitorado.simpleList().then(function(response) {
                vm.rastreiosMonitorados = response;
                vm.loading = false;
            });
        };

        /**
         * Carrega tudo
         */
        vm.load = function() {
            vm.loadTotalOrdersDate();
            vm.loadTotalOrdersStatus();
            vm.loadTotalOrders();
            vm.loadRastreios();
        };

        vm.load();
    }

})();