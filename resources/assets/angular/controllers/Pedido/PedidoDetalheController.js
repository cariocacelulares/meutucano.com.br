(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoDetalheController', PedidoDetalheController);

    function PedidoDetalheController($rootScope, $state, $stateParams, ngDialog, SweetAlert, toaster, Restangular, Pedido, RastreioHelper, NotaHelper, ClienteEnderecoHelper) {
        var vm = this;

        vm.pedido_id  = $stateParams.id;
        vm.pedido     = {};
        vm.loading    = false;
        vm.notaHelper = NotaHelper;

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        /**
         * @type {Object}
         */
        vm.clienteEnderecoHelper = ClienteEnderecoHelper.init(vm);

        vm.load = function() {
            vm.loading = true;

            Pedido.get(vm.pedido_id).then(function(pedido) {
                vm.pedido  = pedido;
                vm.loading = false;
            });
        };
        vm.load();

        /**
         * Mudar o status do pedido para segurado
         * @return {void}
         */
        vm.hold = function() {
            vm.changeStatus(4);
        };

        /**
         * Abre o form de cancelamento para receber o protocolo
         * @return {void}
         */
        vm.cancel = function() {
            if (vm.pedido.marketplace.toLowerCase() == 'site' || vm.pedido.marketplace.toLowerCase() == 'mercadolivre') {
                SweetAlert.swal({
                    title: "Tem certeza?",
                    text: "Esta ação não poderá ser desfeita!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Não",
                    confirmButtonColor: "#F55752",
                    confirmButtonText: "Sim!"
                }, function(isConfirm) {
                    if (isConfirm) {
                        Restangular.one('pedidos/status', vm.pedido.id).customPUT({
                            'status': 5
                        }).then(function(pedido) {
                            toaster.pop('success', 'Sucesso!', 'Pedido cancelado com sucesso!');
                            vm.loading = false;
                            $state.go('app.pedidos.index');
                        });
                    }
                });
            } else {
                ngDialog.open({
                    template: 'views/pedido/form_cancelamento.html',
                    data: { PedidoDetalhe: vm }
                }).closePromise.then(function(data) {
                    if (!isNaN(data.value) && data.value !== null) {
                        vm.loading = true;

                        Restangular.one('pedidos/status', vm.pedido.id).customPUT({
                            'status': 5,
                            'protocolo': data.value
                        }).then(function(pedido) {
                            toaster.pop('success', 'Sucesso!', 'Pedido cancelado com sucesso!');
                            vm.loading = false;
                            $state.go('app.pedidos.index');
                        });
                    }
                });
            }
        };

        /**
         * Alterar status pedido
         */
        vm.changeStatus = function(status) {
            vm.loading = true;

            Restangular.one('pedidos/status', vm.pedido.id).customPUT({
                'status': status
            }).then(function(pedido) {
                toaster.pop('success', 'Sucesso!', 'Status do pedido alterado com sucesso!');
                vm.load();
                vm.loading = false;
            });
        };

        /**
         * Priorizar pedido
         */
        vm.changePriority = function() {
            vm.loading = true;

            Restangular.one('pedidos/prioridade', vm.pedido.id).customPUT({
                'priorizado': !(vm.pedido.priorizado)
            }).then(function(pedido) {
                vm.load();
                vm.loading = false;
                toaster.pop('success', 'Sucesso!', 'Pedido priorizado com sucesso!');
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