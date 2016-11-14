(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AvatarFormController', AvatarFormController);

    function AvatarFormController($scope, toaster, envService, Upload, Gamification) {
        var vm = this;

        if (typeof $scope.ngDialogData.usuario != 'undefined') {
            vm.usuario = angular.copy($scope.ngDialogData.usuario);
        } else {
            toaster.pop('error', 'Erro!', 'Não foi possível encontrar seu avatar!');
            $scope.closeThisDialog(true);
        }

        vm.imagem = null;

        /**
         * Salva a jogador
         *
         * @return {void}
         */
        vm.save = function() {
            if (vm.usuario.gamification.avatar) {
                if (vm.imagem) {
                    Upload.upload({
                        url: envService.read('apiUrl') + '/gamification/upload',
                        headers: { Authorization: 'Bearer '+ localStorage.getItem('satellizer_token') },
                        data: {
                            arquivo: Upload.dataUrltoBlob(vm.usuario.gamification.avatar, vm.imagem.name)
                        }
                    }).success(function(response) {
                        toaster.pop('success', 'Upload concluído', response.data.msg);
                        vm.usuario.gamification.avatar = response.data;

                        Gamification.avatar(vm.usuario.gamification.id, vm.usuario.gamification.avatar).then(function() {
                            toaster.pop('success', 'Sucesso!', 'Avatar salvo com sucesso!');
                            $scope.closeThisDialog(true);
                        });
                    }).error(function () {
                        toaster.pop('error', "Erro no upload!", "Erro ao enviar arquivos, tente novamente!");
                    });
                }
            } else {
                toaster.pop('error', "Erro no upload!", "Tem certeza que você selecionou uma imagem?");
            }
        };
    }
})();