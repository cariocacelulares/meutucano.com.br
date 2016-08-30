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
                 * Generate DANFE
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
                },

                /**
                 * Cancela nota
                 * @param pedido_id
                 */
                cancelar: function(pedido_id) {
                    Restangular.one('pedidos', pedido_id).remove().then(function() {
                        $rootScope.$broadcast('upload');
                        toaster.pop('success', 'Sucesso!', 'Pedido deletado com sucesso!');
                    });
                }
            };
        }]);
})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('RastreioHelper', ["ngDialog", "Rastreio", "Devolucao", "Pi", function(ngDialog, Rastreio, Devolucao, Pi) {
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
                    Devolucao.get(rastreio_id).then(function(devolucao) {
                        ngDialog.open({
                            template: 'views/devolucao/form.html',
                            controller: 'DevolucaoFormController',
                            controllerAs: 'DevolucaoForm',
                            data: {
                                rastreio: devolucao
                            }
                        }).closePromise.then(function(data) {
                            if (updateVm &&
                                typeof this.vm != 'undefined' &&
                                typeof this.vm.load != 'undefined' &&
                                data.value === true) {
                                this.vm.load();
                            }
                        }.bind(this));
                    });
                },



                /**
                 * PI
                 * @param rastreio
                 */
                pi: function(rastreio_id, updateVm) {
                    Pi.get(rastreio_id).then(function(devolucao) {
                        ngDialog.open({
                            template: 'views/pi/form.html',
                            className: 'ngdialog-theme-default ngdialog-big',
                            controller: 'PiFormController',
                            controllerAs: 'PiForm',
                            data: {
                                rastreio: devolucao
                            }
                        }).closePromise.then(function(data) {
                            if (updateVm &&
                                typeof this.vm != 'undefined' &&
                                typeof this.vm.load != 'undefined' &&
                                data.value === true) {
                                this.vm.load();
                            }
                        }.bind(this));
                    });
                },

                /**
                 * Logística reversa
                 * @param rastreio
                 */
                logistica: function(rastreio_id, updateVm) {
                    Logistica.get(rastreio_id).then(function(logistica) {
                        ngDialog.open({
                            template: 'views/logistica/form.html',
                            className: 'ngdialog-theme-default ngdialog-big',
                            controller: 'LogisticaFormController',
                            controllerAs: 'Logistica',
                            data: {
                                rastreio: logistica
                            }
                        }).closePromise.then(function(data) {
                            if (updateVm &&
                                typeof this.vm != 'undefined' &&
                                typeof this.vm.load != 'undefined' &&
                                data.value === true) {
                                this.vm.load();
                            }
                        }.bind(this));
                    });
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
                    });
                }
            };
        }]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5vdGEuanMiLCJSYXN0cmVpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLDRFQUFBLFNBQUEsVUFBQSxTQUFBLFlBQUEsc0JBQUE7WUFDQSxPQUFBOzs7OztnQkFLQSxVQUFBLFNBQUEsV0FBQTtvQkFDQSxJQUFBLE9BQUE7d0JBQ0EsT0FBQSxhQUFBLFFBQUE7OztvQkFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEsZ0JBQUEsWUFBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7Z0JBT0EsWUFBQSxTQUFBLFdBQUE7b0JBQ0EsSUFBQSxPQUFBO3dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7b0JBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGtCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7OztnQkFRQSxlQUFBLFNBQUEsYUFBQTtvQkFDQSxJQUFBLE9BQUE7d0JBQ0EsT0FBQSxhQUFBLFFBQUE7OztvQkFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEseUJBQUEsY0FBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7Z0JBT0EsT0FBQSxTQUFBLFdBQUEsT0FBQTtvQkFDQSxTQUFBLEtBQUE7d0JBQ0EsVUFBQTt3QkFDQSxXQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTt3QkFDQSxNQUFBOzRCQUNBLFdBQUE7NEJBQ0EsT0FBQTs7Ozs7Ozs7O2dCQVNBLFVBQUEsU0FBQSxXQUFBO29CQUNBLFlBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQSxLQUFBLFdBQUE7d0JBQ0EsV0FBQSxXQUFBO3dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3BFQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLDhEQUFBLFNBQUEsVUFBQSxVQUFBLFdBQUEsSUFBQTtZQUNBLElBQUE7O1lBRUEsT0FBQTs7Ozs7O2dCQU1BLE1BQUEsU0FBQSxJQUFBO29CQUNBLEtBQUEsS0FBQTs7b0JBRUEsT0FBQTs7Ozs7OztnQkFPQSxXQUFBLFNBQUEsYUFBQSxVQUFBO29CQUNBLFVBQUEsSUFBQSxhQUFBLEtBQUEsU0FBQSxXQUFBO3dCQUNBLFNBQUEsS0FBQTs0QkFDQSxVQUFBOzRCQUNBLFlBQUE7NEJBQ0EsY0FBQTs0QkFDQSxNQUFBO2dDQUNBLFVBQUE7OzJCQUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7NEJBQ0EsSUFBQTtnQ0FDQSxPQUFBLEtBQUEsTUFBQTtnQ0FDQSxPQUFBLEtBQUEsR0FBQSxRQUFBO2dDQUNBLEtBQUEsVUFBQSxNQUFBO2dDQUNBLEtBQUEsR0FBQTs7MEJBRUEsS0FBQTs7Ozs7Ozs7OztnQkFVQSxJQUFBLFNBQUEsYUFBQSxVQUFBO29CQUNBLEdBQUEsSUFBQSxhQUFBLEtBQUEsU0FBQSxXQUFBO3dCQUNBLFNBQUEsS0FBQTs0QkFDQSxVQUFBOzRCQUNBLFdBQUE7NEJBQ0EsWUFBQTs0QkFDQSxjQUFBOzRCQUNBLE1BQUE7Z0NBQ0EsVUFBQTs7MkJBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTs0QkFDQSxJQUFBO2dDQUNBLE9BQUEsS0FBQSxNQUFBO2dDQUNBLE9BQUEsS0FBQSxHQUFBLFFBQUE7Z0NBQ0EsS0FBQSxVQUFBLE1BQUE7Z0NBQ0EsS0FBQSxHQUFBOzswQkFFQSxLQUFBOzs7Ozs7OztnQkFRQSxXQUFBLFNBQUEsYUFBQSxVQUFBO29CQUNBLFVBQUEsSUFBQSxhQUFBLEtBQUEsU0FBQSxXQUFBO3dCQUNBLFNBQUEsS0FBQTs0QkFDQSxVQUFBOzRCQUNBLFdBQUE7NEJBQ0EsWUFBQTs0QkFDQSxjQUFBOzRCQUNBLE1BQUE7Z0NBQ0EsVUFBQTs7MkJBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTs0QkFDQSxJQUFBO2dDQUNBLE9BQUEsS0FBQSxNQUFBO2dDQUNBLE9BQUEsS0FBQSxHQUFBLFFBQUE7Z0NBQ0EsS0FBQSxVQUFBLE1BQUE7Z0NBQ0EsS0FBQSxHQUFBOzswQkFFQSxLQUFBOzs7Ozs7OztnQkFRQSxRQUFBLFNBQUEsYUFBQSxVQUFBO29CQUNBLFNBQUEsSUFBQSxhQUFBLEtBQUEsU0FBQSxVQUFBO3dCQUNBLFNBQUEsS0FBQTs0QkFDQSxVQUFBOzRCQUNBLFlBQUE7NEJBQ0EsY0FBQTs0QkFDQSxNQUFBO2dDQUNBLFVBQUE7OzJCQUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7NEJBQ0EsSUFBQTtnQ0FDQSxPQUFBLEtBQUEsTUFBQTtnQ0FDQSxPQUFBLEtBQUEsR0FBQSxRQUFBO2dDQUNBLEtBQUEsVUFBQSxNQUFBO2dDQUNBLEtBQUEsR0FBQTs7MEJBRUEsS0FBQTs7Ozs7O0FBTUEiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdOb3RhSGVscGVyJywgZnVuY3Rpb24obmdEaWFsb2csICR3aW5kb3csIGVudlNlcnZpY2UsICRodHRwUGFyYW1TZXJpYWxpemVyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdlbmVyYXRlIFhNTFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcmludFhNTDogZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy94bWwvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAneG1sJyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdlbmVyYXRlIERBTkZFXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHByaW50RGFuZmU6IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvbm90YXMvZGFuZmUvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAnZGFuZmUnKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogR2VuZXJhdGUgREFORkVcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSByYXN0cmVpb19pZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHByaW50RXRpcXVldGE6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9yYXN0cmVpb3MvZXRpcXVldGEvJyArIHJhc3RyZWlvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdldGlxdWV0YScpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBFbnZpYXIgbm90YSBwb3IgZS1tYWlsXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZW1haWw6IGZ1bmN0aW9uKHBlZGlkb19pZCwgZW1haWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2VtYWlsLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VtYWlsQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFbWFpbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVkaWRvX2lkOiBwZWRpZG9faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDYW5jZWxhIG5vdGFcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcGVkaWRvX2lkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY2FuY2VsYXI6IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3MnLCBwZWRpZG9faWQpLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGRlbGV0YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1Jhc3RyZWlvSGVscGVyJywgZnVuY3Rpb24obmdEaWFsb2csIFJhc3RyZWlvLCBEZXZvbHVjYW8sIFBpKSB7XG4gICAgICAgICAgICB2YXIgdm07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSB1bWEgbm92YSBpbnN0w6JuY2lhXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSB2bVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbih2bSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtID0gdm07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIERldm9sdcOnw6NvXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGV2b2x1Y2FvOiBmdW5jdGlvbihyYXN0cmVpb19pZCwgdXBkYXRlVm0pIHtcbiAgICAgICAgICAgICAgICAgICAgRGV2b2x1Y2FvLmdldChyYXN0cmVpb19pZCkudGhlbihmdW5jdGlvbihkZXZvbHVjYW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvZGV2b2x1Y2FvL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rldm9sdWNhb0Zvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdEZXZvbHVjYW9Gb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiBkZXZvbHVjYW9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVZtICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtLmxvYWQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG5cblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFBJXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcGk6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkLCB1cGRhdGVWbSkge1xuICAgICAgICAgICAgICAgICAgICBQaS5nZXQocmFzdHJlaW9faWQpLnRoZW4oZnVuY3Rpb24oZGV2b2x1Y2FvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL3BpL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQaUZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdQaUZvcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IGRldm9sdWNhb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlVm0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0gIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0ubG9hZCAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBMb2fDrXN0aWNhIHJldmVyc2FcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsb2dpc3RpY2E6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkLCB1cGRhdGVWbSkge1xuICAgICAgICAgICAgICAgICAgICBMb2dpc3RpY2EuZ2V0KHJhc3RyZWlvX2lkKS50aGVuKGZ1bmN0aW9uKGxvZ2lzdGljYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9sb2dpc3RpY2EvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2lzdGljYUZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdMb2dpc3RpY2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IGxvZ2lzdGljYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlVm0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0gIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0ubG9hZCAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBFZGl0YXIgcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBlZGl0YXI6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkLCB1cGRhdGVWbSkge1xuICAgICAgICAgICAgICAgICAgICBSYXN0cmVpby5nZXQocmFzdHJlaW9faWQpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvcmFzdHJlaW8vcGFydGlhbHMvZWRpdGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFZGl0YXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVWbSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy52bSAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy52bS5sb2FkICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
