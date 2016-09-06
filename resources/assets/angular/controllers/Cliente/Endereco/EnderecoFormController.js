(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EnderecoFormController', EnderecoFormController);

    function EnderecoFormController(ClienteEndereco, $scope, toaster) {
        var vm = this;

        vm.endereco = angular.copy($scope.ngDialogData.endereco);

        /**
         * Salva as informações da endereco
         *
         * @return {void}
         */
        vm.save = function() {
            ClienteEndereco.save(vm.endereco, vm.endereco.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Endereço salvo com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();