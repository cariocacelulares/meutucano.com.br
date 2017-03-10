(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('BaixaEstoqueFormController', BaixaEstoqueFormController);

    function BaixaEstoqueFormController($state, toaster, ValidationErrors, StockIssue) {
        var vm = this;

        vm.validationErrors = [];

        vm.baixa = {
            reason: 'Outro'
        };

        vm.save = function() {
            vm.validationErrors = [];

            StockIssue.save(vm.baixa).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Baixa realizada com sucesso!');
                    $state.go('app.estoque.baixa.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
