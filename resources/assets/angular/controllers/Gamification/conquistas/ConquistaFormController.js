(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ConquistaFormController', ConquistaFormController);

    function ConquistaFormController($scope, toaster, envService, Upload, Conquista, Tarefa) {
        var vm = this;

        if (typeof $scope.ngDialogData.conquista != 'undefined') {
            vm.conquista = angular.copy($scope.ngDialogData.conquista);
        } else {
            vm.conquista = {};
        }

        vm.imagem = null;
        vm.tarefas = {};
        vm.tempoOptions = [
            'No mesmo dia',
            'Na mesma semana',
            'No mesmo mês',
            'Tempo indeterminado'
        ];

        vm.load = function() {
            vm.loading = true;

            Conquista.get(vm.conquista.id).then(function(conquista) {
                vm.conquista = conquista;
                vm.loading = false;
            });
        };

        if (vm.conquista.id) {
            vm.load();
        }

        vm.loadTarefas = function() {
            Tarefa.getList().then(function(response) {
                vm.tarefas = response.data;
            });
        };

        vm.loadTarefas();

        /**
         * Salva a conquista
         *
         * @return {void}
         */
        vm.save = function() {
            if (vm.conquista.icone) {
                if (vm.imagem === null) {
                    Conquista.save(vm.conquista, vm.conquista.id || null).then(function() {
                        toaster.pop('success', 'Sucesso!', 'Conquista salva com sucesso!');
                        $scope.closeThisDialog(true);
                    });
                } else {
                    Upload.upload({
                        url: envService.read('apiUrl') + '/gamification/upload',
                        headers: { Authorization: 'Bearer '+ localStorage.getItem('satellizer_token') },
                        data: {
                            arquivo: Upload.dataUrltoBlob(vm.conquista.icone, vm.imagem.name)
                        }
                    }).success(function(response) {
                        toaster.pop('success', 'Upload concluído', response.data.msg);
                        vm.conquista.icone = response.data;

                        Conquista.save(vm.conquista, vm.conquista.id || null).then(function() {
                            toaster.pop('success', 'Sucesso!', 'Conquista salva com sucesso!');
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

        /**
         * Exclui a conquista
         *
         * @return {void}
         */
        vm.destroy = function() {
            Conquista.delete(vm.conquista.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Conquista excluida com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();