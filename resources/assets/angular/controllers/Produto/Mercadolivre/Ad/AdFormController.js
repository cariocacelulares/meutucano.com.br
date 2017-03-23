(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AdFormController', AdFormController);

    function AdFormController($state, $stateParams, toaster, Ad, Produto, Template, Category, ValidationErrors) {
        var vm        = this;
        vm.productSku = parseInt($stateParams.sku);
        vm.editedId   = parseInt($stateParams.id) || null;

        vm.ad = {
            type: '0',
            shipping: '0'
        };

        vm.openSub = function(category) {
            category.loading = true;

            Category.sub(category.id).then(function(response) {
                category.loading  = false;
                category.children = response.children;

                if (!Object.keys(response.children).length) {
                    vm.ad.category_id = category.id;
                    vm.ad.max_length = response.max_title_length;
                }
            });
        }

        Template.all().then(function(response) {
            vm.templates = response;
        });

        vm.validationErrors = [];

        /**
         * Load ad or product information
         */
        vm.product = {};
        if (vm.editedId) {
            Ad.get(vm.editedId).then(function(ad) {
                vm.ad = ad;
 
                Category.sub(vm.ad.category_id).then(function(response) {
                    vm.ad.max_length = response.max_title_length;
                });
            });
        } else {
            vm.loadingCategories = true;
            Produto.get(vm.productSku).then(function(product) {
                vm.product = product;

                vm.ad.price = vm.product.valor;
                vm.ad.title = vm.product.titulo;

                Category.predict(vm.product.titulo).then(function(response) {
                    vm.categories     = response.categories;
                    vm.ad.max_length  = response.max_title_length;
                    vm.ad.category_id = response.selected_id;

                    vm.loadingCategories = false;
                });
            });
        }

        /**
         * Save the ad
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Ad.save(Object.assign({}, vm.ad, { product_sku: vm.productSku }), vm.editedId).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Anúncio salvo com sucesso!');
                    $state.go('app.produtos.mercadolivre.ads.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Exclui o produto
         *
         * @return {void}
         */
        vm.destroy = function() {
            Ad.delete(vm.editedId).then(function() {
                toaster.pop('success', 'Sucesso!', 'Anúncio excluido com sucesso!');
                $state.go('app.produtos.mercadolivre.ads.index');
            });
        };
    }
})();
