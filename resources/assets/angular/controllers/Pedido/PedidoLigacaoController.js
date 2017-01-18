(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('PedidoLigacaoController', PedidoLigacaoController);

    function PedidoLigacaoController($stateParams, envService, Upload, toaster, Ligacao, ValidationErrors) {
        var vm = this;

        vm.ligacao          = null;
        vm.ligacoes         = [];
        vm.pedido_id        = $stateParams.id;
        vm.loading          = false;
        vm.validationErrors = [];

        /**
         * Load ligacoes
         */
        vm.load = function() {
            vm.loading = true;

            Ligacao.getFromOrder(vm.pedido_id).then(function(ligacoes) {
                vm.loading = false;
                vm.ligacoes = ligacoes;
            });
        };

        vm.load();

        /**
         * Save ligacao
         */
        vm.uploadFile = function(file, errFiles) {
            console.log(vm.ligacao);
            if (file) {
                Upload.upload({
                    url: envService.read('apiUrl') + '/ligacoes',
                    headers: { Authorization: 'Bearer '+ localStorage.getItem('satellizer_token') },
                    data: {
                        arquivo: vm.ligacao
                    }
                }).success(function (response) {
                    toaster.pop('success', '', 'Áudio salvo com sucesso.');
                    vm.load();
                }).error(function (response) {
                    toaster.pop('error', '', 'Ocorreu um erro ao tentar subir seu áudio');
                });
            }

            if (!file || errFiles.length) {
                toaster.pop('error', '', 'Ocorreu um erro ao tentar selecionar seu áudio');
            }
        };
        /**
         * Destroy comentário
         */
        vm.destroy = function(ligacao) {
            vm.loading = true;

            Ligacao.delete(ligacao).then(function() {
                vm.loading = false;
                vm.load();
                toaster.pop('success', 'Sucesso!', 'Ligação excluída com sucesso!');
            });
        };
    }
})();
