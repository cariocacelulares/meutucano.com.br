(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('chartTotalOrders', {
            bindings: {
                title: '@'
            },
            templateUrl: 'views/components/dashboard/chart-total-orders.html',
            controller: function(Pedido) {
                var vm = this;

                vm.chartOrders = {
                    mes: null,
                    ano: null,
                    credits: false,
                    loading: true,
                    size: {
                        height: 276,
                    },
                    options: {
                        exporting: { enabled: false },
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

                vm.load = function() {
                    vm.loadTotalOrders();
                };

                vm.load();
            }
        });

})();