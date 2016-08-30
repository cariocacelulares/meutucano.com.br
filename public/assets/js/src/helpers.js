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
        .service('RastreioHelper', ["Rastreio", "ngDialog", function(Rastreio, ngDialog) {
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
        }]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5vdGEuanMiLCJSYXN0cmVpby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLDRFQUFBLFNBQUEsVUFBQSxTQUFBLFlBQUEsc0JBQUE7WUFDQSxPQUFBOzs7OztnQkFLQSxVQUFBLFNBQUEsV0FBQTtvQkFDQSxJQUFBLE9BQUE7d0JBQ0EsT0FBQSxhQUFBLFFBQUE7OztvQkFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEsZ0JBQUEsWUFBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7Z0JBT0EsWUFBQSxTQUFBLFdBQUE7b0JBQ0EsSUFBQSxPQUFBO3dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7b0JBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGtCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7OztnQkFRQSxlQUFBLFNBQUEsYUFBQTtvQkFDQSxJQUFBLE9BQUE7d0JBQ0EsT0FBQSxhQUFBLFFBQUE7OztvQkFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEseUJBQUEsY0FBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7Z0JBT0EsT0FBQSxTQUFBLFdBQUEsT0FBQTtvQkFDQSxTQUFBLEtBQUE7d0JBQ0EsVUFBQTt3QkFDQSxXQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTt3QkFDQSxNQUFBOzRCQUNBLFdBQUE7NEJBQ0EsT0FBQTs7Ozs7Ozs7O2dCQVNBLFVBQUEsU0FBQSxXQUFBO29CQUNBLFlBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQSxLQUFBLFdBQUE7d0JBQ0EsV0FBQSxXQUFBO3dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3BFQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLDJDQUFBLFNBQUEsVUFBQSxVQUFBO1lBQ0EsSUFBQTs7WUFFQSxPQUFBOzs7Ozs7Z0JBTUEsTUFBQSxTQUFBLElBQUE7b0JBQ0EsS0FBQSxLQUFBOztvQkFFQSxPQUFBOzs7Ozs7O2dCQU9BLFdBQUEsU0FBQSxhQUFBLFVBQUE7b0JBQ0EsU0FBQSxLQUFBO3dCQUNBLFVBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBO3dCQUNBLE1BQUE7NEJBQ0EsVUFBQSxlQUFBOzt1QkFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBO3dCQUNBLElBQUE7NEJBQ0EsT0FBQSxLQUFBLE1BQUE7NEJBQ0EsT0FBQSxLQUFBLEdBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUEsTUFBQTs0QkFDQSxLQUFBLEdBQUE7O3NCQUVBLEtBQUE7Ozs7Ozs7OztnQkFTQSxJQUFBLFNBQUEsYUFBQSxVQUFBO29CQUNBLFNBQUEsS0FBQTt3QkFDQSxVQUFBO3dCQUNBLFdBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBO3dCQUNBLE1BQUE7NEJBQ0EsVUFBQSxlQUFBOzt1QkFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBO3dCQUNBLElBQUE7NEJBQ0EsT0FBQSxLQUFBLE1BQUE7NEJBQ0EsT0FBQSxLQUFBLEdBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUEsTUFBQTs0QkFDQSxLQUFBLEdBQUE7O3NCQUVBLEtBQUE7Ozs7Ozs7Z0JBT0EsV0FBQSxTQUFBLGFBQUEsVUFBQTtvQkFDQSxTQUFBLEtBQUE7d0JBQ0EsVUFBQTt3QkFDQSxXQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTt3QkFDQSxNQUFBOzRCQUNBLFVBQUEsZUFBQTs7dUJBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBOzRCQUNBLE9BQUEsS0FBQSxNQUFBOzRCQUNBLE9BQUEsS0FBQSxHQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBLE1BQUE7NEJBQ0EsS0FBQSxHQUFBOztzQkFFQSxLQUFBOzs7Ozs7O2dCQU9BLFFBQUEsU0FBQSxhQUFBLFVBQUE7b0JBQ0EsU0FBQSxLQUFBO3dCQUNBLFVBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBO3dCQUNBLE1BQUE7NEJBQ0EsVUFBQSxlQUFBOzt1QkFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBO3dCQUNBLElBQUE7NEJBQ0EsT0FBQSxLQUFBLE1BQUE7NEJBQ0EsT0FBQSxLQUFBLEdBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUEsTUFBQTs0QkFDQSxLQUFBLEdBQUE7O3NCQUVBLEtBQUE7Ozs7O0FBS0EiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdOb3RhSGVscGVyJywgZnVuY3Rpb24obmdEaWFsb2csICR3aW5kb3csIGVudlNlcnZpY2UsICRodHRwUGFyYW1TZXJpYWxpemVyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdlbmVyYXRlIFhNTFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwcmludFhNTDogZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy94bWwvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAneG1sJyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEdlbmVyYXRlIERBTkZFXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHByaW50RGFuZmU6IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvbm90YXMvZGFuZmUvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAnZGFuZmUnKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogR2VuZXJhdGUgREFORkVcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSByYXN0cmVpb19pZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHByaW50RXRpcXVldGE6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9yYXN0cmVpb3MvZXRpcXVldGEvJyArIHJhc3RyZWlvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdldGlxdWV0YScpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBFbnZpYXIgbm90YSBwb3IgZS1tYWlsXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZW1haWw6IGZ1bmN0aW9uKHBlZGlkb19pZCwgZW1haWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2VtYWlsLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VtYWlsQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFbWFpbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVkaWRvX2lkOiBwZWRpZG9faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDYW5jZWxhIG5vdGFcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcGVkaWRvX2lkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY2FuY2VsYXI6IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3MnLCBwZWRpZG9faWQpLnJlbW92ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGRlbGV0YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1Jhc3RyZWlvSGVscGVyJywgZnVuY3Rpb24oUmFzdHJlaW8sIG5nRGlhbG9nKSB7XG4gICAgICAgICAgICB2YXIgdm07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSB1bWEgbm92YSBpbnN0w6JuY2lhXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSB2bVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbih2bSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtID0gdm07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIERldm9sdcOnw6NvXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGV2b2x1Y2FvOiBmdW5jdGlvbihyYXN0cmVpb19pZCwgdXBkYXRlVm0pIHtcbiAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2Rldm9sdWNhby9mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rldm9sdWNhb0Zvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0Rldm9sdWNhb0Zvcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb19pZCB8fCBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVWbSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0ubG9hZCAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9LFxuXG5cblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFBJXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcGk6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkLCB1cGRhdGVWbSkge1xuICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvcGkvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQaUZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1BpRm9ybScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvX2lkIHx8IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZVZtICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0gIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy52bS5sb2FkICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBMb2fDrXN0aWNhIHJldmVyc2FcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsb2dpc3RpY2E6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkLCB1cGRhdGVWbSkge1xuICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvbG9naXN0aWNhL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naXN0aWNhRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTG9naXN0aWNhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9faWQgfHwgbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlVm0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy52bSAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtLmxvYWQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEVkaXRhciByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGVkaXRhcjogZnVuY3Rpb24ocmFzdHJlaW9faWQsIHVwZGF0ZVZtKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9yYXN0cmVpby9wYXJ0aWFscy9lZGl0YXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdGFyQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFZGl0YXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb19pZCB8fCBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVWbSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0ubG9hZCAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
