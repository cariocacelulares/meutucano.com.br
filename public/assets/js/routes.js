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
                 * Atendimento
                 */
                .state('app.atendimento', {
                    url: '/atendimento',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin', 'atendimento']
                    }
                })

                .state('app.atendimento.rastreio', {
                    url: '/rastreio',
                    templateUrl: 'views/atendimento/rastreio.html',
                    controller: 'RastreioController as Rastreio'
                })

                .state('app.atendimento.pis', {
                    url: '/pis',
                    templateUrl: 'views/atendimento/pis.html',
                    controller: 'PiListController as Pi'
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

                /**
                 * Usuários
                 */
                .state('app.interno', {
                    url: '/interno',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.interno.usuarios', {
                    url: '/usuarios',
                    templateUrl: 'views/interno/usuarios.html',
                    controller: 'UsuarioController as Usuario',
                    data: {
                        roles: ['admin']
                    }
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
                    url: '/usuario/{id}',
                    templateUrl: 'views/interno/senhas/usuario.html',
                    controller: 'UsuarioSenhaController as UsuarioSenha'
                })

                .state('app.interno.senhas.minhas', {
                    url: '/minhas',
                    templateUrl: 'views/interno/senhas/minhas.html',
                    controller: 'MinhaSenhaController as MinhaSenha'
                })
            ;
        });
})();
