(function() {
    'use strict';

        ClienteModel.$inject = ["Rest"];
    angular
        .module('MeuTucano')
        .service('Cliente', ClienteModel); 

        function ClienteModel(Rest) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'clientes';

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudGUuanMiLCJDb21lbnRhcmlvLmpzIiwiRGV2b2x1Y2FvLmpzIiwiTGluaGEuanMiLCJMb2dpc3RpY2EuanMiLCJNYXJjYS5qcyIsIlBlZGlkby5qcyIsIlBpLmpzIiwiUmFzdHJlaW8uanMiLCJTZW5oYS5qcyIsIlVzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7UUFFQSxTQUFBLGFBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLGNBQUE7O1FBRUEsU0FBQSxnQkFBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLFFBQUEsT0FBQSxNQUFBOzs7Ozs7O2dCQU9BLGNBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLGVBQUEsVUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQ3hCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxhQUFBOztRQUVBLFNBQUEsVUFBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxXQUFBOztZQUVBLFFBQUEsT0FBQSxNQUFBOzs7Ozs7O2dCQU9BLFNBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBOztvQkFFQSxPQUFBLFlBQUEsSUFBQSxzQkFBQSxVQUFBLElBQUEsVUFBQTs7OztZQUlBLE9BQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsU0FBQTs7UUFFQSxTQUFBLFdBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLGFBQUE7O1FBRUEsU0FBQSxlQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFdBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxXQUFBLE1BQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxVQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsV0FBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7Ozs7Z0JBUUEsU0FBQSxTQUFBLFFBQUE7b0JBQ0EsU0FBQSxLQUFBLFlBQUE7O29CQUVBLE9BQUEsWUFBQSxJQUFBLGVBQUEsVUFBQSxJQUFBLFVBQUE7Ozs7WUFJQSxPQUFBOzs7O0FDMUJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFlBQUE7O1FBRUEsU0FBQSxjQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFdBQUE7O1lBRUEsUUFBQSxPQUFBLE1BQUE7Ozs7Ozs7Z0JBT0EsV0FBQSxTQUFBLFFBQUE7b0JBQ0EsU0FBQSxLQUFBLFlBQUE7O29CQUVBLE9BQUEsWUFBQSxJQUFBLHVCQUFBLFVBQUEsSUFBQSxVQUFBOzs7Ozs7OztnQkFRQSxZQUFBLFdBQUE7b0JBQ0EsT0FBQSxZQUFBLElBQUEseUJBQUE7Ozs7WUFJQSxPQUFBOzs7O0FDbENBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxXQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFdBQUE7O1lBRUEsUUFBQSxPQUFBLE1BQUE7Ozs7Ozs7OztnQkFTQSxVQUFBLFNBQUEsSUFBQSxRQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLGtCQUFBLElBQUEsVUFBQSxJQUFBLFVBQUE7Ozs7WUFJQSxPQUFBOzs7O0FDekJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFdBQUE7O1FBRUEsU0FBQSxhQUFBLE1BQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLE9BQUE7OztBQUdBIiwiZmlsZSI6Im1vZGVscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdDbGllbnRlJywgQ2xpZW50ZU1vZGVsKTsgXG5cbiAgICAgICAgZnVuY3Rpb24gQ2xpZW50ZU1vZGVsKFJlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ2NsaWVudGVzJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnQ29tZW50YXJpbycsIENvbWVudGFyaW9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gQ29tZW50YXJpb01vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdjb21lbnRhcmlvcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIG9zIGNvbWVudMOhcmlvcyBkZSB1bSBwZWRpZG8gb3JkZW5hZG9zIGRlIGZvcm1hIGRlc2NyZXNjZW50ZSBwb3IgZGF0YVxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0RnJvbU9yZGVyOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdjb21lbnRhcmlvcycpLmN1c3RvbUdFVChwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnRGV2b2x1Y2FvJywgRGV2b2x1Y2FvKTtcblxuICAgICAgICBmdW5jdGlvbiBEZXZvbHVjYW8oUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ2Rldm9sdWNvZXMnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSBhcyBEZXZvbHVjYW9lcyBwZW5kZW50ZXMgZGUgcmVzcG9zdGFcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHBlbmRpbmc6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnZGV2b2x1Y29lcy9wZW5kaW5nJykuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdMaW5oYScsIExpbmhhTW9kZWwpOyBcblxuICAgICAgICBmdW5jdGlvbiBMaW5oYU1vZGVsKFJlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ2xpbmhhcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0xvZ2lzdGljYScsIExvZ2lzdGljYU1vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBMb2dpc3RpY2FNb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgICA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCAgPSAnbG9naXN0aWNhcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ01hcmNhJywgTGluaGFNb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gTGluaGFNb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdtYXJjYXMnO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdQZWRpZG8nLCBQZWRpZG9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gUGVkaWRvTW9kZWwoUmVzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAncGVkaWRvcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJykgXG4gICAgICAgIC5zZXJ2aWNlKCdQaScsIFBpTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFBpTW9kZWwoUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ3Bpcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgYXMgUEkncyBwZW5kZW50ZXMgZGUgcmVzcG9zdGFcbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwZW5kaW5nOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgncGlzL3BlbmRpbmcnKS5jdXN0b21HRVQoXCJcIiwgcGFyYW1zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1Jhc3RyZWlvJywgUmFzdHJlaW9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmFzdHJlaW9Nb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgICA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCAgPSAncmFzdHJlaW9zJztcblxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQocmVzdCwge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgb3MgcmFzdHJlaW9zIGltcG9ydGFudGVzXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpbXBvcnRhbnQ6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgncmFzdHJlaW9zL2ltcG9ydGFudCcpLmN1c3RvbUdFVChcIlwiLCBwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBBdHVhbGl6YSBvIHN0YXR1cyBkZSB0b2RvcyByYXN0cmVpb3NcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZWZyZXNoQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgncmFzdHJlaW9zL3JlZnJlc2hfYWxsJykuY3VzdG9tUFVUKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1NlbmhhJywgU2VuaGFNb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gU2VuaGFNb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgICA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCAgPSAnc2VuaGFzJztcblxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQocmVzdCwge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSBzZW5oYXMgZG8gdXN1w6FyaW9cbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtpbnR9ICAgIGlkICAgICBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmcm9tVXNlcjogZnVuY3Rpb24oaWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKCdzZW5oYXMvdXN1YXJpbycsIGlkKS5jdXN0b21HRVQoXCJcIiwgcGFyYW1zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnVXN1YXJpbycsIFVzdWFyaW9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gVXN1YXJpb01vZGVsKFJlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ3VzdWFyaW9zJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
