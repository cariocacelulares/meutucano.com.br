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

                    /*Devolucao.get(id).then(function(devolucao) {
                        ngDialog.open({
                            template: 'views/sugestao/form.html',
                            controller: 'DevolucaoFormController',
                            controllerAs: 'DevolucaoForm',
                            data: {
                                devolucao: devolucao || { rastreio_id: id }
                            }
                        }).closePromise.then(function(data) {
                            if (updateVm &&
                                typeof this.vm != 'undefined' &&
                                typeof this.vm.load != 'undefined' &&
                                data.value === true) {
                                this.vm.load();
                            }
                        }.bind(this));
                    }.bind(this));*/
                }
            };
        });
})();