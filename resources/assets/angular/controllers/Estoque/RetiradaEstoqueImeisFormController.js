(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueImeisFormController', RetiradaEstoqueImeisFormController);

    function RetiradaEstoqueImeisFormController($scope, toaster, ProductImei, StockRemovalProduct) {
        var vm = this;

        var defaultItem = {
            imei: '',
            icon: 'ellipsis-h',
            message: 'Verificando'
        };

        vm.imeis = [angular.copy(defaultItem)];

        vm.focusLast = function() {
            setTimeout(function () {
                var inputs = document.getElementsByClassName('input-imei');
                inputs = angular.element(inputs);
                inputs[inputs.length - 1].focus();
            }, 200);
        };

        vm.focusLast();

        vm.checkImei = function(item) {
            if (item.verified !== true && item.imei) {
                item.icon = 'circle-o-notch fa-spin';

                StockRemovalProduct.verifyImei(item.imei).then(function (response) {
                    item.icon     = response.icon;
                    item.message  = response.message;
                    item.verified = true;
                });
            }
        };

        vm.addImei = function(event) {
            if ((event.keyCode === 13 || event.key == 'Enter') && event.target.value) {
                vm.imeis.push(angular.copy(defaultItem));
                vm.focusLast();
            }
        };

        vm.removeImei = function(index) {
            if (index === 0 || index === (vm.imeis.length - 1)) {
                vm.imeis[index] = {};
            } else {
                delete vm.imeis[index];
            }
        };

        /**
         * Send imeis and get products
         */
        vm.save = function () {
            ProductImei.parseImeis(vm.imeis).then(function (response) {
                toaster.pop('success', 'Sucesso!', 'Imeis foram adicionados!');
                $scope.closeThisDialog(response);
            });
        };
    }
})();
