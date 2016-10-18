(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('InspecaoTecnicaHelper', function(toaster, InspecaoTecnica) {
            var vm;

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
                 * Altera a prioridade da inspecao
                 *
                 * @param  {int} inspecao_id
                 * @param  {bool} updateVm
                 * @return {void}
                 */
                alterarPrioridade: function(inspecao_id, updateVm) {
                    InspecaoTecnica.alterarPrioridade(inspecao_id).then(function() {
                        toaster.pop('success', 'Sucesso!', 'Prioridade alterada com sucesso!');

                        if (typeof this.vm != 'undefined' &&
                            typeof updateVm !== 'undefined' &&
                            updateVm &&
                            typeof this.vm.load != 'undefined' ) {
                            this.vm.load();
                        }
                    }.bind(this));
                }
            };
        });
})();
