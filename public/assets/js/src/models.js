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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudGUuanMiLCJMaW5oYS5qcyIsIlBlZGlkby5qcyIsIlJhc3RyZWlvLmpzIiwiU2VuaGEuanMiLCJVc3VhcmlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFdBQUE7O1FBRUEsU0FBQSxhQUFBLE1BQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxTQUFBOztRQUVBLFNBQUEsV0FBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsVUFBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFlBQUE7O1FBRUEsU0FBQSxjQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFdBQUE7O1lBRUEsUUFBQSxPQUFBLE1BQUE7Ozs7Ozs7O2dCQVFBLFdBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBOztvQkFFQSxPQUFBLFlBQUEsSUFBQSx1QkFBQSxVQUFBLElBQUEsVUFBQTs7OztZQUlBLE9BQUE7Ozs7QUMxQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsU0FBQTs7UUFFQSxTQUFBLFdBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsV0FBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7Ozs7O2dCQVNBLFVBQUEsU0FBQSxJQUFBLFFBQUE7b0JBQ0EsT0FBQSxZQUFBLElBQUEsa0JBQUEsSUFBQSxVQUFBLElBQUEsVUFBQTs7OztZQUlBLE9BQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7UUFFQSxTQUFBLGFBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7O0FBR0EiLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0NsaWVudGUnLCBDbGllbnRlTW9kZWwpOyBcblxuICAgICAgICBmdW5jdGlvbiBDbGllbnRlTW9kZWwoUmVzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAnY2xpZW50ZXMnO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdMaW5oYScsIExpbmhhTW9kZWwpOyBcblxuICAgICAgICBmdW5jdGlvbiBMaW5oYU1vZGVsKFJlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ2xpbmhhcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1BlZGlkbycsIFBlZGlkb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBQZWRpZG9Nb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdwZWRpZG9zJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKSBcbiAgICAgICAgLnNlcnZpY2UoJ1Jhc3RyZWlvJywgUmFzdHJlaW9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gUmFzdHJlaW9Nb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgICA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCAgPSAncmFzdHJlaW9zJztcblxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQocmVzdCwge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSBvcyByYXN0cmVpb3MgaW1wb3J0YW50ZXMgXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaW1wb3J0YW50OiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgncmFzdHJlaW9zL2ltcG9ydGFudCcpLmN1c3RvbUdFVChcIlwiLCBwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdTZW5oYScsIFNlbmhhTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFNlbmhhTW9kZWwoUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ3Nlbmhhcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgc2VuaGFzIGRvIHVzdcOhcmlvXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7aW50fSAgICBpZCAgICAgXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZnJvbVVzZXI6IGZ1bmN0aW9uKGlkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2VuaGFzL3VzdWFyaW8nLCBpZCkuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1VzdWFyaW8nLCBVc3VhcmlvTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFVzdWFyaW9Nb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICd1c3Vhcmlvcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
