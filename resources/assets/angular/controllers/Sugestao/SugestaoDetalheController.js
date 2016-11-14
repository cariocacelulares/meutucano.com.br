(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SugestaoDetalheController', SugestaoDetalheController);

    function SugestaoDetalheController($scope, toaster, Sugestao, Usuario) {
        var vm = this;

        vm.sugestao = angular.copy($scope.ngDialogData.sugestao);

        vm.arquivar = function() {
            vm.sugestao.status = 2;
            vm.save();
        };

        vm.aceitar = function() {
            vm.sugestao.status = 1;
            vm.save();
        };

        /**
         * Salva a sugestao
         *
         * @return {void}
         */
        vm.save = function() {
            Sugestao.save(vm.sugestao, vm.sugestao.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Sugestão / crítica salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();