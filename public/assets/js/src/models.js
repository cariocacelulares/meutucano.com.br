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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudGUuanMiLCJMaW5oYS5qcyIsIlBlZGlkby5qcyIsIlBpLmpzIiwiUmFzdHJlaW8uanMiLCJTZW5oYS5qcyIsIlVzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7UUFFQSxTQUFBLGFBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxXQUFBLE1BQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxVQUFBOztRQUVBLFNBQUEsWUFBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsTUFBQTs7UUFFQSxTQUFBLFFBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsV0FBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7Ozs7Z0JBUUEsU0FBQSxTQUFBLFFBQUE7b0JBQ0EsU0FBQSxLQUFBLFlBQUE7O29CQUVBLE9BQUEsWUFBQSxJQUFBLGVBQUEsVUFBQSxJQUFBLFVBQUE7Ozs7WUFJQSxPQUFBOzs7O0FDMUJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFlBQUE7O1FBRUEsU0FBQSxjQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFdBQUE7O1lBRUEsUUFBQSxPQUFBLE1BQUE7Ozs7Ozs7O2dCQVFBLFdBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBOztvQkFFQSxPQUFBLFlBQUEsSUFBQSx1QkFBQSxVQUFBLElBQUEsVUFBQTs7Ozs7Ozs7Z0JBUUEsWUFBQSxXQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLHlCQUFBOzs7O1lBSUEsT0FBQTs7OztBQ25DQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxTQUFBOztRQUVBLFNBQUEsV0FBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxXQUFBOztZQUVBLFFBQUEsT0FBQSxNQUFBOzs7Ozs7Ozs7Z0JBU0EsVUFBQSxTQUFBLElBQUEsUUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxrQkFBQSxJQUFBLFVBQUEsSUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQ3pCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxXQUFBOztRQUVBLFNBQUEsYUFBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7QUFHQSIsImZpbGUiOiJtb2RlbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnQ2xpZW50ZScsIENsaWVudGVNb2RlbCk7IFxuXG4gICAgICAgIGZ1bmN0aW9uIENsaWVudGVNb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdjbGllbnRlcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0xpbmhhJywgTGluaGFNb2RlbCk7IFxuXG4gICAgICAgIGZ1bmN0aW9uIExpbmhhTW9kZWwoUmVzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAnbGluaGFzJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnUGVkaWRvJywgUGVkaWRvTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFBlZGlkb01vZGVsKFJlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ3BlZGlkb3MnO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpIFxuICAgICAgICAuc2VydmljZSgnUGknLCBQaU1vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBQaU1vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCAgID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsICA9ICdwaXMnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIGFzIFBJJ3MgcGVuZGVudGVzIGRlIHJlc3Bvc3RhXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcGVuZGluZzogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMucGFyc2VQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ3Bpcy9wZW5kaW5nJykuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpIFxuICAgICAgICAuc2VydmljZSgnUmFzdHJlaW8nLCBSYXN0cmVpb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBSYXN0cmVpb01vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCAgID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsICA9ICdyYXN0cmVpb3MnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIG9zIHJhc3RyZWlvcyBpbXBvcnRhbnRlcyBcbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpbXBvcnRhbnQ6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdyYXN0cmVpb3MvaW1wb3J0YW50JykuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEF0dWFsaXphIG8gc3RhdHVzIGRlIHRvZG9zIHJhc3RyZWlvc1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ3Jhc3RyZWlvcy9yZWZyZXNoX2FsbCcpLmN1c3RvbVBVVCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdTZW5oYScsIFNlbmhhTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFNlbmhhTW9kZWwoUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ3Nlbmhhcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgc2VuaGFzIGRvIHVzdcOhcmlvXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7aW50fSAgICBpZCAgICAgXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZnJvbVVzZXI6IGZ1bmN0aW9uKGlkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2VuaGFzL3VzdWFyaW8nLCBpZCkuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1VzdWFyaW8nLCBVc3VhcmlvTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFVzdWFyaW9Nb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICd1c3Vhcmlvcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
