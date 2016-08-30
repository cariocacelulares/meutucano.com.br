(function() {
    'use strict';

        ClienteModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Cliente', ClienteModel);

        function ClienteModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'clientes';

            angular.extend(rest, {
                /**
                 * Retorna os rastreios importantes
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                detail: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('clientes/detail').customGET(params || {});
                }
            });

            return rest;
        }
})();

(function() {
    'use strict';

        ComentarioModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Comentario', ComentarioModel);

        function ComentarioModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'comentarios';

            angular.extend(rest, {
                /**
                 * Retorna os comentários de um pedido ordenados de forma descrescente por data
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                getFromOrder: function(params) {
                    params = this.parseParams(params);
                    return Restangular.all('comentarios').customGET(params || {});
                },
            });

            return rest;
        }
})();

(function() {
    'use strict';

        Devolucao.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Devolucao', Devolucao);

        function Devolucao(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'devolucoes';

            angular.extend(rest, {
                /**
                 * Retorna as Devolucaoes pendentes de resposta
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                pending: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('devolucoes/pending').customGET("", params || {});
                },
            });

            return rest;
        }
})();

(function() {
    'use strict';

        LinhaModel.$inject = ["Rest"];
    angular
        .module('MeuTucano')
        .service('Linha', LinhaModel); 

        function LinhaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'linhas';

            return rest;
        }
})();

(function() {
    'use strict';

        LogisticaModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Logistica', LogisticaModel);

        function LogisticaModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'logisticas';

            return rest;
        }
})();

(function() {
    'use strict';

        LinhaModel.$inject = ["Rest"];
    angular
        .module('MeuTucano')
        .service('Marca', LinhaModel);

        function LinhaModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'marcas';

            return rest;
        }
})();

(function() {
    'use strict';

        PedidoModel.$inject = ["Rest"];
    angular
        .module('MeuTucano')
        .service('Pedido', PedidoModel);

        function PedidoModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'pedidos';

            return rest;
        }
})();

(function() {
    'use strict';

        PiModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano') 
        .service('Pi', PiModel);

        function PiModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'pis';

            angular.extend(rest, {

                /**
                 * Retorna as PI's pendentes de resposta
                 * 
                 * @param  {Object} params 
                 * @return {Object}        
                 */
                pending: function(params) {
                    params = this.parseParams(params);
                    
                    return Restangular.all('pis/pending').customGET("", params || {});
                },
            });

            return rest;
        }
})();

(function() {
    'use strict';

        RastreioModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Rastreio', RastreioModel);

        function RastreioModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'rastreios';

            angular.extend(rest, {
                /**
                 * Retorna os rastreios importantes
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                important: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all('rastreios/important').customGET("", params || {});
                },

                /**
                 * Atualiza o status de todos rastreios
                 *
                 * @return {Object}
                 */
                refreshAll: function() {
                    return Restangular.all('rastreios/refresh_all').customPUT();
                }
            });

            return rest;
        }
})();

(function() {
    'use strict';

        SenhaModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Senha', SenhaModel);

        function SenhaModel(Rest, Restangular) {
            var rest   = angular.copy(Rest);
            rest.baseUrl  = 'senhas';

            angular.extend(rest, {

                /**
                 * Retorna senhas do usuário
                 * 
                 * @param  {int}    id     
                 * @param  {Object} params 
                 * @return {Object}        
                 */
                fromUser: function(id, params) {
                    return Restangular.one('senhas/usuario', id).customGET("", params || {});
                }
            });

            return rest;
        }
})();

