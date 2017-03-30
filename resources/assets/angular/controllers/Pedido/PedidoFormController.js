(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoFormController', PedidoFormController);

    function PedidoFormController($state, toaster, ValidationErrors, Produto, Cliente, Pedido) {
        var vm = this;

        vm.clients  = [];
        vm.products = [];
        vm.product  = null;
        vm.order    = {
            products: [],
            parcelas: '1'
        };

        /**
         * Search clients by name and taxvat
         * @param  {string} term
         */
        vm.searchClient = function(term) {
            if (term) {
                Cliente.search(term).then(function(response) {
                    vm.clients = response;
                });
            }
        }

        /**
         * Set ids to order when client selected
         */
        vm.clientSelected = function() {
            if (typeof vm.order.cliente != 'undefined') {
                vm.order.cliente_id = vm.order.cliente.id;

                if (typeof vm.order.cliente.enderecos[0] != 'undefined') {
                    vm.order.cliente_endereco_id = vm.order.cliente.enderecos[0].id;
                }
            }
        }

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

        /**
         * Add order product
         */
        vm.productSelected = function() {
            if (typeof vm.product != 'undefined' && vm.product) {
                vm.order.products.push({
                    sku   : vm.product.sku,
                    titulo: vm.product.titulo,
                    valor : vm.product.valor,
                    qtd   : 1
                });
            }

            vm.product = null;
            vm.updateTotal();
        }

        /**
         * Update total order value
         */
        vm.updateTotal = function() {
            vm.order.total = vm.order.products.reduce(function(sum, item) {
                return sum + (parseFloat(item.valor) * item.qtd);
            }, 0);
        }

        vm.save = function() {
            vm.validationErrors = [];
            vm.order.status        = 1;
            vm.order.marketplace   = 'Venda direta';

            Pedido.save(vm.order).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Pedido salvo com sucesso!');
                    $state.go('app.pedidos.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
