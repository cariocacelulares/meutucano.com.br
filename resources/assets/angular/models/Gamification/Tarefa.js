(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Tarefa', TarefaModel);

        function TarefaModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'gamification/tarefas';

            return rest;
        }
})();
