(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('RastreioHelper', ["Rastreio", "ngDialog", function (Rastreio, ngDialog) {
            return {

                /**
                 * Devolução
                 * @param rastreio
                 */
                devolucao: function(rastreio) {
                    ngDialog.open({
                        template: 'views/atendimento/partials/devolucao.html',
                        className: 'ngdialog-theme-default ngdialog-big',
                        controller: 'DevolucaoController',
                        controllerAs: 'Devolucao',
                        data: {
                            rastreio: rastreio
                        }
                    });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhc3RyZWlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsMkNBQUEsVUFBQSxVQUFBLFVBQUE7WUFDQSxPQUFBOzs7Ozs7Z0JBTUEsV0FBQSxTQUFBLFVBQUE7b0JBQ0EsU0FBQSxLQUFBO3dCQUNBLFVBQUE7d0JBQ0EsV0FBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7d0JBQ0EsTUFBQTs0QkFDQSxVQUFBOzs7Ozs7Ozs7Z0JBU0EsV0FBQSxTQUFBLFVBQUE7b0JBQ0EsU0FBQSxLQUFBO3dCQUNBLFVBQUE7d0JBQ0EsV0FBQTt3QkFDQSxZQUFBO3dCQUNBLGNBQUE7d0JBQ0EsTUFBQTs0QkFDQSxVQUFBOzs7Ozs7Ozs7Z0JBU0EsUUFBQSxTQUFBLFVBQUE7b0JBQ0EsU0FBQSxLQUFBO3dCQUNBLFVBQUE7d0JBQ0EsWUFBQTt3QkFDQSxjQUFBO3dCQUNBLE1BQUE7NEJBQ0EsVUFBQTs7Ozs7OztBQU9BIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnUmFzdHJlaW9IZWxwZXInLCBmdW5jdGlvbiAoUmFzdHJlaW8sIG5nRGlhbG9nKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRGV2b2x1w6fDo29cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBkZXZvbHVjYW86IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9kZXZvbHVjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGV2b2x1Y2FvQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdEZXZvbHVjYW8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogTG9nw61zdGljYSByZXZlcnNhXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbG9naXN0aWNhOiBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvbG9naXN0aWNhLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2lzdGljYUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTG9naXN0aWNhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEVkaXRhciByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGVkaXRhcjogZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2VkaXRhci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0VkaXRhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
