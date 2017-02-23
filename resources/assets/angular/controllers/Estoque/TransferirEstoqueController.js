(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TransferirEstoqueController', TransferirEstoqueController);

    function TransferirEstoqueController($scope, toaster, ValidationErrors, ProductStock) {
        var vm = this;
        vm.validationErrors = [];

        vm.loading       = false;
        vm.productStock  = $scope.ngDialogData.productStock;
        vm.productStocks = [];

        vm.destination = '';
        vm.qty         = 0;
        vm.imeis       = [];

        vm.load = function () {
            vm.loading = true;

            ProductStock.transferOptions(vm.productStock.id).then(function(response) {
                vm.productStocks = response;
                vm.loading       = false;
            });
        };

        vm.load();

        /**
         * Do the transfer and close the modal
         */
        vm.save = function() {
            ProductStock.transfer(
                vm.productStock.id,
                vm.destination,
                vm.qty,
                vm.imeis
            ).then(
                function (response) {
                    if (response) {
                        toaster.pop('success', '', 'Transferência realizada com sucesso!');
                        $scope.closeThisDialog(true);
                    } else {
                        toaster.pop('error', '', 'Não foi possível realizar a transferência!');
                    }
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
