(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EnderecoFormController', EnderecoFormController);

    function EnderecoFormController(Endereco, $scope, toaster) {
        var vm = this;

        vm.endereco = angular.copy($scope.ngDialogData.endereco);

        /**
         * Salva as informações da endereco
         *
         * @return {void}
         */
        vm.save = function() {
            Endereco.save(vm.endereco, vm.endereco.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Endereço salvo com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();