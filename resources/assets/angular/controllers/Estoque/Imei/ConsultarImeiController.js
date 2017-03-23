(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ConsultarImeiController', ConsultarImeiController);

    function ConsultarImeiController(ProductImei) {
        var vm = this;

        vm.loading = false;
        vm.imei    = null;
        vm.acoes   = [];

        vm.load = function() {
            vm.loading = true;

            ProductImei.history(vm.imei).then(function (response) {
                vm.acoes = response;
                vm.loading = false;
            });
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
            }

            return 'cube';
        }
    }
})();
