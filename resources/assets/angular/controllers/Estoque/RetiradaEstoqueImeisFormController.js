(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueImeisFormController', RetiradaEstoqueImeisFormController);

    function RetiradaEstoqueImeisFormController($scope, toaster, ProductImei) {
        var vm = this;

        vm.imeis = null;

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
