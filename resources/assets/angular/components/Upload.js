(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('upload', {
            templateUrl: 'views/components/upload.html',
            controller: function(Upload, toaster, envService, $rootScope, SweetAlert, $timeout) {
                var vm = this;

                vm.loading = false;
                vm.errors = [];
                vm.resposta = null;
                vm.statusAberto = false;

                vm.removeError = function(error) {
                    for (var i = vm.errors.length - 1; i >= 0; i--){
                        if (vm.errors[i].chave == error.chave){
                            vm.errors.splice(i, 1);
                        }
                    }

                    if (!vm.errors.length) {
                        vm.statusAberto = false;
                    }
                };

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
                            url: envService.read('apiUrl') + '/upload',
                            headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                            data: {
                                arquivos: files
                            }
                        }).success(function(response) {
                            vm.loading = false;
                            vm.resposta = response.data;
                            vm.errors = vm.resposta.errors;
                            $rootScope.$broadcast('upload');
                            $rootScope.$broadcast('stop-loading');

                            if (!vm.errors.length && vm.resposta.success == vm.resposta.total) {
                                $timeout(function() {
                                    vm.statusAberto = false;
                                }.bind(vm), 3000);
                            }
                        }).error(function() {
                            toaster.pop('error', "Erro no upload!", "Erro ao enviar arquivos, tente novamente!");
                        });
                    }
                };
            },
            controllerAs: 'Upload'
        });

})();