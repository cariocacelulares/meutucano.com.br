(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RelatorioRetiradaEstoqueController', RelatorioRetiradaEstoqueController);

    function RelatorioRetiradaEstoqueController($window, $location, $anchorScroll, $httpParamSerializer, envService, toaster, Restangular) {
        var vm = this;

        vm.result = false;
        vm.labels = [];
        vm.totalResults = 0;

        // Colhe os parametros e gera o resultado
        vm.gerar = function(tipo) {
            if (tipo) {
                var auth = {
                    token: localStorage.getItem('satellizer_token')
                };

                $window.open(envService.read('apiUrl') + '/relatorios/retirada-estoque/' + tipo + '?params=' + JSON.stringify(vm.filter) + '&' + $httpParamSerializer(auth), 'relatorio-retirada-estoque');
            } else {
                vm.result = false;
                vm.labels = [];
                Restangular.one('relatorios/retirada-estoque', tipo || null).customPOST(vm.filter).then(function(response) {
                    vm.result = Restangular.copy(response, vm.result);
                    vm.result = angular.copy(response, vm.result);

                    vm.totalResults = vm.result.length;
                    vm.totalResults = vm.totalResults + ((vm.totalResults == 1) ? ' registro encontrado' : ' registros encontrados');
                    for (var key in vm.result[0]) {
                        vm.labels.push(key);
                    }

                    $location.hash('relatorio-resultado');
                    $anchorScroll();
                });
            }
        };

        // valores padrão
        vm.defaults = function() {
            vm.result = false;
            vm.labels = [];
            vm.filter = {
                'estado'             : '',
                'pedidos.marketplace': [],
                'pedidos.status'     : []
            };

            vm.list = {};

            vm.list['pedidos.status'] = {
                0: 'Pendente',
                1: 'Pago',
                2: 'Enviado',
                3: 'Entregue',
                5: 'Cancelado'
            };

            vm.list['pedidos.marketplace'] = {
                b2w         : 'B2W',
                cnova       : 'CNOVA',
                mercadolivre: 'Mercado Livre',
                walmart     : 'Walmart',
                site        : 'Site'
            };

            vm.setFilters = {
                'pedidos.status'     : '',
                'pedidos.marketplace': ''
            };
        };

        // limpa os campos
        vm.limpar = function() {
            vm.defaults();
            $location.hash('');
            $anchorScroll();
        };

        // carrega de inicio
        vm.load = function() {
            vm.defaults();
        };

        vm.load();

        // adiciona um filtro
        vm.addFilter = function(key) {
            console.log(vm.filter[key]);
            if (vm.filter[key].indexOf(vm.setFilters[key]) < 0) {
                if (typeof vm.filter[key] == 'array' || typeof vm.filter[key] == 'object') {
                    vm.filter[key].push(vm.setFilters[key]);
                } else {
                    vm.filter[key] = vm.setFilters[key];
                }

                vm.setFilters[key] = '';
            }
        };

        // remove um filtro
        vm.removeFilter = function(key, index) {
            delete vm.filter[key][index];
            console.log(vm.filter[key]);
        };
    }

})();
