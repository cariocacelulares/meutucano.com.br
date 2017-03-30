(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ConsultarImeiController', ConsultarImeiController);

    function ConsultarImeiController($state, $stateParams, ProductImei) {
        var vm = this;

        vm.loading  = false;
        vm.imei     = $stateParams.imei || null;
        vm.acoes    = [];
        vm.info     = {};
        vm.searched = false;

        vm.load = function() {
            vm.loading = true;

            $state.go(
                'app.estoque.imei.consultar',
                {imei: vm.imei},
                {notify: false}
            );

            ProductImei.history(vm.imei).then(function (response) {
                vm.acoes    = response.history;
                vm.info     = response.info;
                vm.loading  = false;
                vm.searched = true;
            });
        }

        if (vm.imei) {
            vm.load();
        }

        /**
         * On change imei
         */
        vm.changed = function() {
            vm.acoes    = [];
            vm.info     = {};
            vm.searched = false;
        }

        /**
         * Get icon by model
         *
         * @param  {string} model
         * @return {string}
         */
        vm.getIcon = function(model) {
            switch (model) {
                case 'ProductImei' : return 'barcode';
                case 'Issue'       : return 'arrow-down';
                case 'Defect'      : return 'bug';
                case 'Removal'     : return 'cart-arrow-down';
                case 'Pedido'      : return 'cubes';
                case 'Entry'       : return 'arrow-up';
            }

            return 'cube';
        }
    }
})();
