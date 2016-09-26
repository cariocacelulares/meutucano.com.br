(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'AuthController as Auth'
                })

                .state('app', {
                    url: '/app',
                    templateUrl: 'views/layouts/app.html',
                    controller: 'AppController as App'
                })

                .state('app.dashboard', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard.html',
                    controller: 'DashboardController as Dashboard'
                })

                /**
                 * Rastreio
                 */
                .state('app.rastreios', {
                    url: '/rastreios',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin', 'atendimento']
                    }
                })

                .state('app.rastreios.importantes', {
                    url: '/importantes',
                    templateUrl: 'views/rastreio/importante/list.html',
                    controller: 'RastreioImportanteListController as RastreioImportanteList'
                })

                .state('app.rastreios.pis', {
                    url: '/pis',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.rastreios.pis.pendentes', {
                    url: '/pendentes',
                    templateUrl: 'views/rastreio/pi/pendente/list.html',
                    controller: 'PiPendenteListController as PiPendenteList'
                })

                .state('app.rastreios.devolucoes', {
                    url: '/devolucoes',
                    templateUrl: 'views/rastreio/devolucao/pendente/list.html',
                    controller: 'DevolucaoPendenteListController as DevolucaoList'
                })

                /**
                 * Faturamento
                 */
                .state('app.faturamento', {
                    url: '/faturamento',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin', 'faturamento']
                    }
                })

                .state('app.faturamento.index', {
                    url: '/list',
                    templateUrl: 'views/faturamento/list.html',
                    controller: 'FaturamentoListController as FaturamentoList'
                })

                .state('app.faturamento.notas', {
                    url: '/notas',
                    templateUrl: 'views/faturamento/notas.html',
                    controller: 'FaturamentoController as Faturamento'
                })

                /**
                 * Admin
                 */
                .state('app.admin', {
                    url: '/admin',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin']
                    }
                })

                .state('app.admin.icms', {
                    url: '/icms',
                    templateUrl: 'views/admin/icms.html',
                    controller: 'IcmsController as Icms'
                })

                /**
                 * Pedidos
                 */
                .state('app.pedidos', {
                    url: '/pedidos',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin', 'gestor', 'atendimento']
                    }
                })

                .state('app.pedidos.index', {
                    url: '/list',
                    templateUrl: 'views/pedido/list.html',
                    controller: 'PedidoListController as PedidoList'
                })

                .state('app.pedidos.detalhe', {
                    url: '/{id}',
                    templateUrl: 'views/pedido/detalhe.html',
                    controller: 'PedidoDetalheController as PedidoDetalhe'
                })

                /**
                 * Clientes
                 */
                .state('app.clientes', {
                    url: '/clientes',
                    templateUrl: 'views/layouts/default.html',
                    roles: ['admin', 'gestor']
                })

                .state('app.clientes.index', {
                    url: '/list',
                    templateUrl: 'views/cliente/list.html',
                    controller: 'ClienteListController as ClienteList'
                })

                .state('app.clientes.detalhe', {
                    url: '/{id}',
                    templateUrl: 'views/cliente/detalhe.html',
                    controller: 'ClienteDetalheController as ClienteDetalhe'
                })

                /**
                 * Usuários
                 */
                .state('app.interno', {
                    url: '/interno',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.interno.usuarios', {
                    url: '/usuarios',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.interno.usuarios.index', {
                    url: '/list',
                    templateUrl: 'views/usuario/list.html',
                    controller: 'UsuarioListController as UsuarioList',
                    data: {
                        roles: ['admin']
                    }
                })

                .state('app.interno.usuarios.senhas', {
                    url: '/{id}/senhas',
                    templateUrl: 'views/usuario/senha/list.html',
                    controller: 'SenhaListController as SenhaList'
                })

                /**
                 * Senhas
                 */
                .state('app.interno.senhas', {
                    url: '/interno',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.interno.senhas.minhas', {
                    url: '/minhas',
                    templateUrl: 'views/usuario/senha/minhas.html',
                    controller: 'MinhaSenhaController as MinhaSenha'
                })

                /**
                 * Marketing
                 */
                .state('app.marketing', {
                    url: '/marketing',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.marketing.templateml', {
                    url: '/templateml',
                    templateUrl: 'views/marketing/templateml.html',
                    controller: 'TemplatemlController as Templateml'
                })

                /**
                 * Produtos
                 */
                .state('app.produtos', {
                    url: '/produtos',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin', 'gestor']
                    }
                })

                .state('app.produtos.index', {
                    url: '/list',
                    templateUrl: 'views/produto/list.html',
                    controller: 'ProdutoListController as ProdutoList',
                    data: {
                        roles: ['admin']
                    }
                })

                .state('app.produtos.form', {
                    url: '/{sku}',
                    templateUrl: 'views/produto/form.html',
                    controller: 'ProdutoFormController as ProdutoForm'
                })

                /**
                 * Linhas
                 */
                .state('app.produtos.linhas', {
                    url: '/linhas',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.produtos.linhas.index', {
                    url: '/list',
                    templateUrl: 'views/produto/linha/list.html',
                    controller: 'LinhaListController as LinhaList',
                    data: {
                        roles: ['admin']
                    }
                })

                .state('app.produtos.linhas.form', {
                    url: '/{id}',
                    templateUrl: 'views/produto/linha/form.html',
                    controller: 'LinhaFormController as LinhaForm'
                })

                /**
                 * Marcas
                 */
                .state('app.produtos.marcas', {
                    url: '/marcas',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.produtos.marcas.index', {
                    url: '/list',
                    templateUrl: 'views/produto/marca/list.html',
                    controller: 'MarcaListController as MarcaList',
                    data: {
                        roles: ['admin']
                    }
                })

                .state('app.produtos.marcas.form', {
                    url: '/{id}',
                    templateUrl: 'views/produto/marca/form.html',
                    controller: 'MarcaFormController as MarcaForm'
                })
            ;
        });
})();
