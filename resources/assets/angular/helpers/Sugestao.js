(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('SugestaoHelper', function($window, $httpParamSerializer, envService, ngDialog, toaster, Rastreio, Devolucao, Pi, Logistica) {
            var vm;

            var codigo = {
                servico: null,
                rastreio: null
            };

            return {
                /**
                 * Retorna uma nova instância
                 * @param  {Object} vm
                 * @return {Object}
                 */
                init: function(vm) {
                    this.vm = vm;

                    return this;
                },

                /**
                 * Devolução
                 * @param rastreio
                 */
                sugestao: function(id, updateVm) {
                    ngDialog.open({
                        template: 'views/sugestoes/form.html',
                        controller: 'SugestaoFormController',
                        controllerAs: 'SugestaoForm'
                    });
                }
            };
        });
})();
