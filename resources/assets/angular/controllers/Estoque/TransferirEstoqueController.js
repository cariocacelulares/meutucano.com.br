(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TransferirEstoqueController', TransferirEstoqueController);

    function TransferirEstoqueController($stateParams) {
        var vm = this;

        vm.loading       = false;
        vm.productStock  = $stateParams.productStock;
        vm.productStocks = [];

        vm.load = function () {
            vm.loading = true;

            ProductStock.transferOptions(vm.productStock.id).then(function(response) {
                vm.productStocks = response;
                vm.loading       = false;
            });
        };

        vm.load();

        vm.save = function() {
            ProductStock.transfer().then(function (response) {

            });
        };
    }
})();
