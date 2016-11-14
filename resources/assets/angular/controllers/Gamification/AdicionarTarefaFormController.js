(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AdicionarTarefaFormController', AdicionarTarefaFormController);

    function AdicionarTarefaFormController($scope, toaster, Tarefa) {
        var vm = this;

        vm.tarefas = {};
        vm.solicitacao = {};

        vm.load = function() {
            Tarefa.getList().then(function(response) {
                vm.tarefas = response.data;
            });
        };

        vm.load();

        vm.save = function() {
            Tarefa.solicitar(vm.solicitacao).then(function() {
                toaster.pop('success', 'Sucesso!', 'Tarefa solicitada com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();