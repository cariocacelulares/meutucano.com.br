(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoDetalheController', PedidoDetalheController);

    function PedidoDetalheController($rootScope, $state, $stateParams, ngDialog, SweetAlert, toaster, Pedido, RastreioHelper, NotaHelper, ClienteEnderecoHelper, PedidoHelper, ClienteHelper, InspecaoTecnicaHelper, InspecaoTecnica, PedidoProduto) {
        var vm = this;

        vm.pedido_id  = $stateParams.id;
        vm.pedido     = {};
        vm.loading    = false;

        /**
         * @type {Object}
         */
        vm.notaHelper = NotaHelper;

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
            });
        };

        vm.load();

        /**
         * Cria ou atualiza uma inspecao tecnica
         *
         * @param  {Object} params pedidoProduto e inspecao
         * @return {void}
         */
        vm.updateInspecao = function(params) {
            var pedidoProduto = params.pedidoProduto;
            var inspecao = params.inspecao;

            if (inspecao.revisado_at === null) {
                // apenas altera o produto da inspecao
                InspecaoTecnica.save({
                    'produto_sku': pedidoProduto.produto.sku
                }, inspecao.id).then(function() {
                    toaster.pop('success', 'Inspecao tecnica alterada com sucesso!', '');
                    vm.load();
                });
            } else {
                // cria uma nova inspecao e exclui a antiga
                InspecaoTecnica.save({
                    produto_sku: pedidoProduto.produto.sku,
                    pedido_produtos_id: pedidoProduto.id,
                    revisado_at: null
                }).then(function() {
                    if (typeof inspecao.id != 'undefined' && inspecao.id) {
                        InspecaoTecnica.save({
                            pedido_produtos_id: null
                        }, inspecao.id);
                    }

                    toaster.pop('success', 'Inspecao tecnica solicitada com sucesso!', '');
                    vm.load();
                });
            }
        };

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
                } else if (typeof data.value.pedidoProduto != 'undefined' && typeof data.value.inspecao != 'undefined') {
                    SweetAlert.swal({
                        title: 'O novo produto precisa de uma inspeção técnica?',
                        text: 'Se sim, seu produto será revisado e você será avisado!',
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Não',
                        confirmButtonColor: '#10CFBD',
                        confirmButtonText: 'Sim'
                    }, function(isConfirm) {
                        if (isConfirm) {
                            vm.updateInspecao(data.value);
                        } else {
                            if (typeof data.value.inspecao.id != 'undefined' && data.value.inspecao.id) {
                                InspecaoTecnica.delete(data.value.inspecao.id);
                            }

                            vm.load();
                        }
                    });
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