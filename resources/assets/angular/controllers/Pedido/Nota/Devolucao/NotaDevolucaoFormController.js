(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('NotaDevolucaoFormController', NotaDevolucaoFormController);

    function NotaDevolucaoFormController($scope, toaster, ValidationErrors, NotaDevolucao) {
        var vm = this;

        vm.validationErrors = [];

        vm.products    = $scope.ngDialogData.products;
        vm.devolucao   = $scope.ngDialogData.devolucao;
        vm.cancelOrder = false;

        vm.save = function() {
            vm.validationErrors = [];

            NotaDevolucao.proceed(vm.devolucao.id, {
                'cancelOrder': vm.cancelOrder,
                'products'   : vm.products,
            }).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Informações salvadas com sucesso!');
                    $scope.closeThisDialog(true);
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        }
    }
})();
