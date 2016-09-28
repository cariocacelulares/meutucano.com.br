(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PiFormController', PiFormController);

    function PiFormController(Pi, $scope, toaster, $window, $httpParamSerializer, envService) {
        var vm = this;

        vm.pi = $scope.ngDialogData.pi;

        /**
         * Salva as informações da PI
         *
         * @return {void}
         */
        vm.save = function() {
            Pi.save(vm.pi, vm.pi.id || null).then(function() {
                $scope.closeThisDialog(true);
                toaster.pop('success', 'Sucesso!', 'Pedido de informação salvo com sucesso!');
            });
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