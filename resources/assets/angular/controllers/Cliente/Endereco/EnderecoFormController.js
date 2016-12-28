(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EnderecoFormController', EnderecoFormController);

    function EnderecoFormController(Endereco, $scope, toaster, ValidationErrors) {
        var vm = this;

        vm.endereco = angular.copy($scope.ngDialogData.endereco);
        vm.validationErrors = [];

        /**
         * Salva as informações da endereco
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];

            Endereco.save(vm.endereco, vm.endereco.id || null).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Endereço salvo com sucesso!');
                    $scope.closeThisDialog(true);
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
