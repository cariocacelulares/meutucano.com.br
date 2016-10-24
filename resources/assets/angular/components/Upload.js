(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('upload', {
            templateUrl: 'views/components/upload.html',
            controller: function(Upload, toaster, envService, $rootScope, SweetAlert) {
                var vm = this;

                /**
                 * Upload notas
                 *
                 * @param files
                 */
                vm.upload = function (files) {
                    if (files && files.length) {
                        SweetAlert.swal({
                            title: 'Processando...',
                            text: 'Você enviou ' + files.length + ' arquivo(s).<br/>Aguarde até que eles sejam processados.',
                            type: 'info',
                            html: true,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            showConfirmButton: false
                        });

                        $rootScope.$broadcast('loading');
                        Upload.upload({
                            url: envService.read('apiUrl') + '/upload',
                            headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                            data: {
                                arquivos: files
                            }
                        }).success(function(response) {
                            $rootScope.$broadcast('upload');
                            $rootScope.$broadcast('stop-loading');

                            if (response.data.error) {
                                SweetAlert.swal({
                                    title: 'Atenção!',
                                    text: 'Ocorreu algum erro ao tentar processar ' + response.data.error + ' arquivo(s).<br/>Tente novamente e/ou avise o administrador.',
                                    type: 'error',
                                    html: true
                                });
                            }

                            if (response.success !== null) {
                                toaster.pop('success', 'Upload concluído', response.data.success + ' arquivo(s) foram importados');
                            }
                        }).error(function () {
                            swal.close();
                            toaster.pop('error', "Erro no upload!", "Erro ao enviar arquivos, tente novamente!");
                        });
                    }
                };
            },
            controllerAs: 'Upload'
        });

})();