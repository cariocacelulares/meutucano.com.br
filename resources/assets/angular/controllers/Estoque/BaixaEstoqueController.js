(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('BaixaEstoqueController', BaixaEstoqueController);

    function BaixaEstoqueController(ValidationErrors, StockIssue) {
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

                    vm.baixa = {
                        reason: 'Outro'
                    };
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
