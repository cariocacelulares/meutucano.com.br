(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DashboardController', DashboardController);

    function DashboardController(RastreioHelper, Monitorado) {
        var vm = this;

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        vm.load = function() {
            vm.loadRastreios();
        };

        vm.loadRastreios = function() {
            vm.loading = true;

            vm.rastreiosMonitorados = {};

            Monitorado.simpleList().then(function(response) {
                vm.rastreiosMonitorados = response;
                vm.loading = false;
            });
        };

        vm.load();
    }

})();