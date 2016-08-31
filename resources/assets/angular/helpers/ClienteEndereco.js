(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ClienteEnderecoHelper', function(ngDialog, Cliente) {
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
                editar: function(cliente_id, updateVm) {
                    Cliente.get(cliente_id).then(function(cliente) {
                        ngDialog.open({
                            template: 'views/cliente/endereco/form.html',
                            controller: 'EnderecoFormController',
                            controllerAs: 'EnderecoForm',
                            data: {
                                cliente: cliente
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
