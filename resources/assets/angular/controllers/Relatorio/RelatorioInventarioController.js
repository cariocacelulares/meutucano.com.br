(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RelatorioInventarioController', RelatorioInventarioController);

    function RelatorioInventarioController($window, $location, $anchorScroll, $httpParamSerializer, envService, Restangular, Stock) {
        var vm = this;

        vm.stocks = [];

        vm.defaults = function() {
            vm.result       = false;
            vm.totalResults = 0;
            vm.filter       = {
                stock: 'default'
            };
        }

        vm.load = function() {
            vm.defaults();

            Stock.getList().then(function (response) {
                vm.stocks = response.data;
            });
        };

        vm.load();

        // Colhe os parametros e gera o resultado
        vm.gerar = function(tipo) {
            if (tipo) {
                var auth = {
                    token: localStorage.getItem('satellizer_token')
                };

                $window.open(
                    envService.read('apiUrl')
                        + '/relatorios/inventario/'
                        + tipo
                        + '?params='
                        + JSON.stringify(vm.filter)
                        + '&'
                        + $httpParamSerializer(auth),
                    'relatorio-inventario'
                );
            } else {
                vm.result = false;
                Restangular.one('relatorios/inventario', tipo || null).customPOST(vm.filter).then(function(response) {
                    vm.result       = Restangular.copy(response, vm.result);
                    vm.result       = angular.copy(response, vm.result);
                    vm.totalResults = vm.result.length + ((vm.result.length == 1) ? ' registro encontrado' : ' registros encontrados');

                    $location.hash('relatorio-resultado');
                    $anchorScroll();
                });
            }
        };

        // limpa os campos
        vm.limpar = function() {
            $location.hash('');
            vm.defaults();
            $anchorScroll();
        };
    }

})();
