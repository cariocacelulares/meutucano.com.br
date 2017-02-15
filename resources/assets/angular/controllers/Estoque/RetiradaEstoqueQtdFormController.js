(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RetiradaEstoqueQtdFormController', RetiradaEstoqueQtdFormController);

    function RetiradaEstoqueQtdFormController($scope, toaster, Produto) {
        var vm = this;

        vm.produto  = null;
        vm.produtos = [];

        /**
         * Busca pelo produto por sku e titulo
         *
         * @param  {string} term termo de Busca
         * @return {Object}      resultado da busca
         */
        vm.search = function(term) {
            if (term) {
                Produto.search(term).then(function(response) {
                    vm.produtos = response;
                });
            }
        };

        /**
         * Send imeis and get products
         */
        vm.save = function () {
            // #TODO: fazer a busca em alguma rota e retornar os dados que preciso
            ProductImei.parseImeis(vm.imeis).then(function (response) {
                toaster.pop('success', 'Sucesso!', 'Imeis foram adicionados!');
                $scope.closeThisDialog(response);
            });
        };
    }
})();
