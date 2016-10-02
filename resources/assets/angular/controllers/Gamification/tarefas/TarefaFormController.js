(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TarefaFormController', TarefaFormController);

    function TarefaFormController($scope, toaster, Tarefa) {
        var vm = this;

        if (typeof $scope.ngDialogData.tarefa != 'undefined') {
            vm.tarefa = angular.copy($scope.ngDialogData.tarefa);
        } else {
            vm.tarefa = {};
        }

        vm.load = function() {
            vm.loading = true;

            Tarefa.get(vm.tarefa.id).then(function(tarefa) {
                vm.tarefa = tarefa;
                vm.loading = false;
            });
        };

        if (vm.tarefa.id) {
            vm.load();
        }

        /**
         * Salva a tarefa
         *
         * @return {void}
         */
        vm.save = function() {
            Tarefa.save(vm.tarefa, vm.tarefa.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Tarefa salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };

        /**
         * Exclui a tarefa
         *
         * @return {void}
         */
        vm.destroy = function() {
            Tarefa.delete(vm.tarefa.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Tarefa excluida com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();