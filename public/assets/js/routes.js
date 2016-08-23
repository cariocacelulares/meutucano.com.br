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
                    templateUrl: 'views/pi/pendente/list.html', 
                    controller: 'PiPendenteListController as PiPendenteList'
                })

                .state('app.atendimento.devolucoes', {
                    url: '/devolucoes',
                    templateUrl: 'views/atendimento/devolucoes.html',
                    controller: 'DevolucaoListController as Devolucao'
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
                    templateUrl: 'views/layouts/default.html'
                })
 
                .state('app.admin.icms', { 
                    url: '/icms',
                    templateUrl: 'views/admin/icms.html',
                    controller: 'IcmsController as Icms',
                    data: {
                        roles: ['admin']
                    }
                })

                /**
                 * Pedidos
                 */
                .state('app.pedidos', {
                    url: '/pedidos',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.pedidos.index', {
                    url: '/list',
                    templateUrl: 'views/pedido/list.html',
                    controller: 'PedidoListController as PedidoList',
                    data: {
                        roles: ['admin']
                    }
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
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.clientes.index', { 
                    url: '/list',
                    templateUrl: 'views/cliente/list.html',
                    controller: 'ClienteListController as ClienteList',
                    data: {
                        roles: ['admin']
                    }
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
                    templateUrl: 'views/senha/list.html',
                    controller: 'SenhaListController as SenhaList'
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
                 * Interno
                 */
                .state('app.interno.senhas', {
                    url: '/senhas',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.interno.senhas.usuario', {
                    
                })

                .state('app.interno.senhas.minhas', {
                    url: '/minhas',
                    templateUrl: 'views/interno/senhas/minhas.html',
                    controller: 'MinhaSenhaController as MinhaSenha'
                })
            ;
        });
})();
