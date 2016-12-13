(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AllnationProductFormController', AllnationProductFormController);

    function AllnationProductFormController($stateParams, AllnationProduct) {
        var vm = this;

        vm.load = function() {
            vm.loading = true;

            AllnationProduct.get($stateParams.id).then(function(formData) {
                vm.formData = formData;
                vm.loading  = false;
            });
        };
        vm.load();

        /**
         * Salva o produto
         *
         * @return {void}
         */
        vm.save = function() {
            AllnationProduct.createProduct(vm.formData).then(function(response) {
                console.log(response);
            });
        };
    }
})();
