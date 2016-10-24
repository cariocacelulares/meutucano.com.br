(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('rastreiosMonitorados', {
            bindings: {
                title: '@'
            },
            templateUrl: 'views/components/dashboard/rastreios-monitorados.html',
            controller: function($rootScope, RastreioHelper, Monitorado, Pedido) {
                var vm = this;

                /**
                 * @type {Object}
                 */
                vm.rastreioHelper = RastreioHelper.init(vm);

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

                vm.load = function() {
                    var role = 'atendimento';
                    angular.forEach($rootScope.currentUser.roles, function(role) {
                        if (role.name == role) {
                            vm.loadRastreios();
                        }
                    });
                };

                vm.load();
            }
        });

})();