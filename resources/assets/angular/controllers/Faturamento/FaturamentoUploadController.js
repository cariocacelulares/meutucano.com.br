(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('FaturamentoUploadController', FaturamentoUploadController);

    function FaturamentoUploadController($rootScope, $timeout, toaster, envService, ngDialog, Upload) {
        var vm = this;

        vm.loading = false;
        vm.resposta = null;
        vm.statusAberto = false;

        /**
         * Upload notas
         *
         * @param files
         */
        vm.upload = function(files) {
            if (files && files.length) {
                vm.loading = true;
                vm.statusAberto = true;
                $rootScope.$broadcast('loading');

                Upload.upload({
                    url: envService.read('apiUrl') + '/pedidos/upload',
                    headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                    data: {
                        files: files
                    }
                }).success(function(response) {
                    vm.loading = false;
                    vm.resposta = response.data;
                    $rootScope.$broadcast('stop-loading');
                    vm.statusAberto = false;

                    if (vm.resposta.total && vm.resposta.retorno.length) {
                        ngDialog.open({
                            template: 'views/components/upload-feedback.html',
                            className: (vm.resposta.total > 1) ? 'ngdialog-theme-default ngdialog-extra-big' : 'ngdialog-theme-default',
                            data: {
                                retorno: vm.resposta.retorno,
                                success: vm.resposta.success,
                                total  : vm.resposta.total
                            },
                            controllerAs: 'NotaUpload',
                            controller: function($scope, $state, NotaHelper, RastreioHelper, PedidoHelper) {
                                var vm = this;

                                vm.notaHelper     = NotaHelper;
                                vm.rastreioHelper = RastreioHelper;
                                vm.pedidoHelper   = PedidoHelper;
                                vm.retorno        = $scope.ngDialogData.retorno;
                                vm.success        = $scope.ngDialogData.success;
                                vm.total          = $scope.ngDialogData.total;

                                vm.load = function() {
                                    var ordered = [];
                                    for (var key in vm.retorno) {
                                        if (vm.retorno[key].error) {
                                            ordered.unshift(vm.retorno[key]);
                                        } else {
                                            ordered.push(vm.retorno[key]);
                                        }
                                    }

                                    vm.retorno = ordered;
                                };

                                vm.load();

                                vm.faturar = function(id) {
                                    $scope.closeThisDialog(true);
                                    vm.pedidoHelper.faturar(id);
                                    $state.go($state.current, {}, {reload: true});
                                }
                            }
                        })
                    }
                }).error(function() {
                    toaster.pop('error', "Erro no upload!", "Erro ao enviar arquivos, tente novamente!");
                });
            }
        };
    };

})();
