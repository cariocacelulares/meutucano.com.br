(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('SelectProductHelper', function(ngDialog, Produto) {
            return {
                /**
                 * Open a model to select a product
                 * @return promisse modal
                 */
                open: function() {
                    return ngDialog.open({
                        template: 'views/partials/select-product.html',
                        controller: function() {
                            var vm = this;

                            vm.term     = null;
                            vm.products = [];
                            vm.product  = null;

                            /**
                             * Search products by title and sku
                             * @param  {string} term
                             */
                            vm.searchProduct = function(term) {
                                if (term) {
                                    Produto.search(term).then(function(response) {
                                        vm.products = response;
                                    });
                                }
                            }
                        },
                        controllerAs: 'SelectProduct'
                    }).closePromise;
                }
            };
        });
})();
