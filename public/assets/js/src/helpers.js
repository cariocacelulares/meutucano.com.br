(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ClienteEnderecoHelper', ["ngDialog", "ClienteEndereco", function(ngDialog, ClienteEndereco) {
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
                    ClienteEndereco.get(id).then(function(endereco) {
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
        }]);
})();

(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('NotaHelper', ["ngDialog", "$window", "envService", "$httpParamSerializer", function(ngDialog, $window, envService, $httpParamSerializer) {
            return {
                /**
                 * Generate XML
                 * @param pedido_id
                 */
                printXML: function(pedido_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/notas/xml/' + pedido_id + '?' + $httpParamSerializer(auth), 'xml');
                },

                /**
                 * Generate DANFE
                 * @param pedido_id
                 */
                printDanfe: function(pedido_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/notas/danfe/' + pedido_id + '?' + $httpParamSerializer(auth), 'danfe');
                },

                /**
                 * Enviar nota por e-mail
                 * @param rastreio
                 */
                email: function(pedido_id, email) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/email.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'EmailController',
                        controllerAs: 'Email',
                        data: {
                            pedido_id: pedido_id,
                            email: email
                        }
                    });
                }
            };
        }]);
})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('RastreioHelper', ["ngDialog", "Rastreio", "Devolucao", "Pi", "Logistica", "envService", "$window", "$httpParamSerializer", function(ngDialog, Rastreio, Devolucao, Pi, Logistica, envService, $window, $httpParamSerializer) {
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
                devolucao: function(id, updateVm) {
                    Devolucao.get(id).then(function(devolucao) {
                        ngDialog.open({
                            template: 'views/devolucao/form.html',
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
                    }.bind(this));
                },

                /**
                 * PI
                 * @param rastreio
                 */
                pi: function(id, updateVm) {
                    Pi.get(id).then(function(pi) {
                        ngDialog.open({
                            template: 'views/pi/form.html',
                            className: 'ngdialog-theme-default ngdialog-big',
                            controller: 'PiFormController',
                            controllerAs: 'PiForm',
                            data: {
                                pi: pi || { rastreio_id: id }
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
                },

                /**
                 * Logística reversa
                 * @param rastreio
                 */
                logistica: function(id, updateVm) {
                    Logistica.get(id).then(function(logistica) {
                        ngDialog.open({
                            template: 'views/logistica/form.html',
                            className: 'ngdialog-theme-default ngdialog-big',
                            controller: 'LogisticaFormController',
                            controllerAs: 'Logistica',
                            data: {
                                logistica: logistica || { rastreio_id: id }
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
                },

                /**
                 * Editar rastreio
                 * @param rastreio
                 */
                editar: function(rastreio_id, updateVm) {
                    Rastreio.get(rastreio_id).then(function(rastreio) {
                        ngDialog.open({
                            template: 'views/rastreio/partials/editar.html',
                            controller: 'EditarController',
                            controllerAs: 'Editar',
                            data: {
                                rastreio: rastreio
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
                },

                /**
                 * Imprime etiqueta
                 *
                 * @param rastreio_id
                 */
                printEtiqueta: function(rastreio_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/rastreios/etiqueta/' + rastreio_id + '?' + $httpParamSerializer(auth), 'etiqueta');
                },

                /**
                 * Imprime histórico
                 *
                 * @param rastreio_id
                 */
                printHistorico: function(rastreio_id) {
                    var auth = {
                        token: localStorage.getItem("satellizer_token")
                    };

                    $window.open(envService.read('apiUrl') + '/rastreios/historico/' + rastreio_id + '?' + $httpParamSerializer(auth), 'historico');
                }
            };
        }]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudGVFbmRlcmVjby5qcyIsIk5vdGEuanMiLCJSYXN0cmVpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLHlEQUFBLFNBQUEsVUFBQSxpQkFBQTtZQUNBLElBQUE7O1lBRUEsT0FBQTs7Ozs7O2dCQU1BLE1BQUEsU0FBQSxJQUFBO29CQUNBLEtBQUEsS0FBQTs7b0JBRUEsT0FBQTs7Ozs7OztnQkFPQSxRQUFBLFNBQUEsSUFBQSxVQUFBO29CQUNBLGdCQUFBLElBQUEsSUFBQSxLQUFBLFNBQUEsVUFBQTt3QkFDQSxTQUFBLEtBQUE7NEJBQ0EsVUFBQTs0QkFDQSxZQUFBOzRCQUNBLGNBQUE7NEJBQ0EsTUFBQTtnQ0FDQSxVQUFBOzsyQkFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBOzRCQUNBLElBQUE7Z0NBQ0EsT0FBQSxLQUFBLE1BQUE7Z0NBQ0EsT0FBQSxLQUFBLEdBQUEsUUFBQTtnQ0FDQSxLQUFBLFVBQUEsTUFBQTtnQ0FDQSxLQUFBLEdBQUE7OzBCQUVBLEtBQUE7c0JBQ0EsS0FBQTs7Ozs7O0FDekNBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsNEVBQUEsU0FBQSxVQUFBLFNBQUEsWUFBQSxzQkFBQTtZQUNBLE9BQUE7Ozs7O2dCQUtBLFVBQUEsU0FBQSxXQUFBO29CQUNBLElBQUEsT0FBQTt3QkFDQSxPQUFBLGFBQUEsUUFBQTs7O29CQUdBLFFBQUEsS0FBQSxXQUFBLEtBQUEsWUFBQSxnQkFBQSxZQUFBLE1BQUEscUJBQUEsT0FBQTs7Ozs7OztnQkFPQSxZQUFBLFNBQUEsV0FBQTtvQkFDQSxJQUFBLE9BQUE7d0JBQ0EsT0FBQSxhQUFBLFFBQUE7OztvQkFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEsa0JBQUEsWUFBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7Z0JBT0EsT0FBQSxTQUFBLFdBQUEsT0FBQTtvQkFDQSxTQUFBLEtBQUE7d0JBQ0EsVUFBQTt3QkFDQSxXQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTt3QkFDQSxNQUFBOzRCQUNBLFdBQUE7NEJBQ0EsT0FBQTs7Ozs7OztBQzNDQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLDRIQUFBLFNBQUEsVUFBQSxVQUFBLFdBQUEsSUFBQSxXQUFBLFlBQUEsU0FBQSxzQkFBQTtZQUNBLElBQUE7O1lBRUEsT0FBQTs7Ozs7O2dCQU1BLE1BQUEsU0FBQSxJQUFBO29CQUNBLEtBQUEsS0FBQTs7b0JBRUEsT0FBQTs7Ozs7OztnQkFPQSxXQUFBLFNBQUEsSUFBQSxVQUFBO29CQUNBLFVBQUEsSUFBQSxJQUFBLEtBQUEsU0FBQSxXQUFBO3dCQUNBLFNBQUEsS0FBQTs0QkFDQSxVQUFBOzRCQUNBLFlBQUE7NEJBQ0EsY0FBQTs0QkFDQSxNQUFBO2dDQUNBLFdBQUEsYUFBQSxFQUFBLGFBQUE7OzJCQUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7NEJBQ0EsSUFBQTtnQ0FDQSxPQUFBLEtBQUEsTUFBQTtnQ0FDQSxPQUFBLEtBQUEsR0FBQSxRQUFBO2dDQUNBLEtBQUEsVUFBQSxNQUFBO2dDQUNBLEtBQUEsR0FBQTs7MEJBRUEsS0FBQTtzQkFDQSxLQUFBOzs7Ozs7O2dCQU9BLElBQUEsU0FBQSxJQUFBLFVBQUE7b0JBQ0EsR0FBQSxJQUFBLElBQUEsS0FBQSxTQUFBLElBQUE7d0JBQ0EsU0FBQSxLQUFBOzRCQUNBLFVBQUE7NEJBQ0EsV0FBQTs0QkFDQSxZQUFBOzRCQUNBLGNBQUE7NEJBQ0EsTUFBQTtnQ0FDQSxJQUFBLE1BQUEsRUFBQSxhQUFBOzsyQkFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBOzRCQUNBLElBQUE7Z0NBQ0EsT0FBQSxLQUFBLE1BQUE7Z0NBQ0EsT0FBQSxLQUFBLEdBQUEsUUFBQTtnQ0FDQSxLQUFBLFVBQUEsTUFBQTtnQ0FDQSxLQUFBLEdBQUE7OzBCQUVBLEtBQUE7c0JBQ0EsS0FBQTs7Ozs7OztnQkFPQSxXQUFBLFNBQUEsSUFBQSxVQUFBO29CQUNBLFVBQUEsSUFBQSxJQUFBLEtBQUEsU0FBQSxXQUFBO3dCQUNBLFNBQUEsS0FBQTs0QkFDQSxVQUFBOzRCQUNBLFdBQUE7NEJBQ0EsWUFBQTs0QkFDQSxjQUFBOzRCQUNBLE1BQUE7Z0NBQ0EsV0FBQSxhQUFBLEVBQUEsYUFBQTs7MkJBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTs0QkFDQSxJQUFBO2dDQUNBLE9BQUEsS0FBQSxNQUFBO2dDQUNBLE9BQUEsS0FBQSxHQUFBLFFBQUE7Z0NBQ0EsS0FBQSxVQUFBLE1BQUE7Z0NBQ0EsS0FBQSxHQUFBOzswQkFFQSxLQUFBO3NCQUNBLEtBQUE7Ozs7Ozs7Z0JBT0EsUUFBQSxTQUFBLGFBQUEsVUFBQTtvQkFDQSxTQUFBLElBQUEsYUFBQSxLQUFBLFNBQUEsVUFBQTt3QkFDQSxTQUFBLEtBQUE7NEJBQ0EsVUFBQTs0QkFDQSxZQUFBOzRCQUNBLGNBQUE7NEJBQ0EsTUFBQTtnQ0FDQSxVQUFBOzsyQkFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBOzRCQUNBLElBQUE7Z0NBQ0EsT0FBQSxLQUFBLE1BQUE7Z0NBQ0EsT0FBQSxLQUFBLEdBQUEsUUFBQTtnQ0FDQSxLQUFBLFVBQUEsTUFBQTtnQ0FDQSxLQUFBLEdBQUE7OzBCQUVBLEtBQUE7c0JBQ0EsS0FBQTs7Ozs7Ozs7Z0JBUUEsZUFBQSxTQUFBLGFBQUE7b0JBQ0EsSUFBQSxPQUFBO3dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7b0JBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLHlCQUFBLGNBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7OztnQkFRQSxnQkFBQSxTQUFBLGFBQUE7b0JBQ0EsSUFBQSxPQUFBO3dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7b0JBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLDBCQUFBLGNBQUEsTUFBQSxxQkFBQSxPQUFBOzs7OztBQUtBIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnQ2xpZW50ZUVuZGVyZWNvSGVscGVyJywgZnVuY3Rpb24obmdEaWFsb2csIENsaWVudGVFbmRlcmVjbykge1xuICAgICAgICAgICAgdmFyIHZtO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgdW1hIG5vdmEgaW5zdMOibmNpYVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gdm1cbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24odm0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bSA9IHZtO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBFZGl0YXIgZW5kZXJlw6dvXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIGVuZGVyZWNvX2lkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZWRpdGFyOiBmdW5jdGlvbihpZCwgdXBkYXRlVm0pIHtcbiAgICAgICAgICAgICAgICAgICAgQ2xpZW50ZUVuZGVyZWNvLmdldChpZCkudGhlbihmdW5jdGlvbihlbmRlcmVjbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9jbGllbnRlL2VuZGVyZWNvL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VuZGVyZWNvRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0VuZGVyZWNvRm9ybScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRlcmVjbzogZW5kZXJlY29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVZtICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtLmxvYWQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdOb3RhSGVscGVyJywgZnVuY3Rpb24obmdEaWFsb2csICR3aW5kb3csIGVudlNlcnZpY2UsICRodHRwUGFyYW1TZXJpYWxpemVyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdlbmVyYXRlIFhNTFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcmludFhNTDogZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy94bWwvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAneG1sJyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdlbmVyYXRlIERBTkZFXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHByaW50RGFuZmU6IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvbm90YXMvZGFuZmUvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAnZGFuZmUnKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRW52aWFyIG5vdGEgcG9yIGUtbWFpbFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGVtYWlsOiBmdW5jdGlvbihwZWRpZG9faWQsIGVtYWlsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9lbWFpbC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFbWFpbENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRW1haWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlZGlkb19pZDogcGVkaWRvX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1Jhc3RyZWlvSGVscGVyJywgZnVuY3Rpb24obmdEaWFsb2csIFJhc3RyZWlvLCBEZXZvbHVjYW8sIFBpLCBMb2dpc3RpY2EsIGVudlNlcnZpY2UsICR3aW5kb3csICRodHRwUGFyYW1TZXJpYWxpemVyKSB7XG4gICAgICAgICAgICB2YXIgdm07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSB1bWEgbm92YSBpbnN0w6JuY2lhXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSB2bVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbih2bSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtID0gdm07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIERldm9sdcOnw6NvXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGV2b2x1Y2FvOiBmdW5jdGlvbihpZCwgdXBkYXRlVm0pIHtcbiAgICAgICAgICAgICAgICAgICAgRGV2b2x1Y2FvLmdldChpZCkudGhlbihmdW5jdGlvbihkZXZvbHVjYW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvZGV2b2x1Y2FvL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rldm9sdWNhb0Zvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdEZXZvbHVjYW9Gb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldm9sdWNhbzogZGV2b2x1Y2FvIHx8IHsgcmFzdHJlaW9faWQ6IGlkIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVZtICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtLmxvYWQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBQSVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHBpOiBmdW5jdGlvbihpZCwgdXBkYXRlVm0pIHtcbiAgICAgICAgICAgICAgICAgICAgUGkuZ2V0KGlkKS50aGVuKGZ1bmN0aW9uKHBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL3BpL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQaUZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdQaUZvcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGk6IHBpIHx8IHsgcmFzdHJlaW9faWQ6IGlkIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVZtICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtLmxvYWQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBMb2fDrXN0aWNhIHJldmVyc2FcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsb2dpc3RpY2E6IGZ1bmN0aW9uKGlkLCB1cGRhdGVWbSkge1xuICAgICAgICAgICAgICAgICAgICBMb2dpc3RpY2EuZ2V0KGlkKS50aGVuKGZ1bmN0aW9uKGxvZ2lzdGljYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9sb2dpc3RpY2EvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2lzdGljYUZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdMb2dpc3RpY2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naXN0aWNhOiBsb2dpc3RpY2EgfHwgeyByYXN0cmVpb19pZDogaWQgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlVm0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0gIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0ubG9hZCAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEVkaXRhciByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGVkaXRhcjogZnVuY3Rpb24ocmFzdHJlaW9faWQsIHVwZGF0ZVZtKSB7XG4gICAgICAgICAgICAgICAgICAgIFJhc3RyZWlvLmdldChyYXN0cmVpb19pZCkudGhlbihmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9yYXN0cmVpby9wYXJ0aWFscy9lZGl0YXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRhckNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0VkaXRhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVZtICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtLmxvYWQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJbXByaW1lIGV0aXF1ZXRhXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9faWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcmludEV0aXF1ZXRhOiBmdW5jdGlvbihyYXN0cmVpb19pZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvcmFzdHJlaW9zL2V0aXF1ZXRhLycgKyByYXN0cmVpb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAnZXRpcXVldGEnKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSW1wcmltZSBoaXN0w7NyaWNvXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9faWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcmludEhpc3RvcmljbzogZnVuY3Rpb24ocmFzdHJlaW9faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF1dGggPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5vcGVuKGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3Jhc3RyZWlvcy9oaXN0b3JpY28vJyArIHJhc3RyZWlvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdoaXN0b3JpY28nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
