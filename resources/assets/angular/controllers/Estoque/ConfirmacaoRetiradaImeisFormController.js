(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ConfirmacaoRetiradaImeisFormController', ConfirmacaoRetiradaImeisFormController);

    function ConfirmacaoRetiradaImeisFormController($scope, toaster, ProductImei, StockRemovalProduct) {
        var vm = this;

        vm.removal_id = $scope.ngDialogData.removal_id;

        var defaultItem = {
            imei: '',
            icon: 'ellipsis-h',
            message: 'Aguardando entrada do usuário'
        };

        vm.loading    = false;
        vm.registered = [];
        vm.imeis      = [angular.copy(defaultItem)];

        /**
         * Focus the last input-imei
         *
         * @return {void}
         */
        vm.focusLast = function() {
            setTimeout(function () {
                var inputs = document.getElementsByClassName('input-imei');
                inputs = angular.element(inputs);
                inputs[inputs.length - 1].focus();
            }, 200);
        };

        vm.focusLast();

        /**
         * Verify if imei is ok to remove, this is trigger by blur input
         *
         * @param  {Object} item
         * @return {void}
         */
        vm.checkImei = function(item) {
            if (item.verified !== true && item.imei) {
                item.icon = 'circle-o-notch fa-spin';

                vm.loading = true;
                StockRemovalProduct.checkImei(item.imei, vm.removal_id).then(function (response) {
                    item.icon     = response.icon;
                    item.message  = response.message;
                    item.ok       = response.ok;
                    item.verified = true;

                    vm.loading = false;
                });
            }
        };

        /**
         * Add new black imei to the list and focus it
         * If was registered, re-verify
         *
         * @param {void} event
         */
        vm.addImei = function(event, lastIndex) {
            // if pressed key is enteder
            if ((event.keyCode === 13 || event.key == 'Enter')) {
                // if imei is not blank
                if (event.target.value && vm.imeis[lastIndex].imei) {
                    // if imei not is registered in this list
                    if (vm.registered.indexOf(event.target.value) < 0) {
                        vm.registered[lastIndex] = vm.imeis[lastIndex].imei;
                        vm.imeis.push(angular.copy(defaultItem));
                        vm.focusLast();
                    } else {
                        // if imei is registered in this list
                        vm.removeImei(lastIndex);

                        var index = vm.registered.indexOf(event.target.value);
                        vm.imeis[index].verified = false;
                        vm.checkImei(vm.imeis[index]);
                    }
                }
            }
        };

        /**
         * Remove imei from de list, when it is the last or first, put it blank
         *
         * @param  {int} index
         * @return {void}
         */
        vm.removeImei = function(index) {
            if (index === 0 || index === (vm.imeis.length - 1)) {
                vm.imeis[index] = angular.copy(defaultItem);
            } else {
                delete vm.imeis[index];
                delete vm.registered[index];
            }
        };

        /**
         * Send imeis
         */
        vm.save = function () {
            if (vm.loading) {
                return;
            }

            var imeis = [];

            for (var key in vm.imeis) {
                if (vm.imeis[key].ok === true) {
                    imeis.push(vm.imeis[key]);
                }
            }

            $scope.closeThisDialog({ imeis: imeis });
        };
    }
})();
