(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('UploadController', UploadController);

    function UploadController(Upload, toaster, apiUrl, $rootScope) {
        var vm = this;

        /**
         * Upload notas
         *
         * @param files
         */
        vm.upload = function (files, ghost) {
            if (files && files.length) {
                $rootScope.$broadcast('loading');
                Upload.upload({
                    url: apiUrl + '/upload',
                    headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                    data: {
                        arquivos: files,
                        fantasma: ghost
                    }
                }).success(function (response) {
                    $rootScope.$broadcast('upload');
                    $rootScope.$broadcast('stop-loading');
                    toaster.pop('success', 'Upload concluído', response.data.msg);
                }).error(function () {
                    toaster.pop('error', "Erro no upload!", "Erro ao enviar arquivos, tente novamente!");
                });
            }
        };
    }

})();