(function() {
    'use strict';

        UsuarioModel.$inject = ["Rest"];
    angular
        .module('MeuTucano')
        .service('Usuario', UsuarioModel);

        function UsuarioModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'usuarios';

            return rest;
        }
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudGUuanMiLCJDb21lbnRhcmlvLmpzIiwiRGV2b2x1Y2FvLmpzIiwiTGluaGEuanMiLCJMb2dpc3RpY2EuanMiLCJNYXJjYS5qcyIsIlBlZGlkby5qcyIsIlBpLmpzIiwiUmFzdHJlaW8uanMiLCJTZW5oYS5qcyIsIlVzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7UUFFQSxTQUFBLGFBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxRQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTs7b0JBRUEsT0FBQSxZQUFBLElBQUEsbUJBQUEsVUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQ3pCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxjQUFBOztRQUVBLFNBQUEsZ0JBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxjQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxlQUFBLFVBQUEsVUFBQTs7OztZQUlBLE9BQUE7Ozs7QUN4QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsYUFBQTs7UUFFQSxTQUFBLFVBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsV0FBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxTQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTs7b0JBRUEsT0FBQSxZQUFBLElBQUEsc0JBQUEsVUFBQSxJQUFBLFVBQUE7Ozs7WUFJQSxPQUFBOzs7O0FDekJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxXQUFBLE1BQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxhQUFBOztRQUVBLFNBQUEsZUFBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxXQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxTQUFBOztRQUVBLFNBQUEsV0FBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsVUFBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFdBQUE7O1lBRUEsUUFBQSxPQUFBLE1BQUE7Ozs7Ozs7O2dCQVFBLFNBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBOztvQkFFQSxPQUFBLFlBQUEsSUFBQSxlQUFBLFVBQUEsSUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQzFCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxZQUFBOztRQUVBLFNBQUEsY0FBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxXQUFBOztZQUVBLFFBQUEsT0FBQSxNQUFBOzs7Ozs7O2dCQU9BLFdBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBOztvQkFFQSxPQUFBLFlBQUEsSUFBQSx1QkFBQSxVQUFBLElBQUEsVUFBQTs7Ozs7Ozs7Z0JBUUEsWUFBQSxXQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLHlCQUFBOzs7O1lBSUEsT0FBQTs7OztBQ2xDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxTQUFBOztRQUVBLFNBQUEsV0FBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxXQUFBOztZQUVBLFFBQUEsT0FBQSxNQUFBOzs7Ozs7Ozs7Z0JBU0EsVUFBQSxTQUFBLElBQUEsUUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxrQkFBQSxJQUFBLFVBQUEsSUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQ3pCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxXQUFBOztRQUVBLFNBQUEsYUFBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7QUFHQSIsImZpbGUiOiJtb2RlbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnQ2xpZW50ZScsIENsaWVudGVNb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gQ2xpZW50ZU1vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdjbGllbnRlcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIG9zIHJhc3RyZWlvcyBpbXBvcnRhbnRlc1xuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2NsaWVudGVzL2RldGFpbCcpLmN1c3RvbUdFVChwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdDb21lbnRhcmlvJywgQ29tZW50YXJpb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBDb21lbnRhcmlvTW9kZWwoUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ2NvbWVudGFyaW9zJztcblxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQocmVzdCwge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgb3MgY29tZW50w6FyaW9zIGRlIHVtIHBlZGlkbyBvcmRlbmFkb3MgZGUgZm9ybWEgZGVzY3Jlc2NlbnRlIHBvciBkYXRhXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRGcm9tT3JkZXI6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ2NvbWVudGFyaW9zJykuY3VzdG9tR0VUKHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdEZXZvbHVjYW8nLCBEZXZvbHVjYW8pO1xuXG4gICAgICAgIGZ1bmN0aW9uIERldm9sdWNhbyhSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgICA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCAgPSAnZGV2b2x1Y29lcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIGFzIERldm9sdWNhb2VzIHBlbmRlbnRlcyBkZSByZXNwb3N0YVxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcGVuZGluZzogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMucGFyc2VQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdkZXZvbHVjb2VzL3BlbmRpbmcnKS5jdXN0b21HRVQoXCJcIiwgcGFyYW1zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0xpbmhhJywgTGluaGFNb2RlbCk7IFxuXG4gICAgICAgIGZ1bmN0aW9uIExpbmhhTW9kZWwoUmVzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAnbGluaGFzJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnTG9naXN0aWNhJywgTG9naXN0aWNhTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIExvZ2lzdGljYU1vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCAgID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsICA9ICdsb2dpc3RpY2FzJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnTWFyY2EnLCBMaW5oYU1vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBMaW5oYU1vZGVsKFJlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ21hcmNhcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1BlZGlkbycsIFBlZGlkb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBQZWRpZG9Nb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdwZWRpZG9zJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKSBcbiAgICAgICAgLnNlcnZpY2UoJ1BpJywgUGlNb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gUGlNb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgICA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCAgPSAncGlzJztcblxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQocmVzdCwge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSBhcyBQSSdzIHBlbmRlbnRlcyBkZSByZXNwb3N0YVxuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHBlbmRpbmc6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdwaXMvcGVuZGluZycpLmN1c3RvbUdFVChcIlwiLCBwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnUmFzdHJlaW8nLCBSYXN0cmVpb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBSYXN0cmVpb01vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCAgID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsICA9ICdyYXN0cmVpb3MnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSBvcyByYXN0cmVpb3MgaW1wb3J0YW50ZXNcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGltcG9ydGFudDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMucGFyc2VQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdyYXN0cmVpb3MvaW1wb3J0YW50JykuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEF0dWFsaXphIG8gc3RhdHVzIGRlIHRvZG9zIHJhc3RyZWlvc1xuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJlZnJlc2hBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdyYXN0cmVpb3MvcmVmcmVzaF9hbGwnKS5jdXN0b21QVVQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnU2VuaGEnLCBTZW5oYU1vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBTZW5oYU1vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCAgID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsICA9ICdzZW5oYXMnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIHNlbmhhcyBkbyB1c3XDoXJpb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgaWQgICAgIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZyb21Vc2VyOiBmdW5jdGlvbihpZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUoJ3Nlbmhhcy91c3VhcmlvJywgaWQpLmN1c3RvbUdFVChcIlwiLCBwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdVc3VhcmlvJywgVXN1YXJpb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBVc3VhcmlvTW9kZWwoUmVzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAndXN1YXJpb3MnO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
