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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudGUuanMiLCJQZWRpZG8uanMiLCJTZW5oYS5qcyIsIlVzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7UUFFQSxTQUFBLGFBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFVBQUE7O1FBRUEsU0FBQSxZQUFBLE1BQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxTQUFBOztRQUVBLFNBQUEsV0FBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxXQUFBOztZQUVBLFFBQUEsT0FBQSxNQUFBOzs7Ozs7Ozs7Z0JBU0EsVUFBQSxTQUFBLElBQUEsUUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxrQkFBQSxJQUFBLFVBQUEsSUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQ3pCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxXQUFBOztRQUVBLFNBQUEsYUFBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7QUFHQSIsImZpbGUiOiJtb2RlbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnQ2xpZW50ZScsIENsaWVudGVNb2RlbCk7IFxuXG4gICAgICAgIGZ1bmN0aW9uIENsaWVudGVNb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdjbGllbnRlcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1BlZGlkbycsIFBlZGlkb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBQZWRpZG9Nb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdwZWRpZG9zJztcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnU2VuaGEnLCBTZW5oYU1vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBTZW5oYU1vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCAgID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsICA9ICdzZW5oYXMnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIHNlbmhhcyBkbyB1c3XDoXJpb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgaWQgICAgIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZyb21Vc2VyOiBmdW5jdGlvbihpZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUoJ3Nlbmhhcy91c3VhcmlvJywgaWQpLmN1c3RvbUdFVChcIlwiLCBwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdVc3VhcmlvJywgVXN1YXJpb01vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBVc3VhcmlvTW9kZWwoUmVzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAndXN1YXJpb3MnO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
