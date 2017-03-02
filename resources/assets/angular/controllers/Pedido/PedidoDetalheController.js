(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoDetalheController', PedidoDetalheController);

    function PedidoDetalheController($rootScope, $state, $stateParams, ngDialog, SweetAlert, toaster, Pedido, RastreioHelper, NotaHelper, ClienteEnderecoHelper, PedidoHelper, ClienteHelper, InspecaoTecnicaHelper, PedidoProduto) {
        var vm = this;

        vm.pedido_id   = $stateParams.id;
        vm.pedido      = {};
        vm.hasSeminovo = false;
        vm.loading     = false;

        /**
         * @type {Object}
         */
        vm.notaHelper = NotaHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.clienteEnderecoHelper = ClienteEnderecoHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.pedidoHelper = PedidoHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.clienteHelper = ClienteHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.inspecaoTecnicaHelper = InspecaoTecnicaHelper.init(vm);

        vm.load = function() {
            vm.loading = true;

            Pedido.get(vm.pedido_id).then(function(pedido) {
                vm.pedido  = pedido;
                vm.loading = false;

                for (var pedidoProduto in vm.pedido.produtos) {
                    if (parseInt(vm.pedido.produtos[pedidoProduto].produto.estado) === 1) {
                        vm.hasSeminovo = true;
                        break;
                    }
                }
            });
        };

        vm.load();

        /**
         * Set order as invoiced
         */
        vm.invoice = function() {
            Pedido.status(vm.pedido_id, {status: 2}).then(function (response) {
                vm.load();
            });
        }

        /**
         * Abre formulario para atualizar ou inserir produtos no pedido
         *
         * @param  {Object} orderProduct produto do pedido
         * @return {void}
         */
        vm.openOrderProductForm = function(orderProduct) {
            ngDialog.open({
                template: 'views/pedido/form_pedido_produto.html',
                controller: 'PedidoProdutoFormController',
                controllerAs: 'PedidoProdutoForm',
                data: {
                    pedidoProduto: orderProduct || {},
                    pedido_id: vm.pedido.id
                }
            }).closePromise.then(function(data) {
                if (data.value === true) {
                    vm.load();
                }
            });
        };

        /**
         * Mudar o status do pedido para segurado
         * @return {void}
         */
        vm.toggleHold = function() {
            Pedido.segurar(vm.pedido.id, !(vm.pedido.segurado)).then(function(pedido) {
                vm.load();
                vm.loading = false;
                toaster.pop('success', 'Sucesso!', 'Pedido ' + (vm.pedido.segurado ? 'segurado' : 'liberado') + ' com sucesso!');
            });
        };

        /**
         * Priorizar pedido
         */
        vm.togglePriority = function() {
            vm.loading = true;

            Pedido.prioridade(vm.pedido.id, !(vm.pedido.priorizado)).then(function(pedido) {
                vm.load();
                vm.loading = false;
                toaster.pop('success', 'Sucesso!', 'Prioridade do pedido alterada com sucesso!');
            });
        };

        /**
         * Retorna a classe de status do pedido
         *
         * @return {string}
         */
        vm.parseStatusClass = function() {
            switch (vm.pedido.status) {
                case '1':
                case '2':
                    return 'info';
                case '3':
                    return 'success';
                case '4':
                case '5':
                    return 'danger';
            }
        };

        /**
         * Retorna a classe de status do rastreio
         *
         * @return {string}
         */
        vm.parseRastreioStatusClass = function(rastreio) {
            switch (rastreio.status) {
                case '1':
                case '7':
                case '8':
                    return 'info';
                case '2':
                    return 'warning';
                case '4':
                    return 'success';
                case '3':
                case '5':
                case '6':
                    return 'danger';
            }
        };
    }
})();
