(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('RastreioHelper', function(Rastreio, ngDialog) {
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
                 * Devolução
                 * @param rastreio
                 */
                devolucao: function(rastreio_id, updateVm) {
                    ngDialog.open({
                        template: 'views/devolucao/form.html',
                        controller: 'DevolucaoFormController',
                        controllerAs: 'DevolucaoForm',
                        data: {
                            rastreio: rastreio_id || null
                        }
                    }).closePromise.then(function(data) {
                        if (updateVm &&
                            typeof this.vm != 'undefined' &&
                            typeof this.vm.load != 'undefined' &&
                            data.value === true) {
                            this.vm.load();
                        }
                    }.bind(this));
                },



                /**
                 * PI
                 * @param rastreio
                 */
                pi: function(rastreio_id, updateVm) {
                    ngDialog.open({
                        template: 'views/pi/form.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'PiFormController',
                        controllerAs: 'PiForm',
                        data: {
                            rastreio: rastreio_id || null
                        }
                    }).closePromise.then(function(data) {
                        if (updateVm &&
                            typeof this.vm != 'undefined' &&
                            typeof this.vm.load != 'undefined' &&
                            data.value === true) {
                            this.vm.load();
                        }
                    }.bind(this));
                },

                /**
                 * Logística reversa
                 * @param rastreio
                 */
                logistica: function(rastreio_id, updateVm) {
                    ngDialog.open({
                        template: 'views/logistica/form.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'LogisticaFormController',
                        controllerAs: 'Logistica',
                        data: {
                            rastreio: rastreio_id || null
                        }
                    }).closePromise.then(function(data) {
                        if (updateVm &&
                            typeof this.vm != 'undefined' &&
                            typeof this.vm.load != 'undefined' &&
                            data.value === true) {
                            this.vm.load();
                        }
                    }.bind(this));
                },

                /**
                 * Editar rastreio
                 * @param rastreio
                 */
                editar: function(rastreio_id, updateVm) {
                    ngDialog.open({
                        template: 'views/rastreio/partials/editar.html',
                        controller: 'EditarController',
                        controllerAs: 'Editar',
                        data: {
                            rastreio: rastreio_id || null
                        }
                    }).closePromise.then(function(data) {
                        if (updateVm &&
                            typeof this.vm != 'undefined' &&
                            typeof this.vm.load != 'undefined' &&
                            data.value === true) {
                            this.vm.load();
                        }
                    }.bind(this));
                }
            };
        });
})();
