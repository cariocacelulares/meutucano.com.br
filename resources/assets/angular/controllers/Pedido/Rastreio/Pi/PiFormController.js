(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PiFormController', PiFormController);

    function PiFormController(Pi, $scope, toaster, $window, $httpParamSerializer, ValidationErrors, envService) {
        var vm = this;

        vm.validationErrors = [];

        vm.pi = $scope.ngDialogData.pi;

        /**
         * Salva as informações da PI
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];

            var data = vm.pi.data_pagamento_readable;
            data = data.split('/'); // d/m/Y
            data = new Date(data[2], (parseInt(data[1]) - 1), data[0]);
            data = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
            vm.pi.data_pagamento = data;

            Pi.save(vm.pi, vm.pi.id || null).then(
                function() {
                    $scope.closeThisDialog(true);
                    toaster.pop('success', 'Sucesso!', 'Pedido de informação salvo com sucesso!');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Open PI
         */
        vm.openPi = function() {
            var auth = {
                token: localStorage.getItem("satellizer_token")
            };

            $window.open(envService.read('apiUrl') + '/rastreios/pi/' + vm.pi.rastreio_id + '?' + $httpParamSerializer(auth));
        };
    }

})();
