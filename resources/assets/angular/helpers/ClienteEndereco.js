(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ClienteEnderecoHelper', function(ngDialog, Endereco) {
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
                 * Editar endereço
                 * @param endereco_id
                 */
                editar: function(id, updateVm) {
                    Endereco.get(id).then(function(endereco) {
                        ngDialog.open({
                            template: 'views/cliente/endereco/form.html',
                            controller: 'EnderecoFormController',
                            controllerAs: 'EnderecoForm',
                            data: {
                                endereco: endereco
                            }
                        }).closePromise.then(function(data) {
                            if (updateVm &&
                                typeof this.vm != 'undefined' &&
                                typeof this.vm.load != 'undefined' &&
                                data.value === true) {
                                this.vm.load();
                            }
                        }.bind(this));
                    }.bind(this));
                }
            };
        });
})();
