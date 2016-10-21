(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('InspecaoSolicitarFormController', InspecaoSolicitarFormController);

    function InspecaoSolicitarFormController($scope, toaster, SweetAlert, InspecaoTecnica, Produto) {
        var vm = this;

        vm.confirmando = false;
        vm.acoes = {};
        vm.produtos = [];
        vm.solicitacao = {
            quantidade: 1
        };

        vm.search = function(term) {
            if (term) {
                Produto.search(term, 1).then(function(response) {
                    vm.produtos = response;
                });
            }
        };

        /**
         * Salva a solicitacao
         *
         * @return {void}
         */
        vm.save = function() {
            if (!vm.confirmando) {
                if (typeof vm.solicitacao.produto !== 'undefined') {
                    InspecaoTecnica.verificarReserva({
                        produto: vm.solicitacao.produto.sku,
                        quantidade: vm.solicitacao.quantidade
                    }).then(function(response) {
                        vm.acoes = response;
                        vm.confirmando = true;
                    });
                }
            } else if (vm.acoes) {
                vm.acoes.produto_sku = vm.solicitacao.produto.sku;
                InspecaoTecnica.reserva(vm.acoes).then(function(response) {
                    $scope.closeThisDialog(true);

                    console.log(response.dados);
                    if (response.dados.length) {
                        var dados = response.dados;
                        var string = '';

                        for (var i in dados) {
                            console.log(dados[i]);
                            if (dados[i].novo != false) {
                                string += 'A inspeção ' + dados[i].antigo + ' foi ocupada e agora substituida por ' + dados[i].novo + '.</br>';
                            } else {
                                string += 'A inspeção ' + dados[i].antigo + ' foi ocupada. Uma nova foi adicionada à fila.</br>';
                            }
                        }

                        SweetAlert.swal({
                            title: 'Atenção!',
                            text: string,
                            html: true,
                            type: 'warning'
                        });
                    } else {
                        toaster.pop('success', 'Sucesso!', 'Sua solitação foi feita com sucesso!');
                    }
                });
            }
        };
    }
})();