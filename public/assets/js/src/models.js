(function() {
    'use strict';

        AtributoModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Atributo', AtributoModel);

        function AtributoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'atributos';

            angular.extend(rest, {
                /**
                 * Retorna os atributos relacionado a uma linha
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                fromLinha: function(params) {
                    params = this.parseParams(params);
                    // console.log(params);

                    return Restangular.all('atributos/linha').customGET(params || {});
                }
            });

            return rest;
        }
})();

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

        MarcaModel.$inject = ["Rest"];
    angular
        .module('MeuTucano')
        .service('Marca', MarcaModel);

        function MarcaModel(Rest) {
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

        ProdutoModel.$inject = ["Rest", "Restangular"];
    angular
        .module('MeuTucano')
        .service('Produto', ProdutoModel);

        function ProdutoModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'produtos';

            angular.extend(rest, {
                /**
                 * Gera um novo SKU para o produto
                 *
                 * @param  {Object} params
                 * @return {Object}
                 */
                generateSku: function(params) {
                    params = this.parseParams(params);

                    return Restangular.one(rest.baseUrl + '/generatesku').customGET(params.sku || null);
                }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF0cmlidXRvLmpzIiwiQ2xpZW50ZS5qcyIsIkNvbWVudGFyaW8uanMiLCJEZXZvbHVjYW8uanMiLCJMaW5oYS5qcyIsIkxvZ2lzdGljYS5qcyIsIk1hcmNhLmpzIiwiUGVkaWRvLmpzIiwiUGkuanMiLCJQcm9kdXRvLmpzIiwiUmFzdHJlaW8uanMiLCJTZW5oYS5qcyIsIlVzdWFyaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsWUFBQTs7UUFFQSxTQUFBLGNBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxXQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTs7O29CQUdBLE9BQUEsWUFBQSxJQUFBLG1CQUFBLFVBQUEsVUFBQTs7OztZQUlBLE9BQUE7Ozs7QUMxQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7UUFFQSxTQUFBLGFBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxRQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTs7b0JBRUEsT0FBQSxZQUFBLElBQUEsbUJBQUEsVUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQ3pCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxjQUFBOztRQUVBLFNBQUEsZ0JBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxjQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxlQUFBLFVBQUEsVUFBQTs7OztZQUlBLE9BQUE7Ozs7QUN4QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsYUFBQTs7UUFFQSxTQUFBLFVBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsV0FBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxTQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTs7b0JBRUEsT0FBQSxZQUFBLElBQUEsc0JBQUEsVUFBQSxJQUFBLFVBQUE7Ozs7WUFJQSxPQUFBOzs7O0FDekJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxXQUFBLE1BQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxhQUFBOztRQUVBLFNBQUEsZUFBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLFNBQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxXQUFBOztZQUVBLE9BQUE7Ozs7QUNYQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxTQUFBOztRQUVBLFNBQUEsV0FBQSxNQUFBO1lBQ0EsSUFBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsVUFBQTs7WUFFQSxPQUFBOzs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsVUFBQTs7UUFFQSxTQUFBLFlBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLE1BQUE7O1FBRUEsU0FBQSxRQUFBLE1BQUEsYUFBQTtZQUNBLElBQUEsU0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFdBQUE7O1lBRUEsUUFBQSxPQUFBLE1BQUE7Ozs7Ozs7O2dCQVFBLFNBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBOztvQkFFQSxPQUFBLFlBQUEsSUFBQSxlQUFBLFVBQUEsSUFBQSxVQUFBOzs7O1lBSUEsT0FBQTs7OztBQzFCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxXQUFBOztRQUVBLFNBQUEsYUFBQSxNQUFBLGFBQUE7WUFDQSxJQUFBLE9BQUEsUUFBQSxLQUFBO1lBQ0EsS0FBQSxVQUFBOztZQUVBLFFBQUEsT0FBQSxNQUFBOzs7Ozs7O2dCQU9BLGFBQUEsU0FBQSxRQUFBO29CQUNBLFNBQUEsS0FBQSxZQUFBOztvQkFFQSxPQUFBLFlBQUEsSUFBQSxLQUFBLFVBQUEsZ0JBQUEsVUFBQSxPQUFBLE9BQUE7Ozs7WUFJQSxPQUFBOzs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsWUFBQTs7UUFFQSxTQUFBLGNBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsV0FBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7OztnQkFPQSxXQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTs7b0JBRUEsT0FBQSxZQUFBLElBQUEsdUJBQUEsVUFBQSxJQUFBLFVBQUE7Ozs7Ozs7O2dCQVFBLFlBQUEsV0FBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSx5QkFBQTs7OztZQUlBLE9BQUE7Ozs7QUNsQ0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsU0FBQTs7UUFFQSxTQUFBLFdBQUEsTUFBQSxhQUFBO1lBQ0EsSUFBQSxTQUFBLFFBQUEsS0FBQTtZQUNBLEtBQUEsV0FBQTs7WUFFQSxRQUFBLE9BQUEsTUFBQTs7Ozs7Ozs7O2dCQVNBLFVBQUEsU0FBQSxJQUFBLFFBQUE7b0JBQ0EsT0FBQSxZQUFBLElBQUEsa0JBQUEsSUFBQSxVQUFBLElBQUEsVUFBQTs7OztZQUlBLE9BQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsV0FBQTs7UUFFQSxTQUFBLGFBQUEsTUFBQTtZQUNBLElBQUEsT0FBQSxRQUFBLEtBQUE7WUFDQSxLQUFBLFVBQUE7O1lBRUEsT0FBQTs7O0FBR0EiLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0F0cmlidXRvJywgQXRyaWJ1dG9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gQXRyaWJ1dG9Nb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAnYXRyaWJ1dG9zJztcblxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQocmVzdCwge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgb3MgYXRyaWJ1dG9zIHJlbGFjaW9uYWRvIGEgdW1hIGxpbmhhXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtc1xuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmcm9tTGluaGE6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnYXRyaWJ1dG9zL2xpbmhhJykuY3VzdG9tR0VUKHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0NsaWVudGUnLCBDbGllbnRlTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIENsaWVudGVNb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAnY2xpZW50ZXMnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSBvcyByYXN0cmVpb3MgaW1wb3J0YW50ZXNcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGRldGFpbDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMucGFyc2VQYXJhbXMocGFyYW1zKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdjbGllbnRlcy9kZXRhaWwnKS5jdXN0b21HRVQocGFyYW1zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnQ29tZW50YXJpbycsIENvbWVudGFyaW9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gQ29tZW50YXJpb01vZGVsKFJlc3QsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdjb21lbnRhcmlvcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIG9zIGNvbWVudMOhcmlvcyBkZSB1bSBwZWRpZG8gb3JkZW5hZG9zIGRlIGZvcm1hIGRlc2NyZXNjZW50ZSBwb3IgZGF0YVxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0RnJvbU9yZGVyOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKCdjb21lbnRhcmlvcycpLmN1c3RvbUdFVChwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3Q7XG4gICAgICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnRGV2b2x1Y2FvJywgRGV2b2x1Y2FvKTtcblxuICAgICAgICBmdW5jdGlvbiBEZXZvbHVjYW8oUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ2Rldm9sdWNvZXMnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSBhcyBEZXZvbHVjYW9lcyBwZW5kZW50ZXMgZGUgcmVzcG9zdGFcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHBlbmRpbmc6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgnZGV2b2x1Y29lcy9wZW5kaW5nJykuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdMaW5oYScsIExpbmhhTW9kZWwpOyBcblxuICAgICAgICBmdW5jdGlvbiBMaW5oYU1vZGVsKFJlc3QpIHtcbiAgICAgICAgICAgIHZhciByZXN0ID0gYW5ndWxhci5jb3B5KFJlc3QpO1xuICAgICAgICAgICAgcmVzdC5iYXNlVXJsID0gJ2xpbmhhcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0xvZ2lzdGljYScsIExvZ2lzdGljYU1vZGVsKTtcblxuICAgICAgICBmdW5jdGlvbiBMb2dpc3RpY2FNb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgICA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCAgPSAnbG9naXN0aWNhcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ01hcmNhJywgTWFyY2FNb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gTWFyY2FNb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICdtYXJjYXMnO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdQZWRpZG8nLCBQZWRpZG9Nb2RlbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gUGVkaWRvTW9kZWwoUmVzdCkge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAncGVkaWRvcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJykgXG4gICAgICAgIC5zZXJ2aWNlKCdQaScsIFBpTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFBpTW9kZWwoUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ3Bpcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgYXMgUEkncyBwZW5kZW50ZXMgZGUgcmVzcG9zdGFcbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwZW5kaW5nOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCgncGlzL3BlbmRpbmcnKS5jdXN0b21HRVQoXCJcIiwgcGFyYW1zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1Byb2R1dG8nLCBQcm9kdXRvTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFByb2R1dG9Nb2RlbChSZXN0LCBSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIHJlc3QgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgPSAncHJvZHV0b3MnO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChyZXN0LCB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogR2VyYSB1bSBub3ZvIFNLVSBwYXJhIG8gcHJvZHV0b1xuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVTa3U6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZShyZXN0LmJhc2VVcmwgKyAnL2dlbmVyYXRlc2t1JykuY3VzdG9tR0VUKHBhcmFtcy5za3UgfHwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdSYXN0cmVpbycsIFJhc3RyZWlvTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFJhc3RyZWlvTW9kZWwoUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ3Jhc3RyZWlvcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIG9zIHJhc3RyZWlvcyBpbXBvcnRhbnRlc1xuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaW1wb3J0YW50OiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ3Jhc3RyZWlvcy9pbXBvcnRhbnQnKS5jdXN0b21HRVQoXCJcIiwgcGFyYW1zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQXR1YWxpemEgbyBzdGF0dXMgZGUgdG9kb3MgcmFzdHJlaW9zXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwoJ3Jhc3RyZWlvcy9yZWZyZXNoX2FsbCcpLmN1c3RvbVBVVCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdDtcbiAgICAgICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdTZW5oYScsIFNlbmhhTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFNlbmhhTW9kZWwoUmVzdCwgUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgICAgIHZhciByZXN0ICAgPSBhbmd1bGFyLmNvcHkoUmVzdCk7XG4gICAgICAgICAgICByZXN0LmJhc2VVcmwgID0gJ3Nlbmhhcyc7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHJlc3QsIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgc2VuaGFzIGRvIHVzdcOhcmlvXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7aW50fSAgICBpZCAgICAgXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZnJvbVVzZXI6IGZ1bmN0aW9uKGlkLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSgnc2VuaGFzL3VzdWFyaW8nLCBpZCkuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ1VzdWFyaW8nLCBVc3VhcmlvTW9kZWwpO1xuXG4gICAgICAgIGZ1bmN0aW9uIFVzdWFyaW9Nb2RlbChSZXN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IGFuZ3VsYXIuY29weShSZXN0KTtcbiAgICAgICAgICAgIHJlc3QuYmFzZVVybCA9ICd1c3Vhcmlvcyc7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICB9XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
