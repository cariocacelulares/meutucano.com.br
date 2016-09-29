(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ClienteHelper', function(ngDialog, toaster, Cliente) {
            var vm;

            return {
                /**
                 * Retorna uma nova instância
                 *
                 * @param  {Object} vm
                 * @return {Object}
                 */
                init: function(vm) {
                    this.vm = vm;

                    return this;
                },

                /**
                 * Altera o e-mail do cliente
                 *
                 * @param  {int} cliente
                 * @param  {boolean} updateVm
                 * @return {void}
                 */
                changeEmail: function(cliente, updateVm) {
                    ngDialog.open({
                        template: 'views/cliente/change_email.html',
                        controller: function() {
                            this.email = cliente.email;
                        },
                        controllerAs: 'ChangeEmail'
                    }).closePromise.then(function(data) {
                        if (data.value !== null && data.value.substring(0, 1) != '$') {
                            this.vm.loading = true;

                            Cliente.changeEmail(cliente.id, data.value).then(function(cliente) {
                                toaster.pop('success', 'Sucesso!', 'E-mail alterado com sucesso!');
                                this.vm.loading = false;

                                if (typeof this.vm != 'undefined' && typeof updateVm !== 'undefined' && updateVm && typeof this.vm.load != 'undefined' ) {
                                        this.vm.load();
                                }
                            }.bind(this));
                        }
                    }.bind(this));
                }
            };
        });
})();
