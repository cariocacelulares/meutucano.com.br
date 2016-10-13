(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SugestaoFormController', SugestaoFormController);

    function SugestaoFormController($scope, toaster, Sugestao, Usuario) {
        var vm = this;

        vm.pessoas = {};
        vm.sugestao = {};

        vm.load = function() {
            Usuario.getList().then(function(response) {
                vm.pessoas = response;
            });
        };

        vm.load();

        /**
         * Salva a sugestao
         *
         * @return {void}
         */
        vm.save = function() {
            Sugestao.save(vm.sugestao).then(function() {
                toaster.pop('success', 'Sucesso!', 'Sugestão / crítica enviada com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();