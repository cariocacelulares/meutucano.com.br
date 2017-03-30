(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EditarController', EditarController);

    function EditarController(Restangular, $rootScope, $scope, toaster, ValidationErrors, Rastreio) {
        var vm = this;

        vm.validationErrors = [];

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.rastreio = $scope.ngDialogData.rastreio;
        } else {
            vm.rastreio = {};
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            vm.validationErrors = [];

            var data = vm.rastreio.data_envio_readable;
            data = data.split('/'); // d/m/Y
            data = new Date(data[2], (parseInt(data[1]) - 1), data[0]);
            data = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
            vm.rastreio.data_envio = data;

            Rastreio.save(vm.rastreio, vm.rastreio.id || null).then(
                function() {
                    $scope.closeThisDialog(true);
                    toaster.pop('success', 'Sucesso!', 'Pedido editado com sucesso!');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
