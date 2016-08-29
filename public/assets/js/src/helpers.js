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
                devolucao: function(rastreio_id) {
                    ngDialog.open({
                        template: 'views/devolucao/form.html',
                        controller: 'DevolucaoFormController',
                        controllerAs: 'DevolucaoForm',
                        data: {
                            rastreio: rastreio_id || null
                        }
                    }).closePromise.then(function(data) {
                        if (typeof this.vm != 'undefined' &&
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
                pi: function(rastreio_id) {
                    ngDialog.open({
                        template: 'views/pi/form.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'PiFormController',
                        controllerAs: 'PiForm',
                        data: {
                            rastreio: rastreio_id || null
                        }
                    }).closePromise.then(function(data) {
                        if (typeof this.vm != 'undefined' &&
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
                logistica: function(rastreio) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/logistica.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'LogisticaController',
                        controllerAs: 'Logistica',
                        data: {
                            rastreio: rastreio
                        }
                    });
                },

                /**
                 * Editar rastreio
                 * @param rastreio
                 */
                editar: function(rastreio) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/editar.html',
                        controller: 'EditarController',
                        controllerAs: 'Editar',
                        data: {
                            rastreio: rastreio
                        }
                    });
                }
            };
        }]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhc3RyZWlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsMkNBQUEsU0FBQSxVQUFBLFVBQUE7WUFDQSxJQUFBOztZQUVBLE9BQUE7Ozs7OztnQkFNQSxNQUFBLFNBQUEsSUFBQTtvQkFDQSxLQUFBLEtBQUE7O29CQUVBLE9BQUE7Ozs7Ozs7Z0JBT0EsV0FBQSxTQUFBLGFBQUE7b0JBQ0EsU0FBQSxLQUFBO3dCQUNBLFVBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBO3dCQUNBLE1BQUE7NEJBQ0EsVUFBQSxlQUFBOzt1QkFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBO3dCQUNBLElBQUEsT0FBQSxLQUFBLE1BQUE7NEJBQ0EsT0FBQSxLQUFBLEdBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUEsTUFBQTs0QkFDQSxLQUFBLEdBQUE7O3NCQUVBLEtBQUE7Ozs7Ozs7OztnQkFTQSxJQUFBLFNBQUEsYUFBQTtvQkFDQSxTQUFBLEtBQUE7d0JBQ0EsVUFBQTt3QkFDQSxXQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTt3QkFDQSxNQUFBOzRCQUNBLFVBQUEsZUFBQTs7dUJBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLE9BQUEsS0FBQSxNQUFBOzRCQUNBLE9BQUEsS0FBQSxHQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBLE1BQUE7NEJBQ0EsS0FBQSxHQUFBOztzQkFFQSxLQUFBOzs7Ozs7O2dCQU9BLFdBQUEsU0FBQSxVQUFBO29CQUNBLFNBQUEsS0FBQTt3QkFDQSxVQUFBO3dCQUNBLFdBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBO3dCQUNBLE1BQUE7NEJBQ0EsVUFBQTs7Ozs7Ozs7O2dCQVNBLFFBQUEsU0FBQSxVQUFBO29CQUNBLFNBQUEsS0FBQTt3QkFDQSxVQUFBO3dCQUNBLFlBQUE7d0JBQ0EsY0FBQTt3QkFDQSxNQUFBOzRCQUNBLFVBQUE7Ozs7Ozs7QUFPQSIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1Jhc3RyZWlvSGVscGVyJywgZnVuY3Rpb24oUmFzdHJlaW8sIG5nRGlhbG9nKSB7XG4gICAgICAgICAgICB2YXIgdm07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSB1bWEgbm92YSBpbnN0w6JuY2lhXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSB2bVxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbih2bSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtID0gdm07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIERldm9sdcOnw6NvXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGV2b2x1Y2FvOiBmdW5jdGlvbihyYXN0cmVpb19pZCkge1xuICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvZGV2b2x1Y2FvL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGV2b2x1Y2FvRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRGV2b2x1Y2FvRm9ybScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvX2lkIHx8IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnZtICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMudm0ubG9hZCAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEudmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9LFxuXG5cblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFBJXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcGk6IGZ1bmN0aW9uKHJhc3RyZWlvX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9waS9mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BpRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnUGlGb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9faWQgfHwgbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMudm0gIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy52bS5sb2FkICE9ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBMb2fDrXN0aWNhIHJldmVyc2FcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsb2dpc3RpY2E6IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9sb2dpc3RpY2EuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naXN0aWNhQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdMb2dpc3RpY2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRWRpdGFyIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZWRpdGFyOiBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZWRpdGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRhckNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRWRpdGFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
