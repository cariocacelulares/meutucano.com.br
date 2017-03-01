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

                .state('app.rastreios.monitorados', {
                    url: '/monitorados',
                    templateUrl: 'views/rastreio/monitorado/list.html',
                    controller: 'RastreioMonitoradoListController as RastreioMonitoradoList'
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
                        roles: ['admin', 'gestor', 'atendimento', 'faturamento']
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
                    url: '/detalhe/{id}',
                    templateUrl: 'views/cliente/detalhe.html',
                    controller: 'ClienteDetalheController as ClienteDetalhe'
                })

                .state('app.clientes.form', {
                    url: '/{id}',
                    templateUrl: 'views/cliente/form.html',
                    controller: 'ClienteFormController as ClienteForm'
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
                 * Sugestões
                 */
                .state('app.interno.sugestoes', {
                    url: '/sugestoes',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.interno.sugestoes.index', {
                    url: '/list',
                    templateUrl: 'views/sugestoes/list.html',
                    controller: 'SugestaoListController as SugestaoList'
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

                .state('app.produtos.detalhe', {
                    url: '/detalhe/{sku}',
                    templateUrl: 'views/produto/detalhe.html',
                    controller: 'ProdutoDetalheController as ProdutoDetalhe'
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

                /**
                 * Inspeção técnica
                 */
                .state('app.inspecao', {
                    url: '/inspecao',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.inspecao.realizada', {
                    url: '/realizada',
                    templateUrl: 'views/inspecao/realizada/list.html',
                    controller: 'InspecaoRealizadaListController as InspecaoRealizadaList',
                    data: {
                        roles: ['admin', 'tecnico']
                    }
                })

                .state('app.inspecao.fila', {
                    url: '/fila',
                    templateUrl: 'views/inspecao/fila/list.html',
                    controller: 'InspecaoFilaListController as InspecaoFilaList',
                    data: {
                        roles: ['admin', 'tecnico']
                    }
                })

                .state('app.inspecao.solicitada', {
                    url: '/solicitada',
                    templateUrl: 'views/inspecao/solicitada/list.html',
                    controller: 'InspecaoSolicitadaListController as InspecaoSolicitadaList',
                    data: {
                        roles: ['admin', 'gestor', 'tecnico', 'atendimento']
                    }
                })

                /**
                 * Relatórios
                 */
                .state('app.relatorios', {
                    url: '/relatorios',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin']
                    }
                })

                .state('app.relatorios.pedidos', {
                    url: '/pedidos',
                    templateUrl: 'views/relatorio/pedidos.html',
                    controller: 'RelatorioPedidosController as RelatorioPedidos'
                })

                .state('app.relatorios.produtos', {
                    url: '/produtos',
                    templateUrl: 'views/relatorio/produtos.html',
                    controller: 'RelatorioProdutosController as RelatorioProdutos'
                })

                .state('app.relatorios.retirada-estoque', {
                    url: '/retirada-estoque',
                    templateUrl: 'views/relatorio/retirada-estoque.html',
                    controller: 'RelatorioRetiradaEstoqueController as RetiradaEstoque'
                })

                /**
                 * Gamification
                 */
                .state('app.gamification', {
                    url: '/gamification',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.gamification.ranking', {
                    url: '/ranking',
                    templateUrl: 'views/gamification/ranking.html',
                    controller: 'RankingController as Ranking'
                })

                .state('app.gamification.tarefas', {
                    url: '/tarefas',
                    templateUrl: 'views/gamification/tarefas/list.html',
                    controller: 'TarefaListController as TarefaList'
                })

                .state('app.gamification.conquistas', {
                    url: '/conquistas',
                    templateUrl: 'views/gamification/conquistas/list.html',
                    controller: 'ConquistaListController as ConquistaList'
                })

                .state('app.gamification.perfil', {
                    url: '/perfil/?{id}',
                    templateUrl: 'views/gamification/perfil.html',
                    controller: 'PerfilController as Perfil'
                })

                .state('app.gamification.recompensas', {
                    url: '/recompensas',
                    templateUrl: 'views/gamification/recompensas/list.html',
                    controller: 'RecompensaListController as RecompensaList'
                })

                .state('app.gamification.trocas', {
                    url: '/trocas',
                    templateUrl: 'views/gamification/trocas/list.html',
                    controller: 'TrocaListController as TrocaList'
                })

                .state('app.gamification.solicitacoes', {
                    url: '/solicitacoes',
                    templateUrl: 'views/gamification/solicitacoes/list.html',
                    controller: 'SolicitacaoListController as SolicitacaoList'
                })

                /**
                 * Allnation
                 */
                .state('app.allnation', {
                    url: '/allnation',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin']
                    }
                })

                .state('app.allnation.products', {
                    url: '/products',
                    templateUrl: 'views/layouts/default.html',
                })

                .state('app.allnation.products.index', {
                    url: '/list',
                    templateUrl: 'views/allnation/product/list.html',
                    controller: 'AllnationProductListController as AllnationProductList'
                })

                .state('app.allnation.products.form', {
                    url: '/{id}',
                    templateUrl: 'views/allnation/product/form.html',
                    controller: 'AllnationProductFormController as AllnationProductForm'
                })

                /**
                 * Estoque
                 */
                .state('app.estoque', {
                    url: '/estoque',
                    templateUrl: 'views/layouts/default.html',
                    data: {
                        roles: ['admin', 'gestor']
                    }
                })

                .state('app.estoque.index', {
                    url: '/list',
                    templateUrl: 'views/estoque/list.html',
                    controller: 'EstoqueListController as EstoqueList'
                })

                .state('app.estoque.form', {
                    url: '/form/{slug}',
                    templateUrl: 'views/estoque/form.html',
                    controller: 'EstoqueFormController as EstoqueForm'
                })

                .state('app.estoque.detalhe', {
                    url: '/detalhe/{slug}',
                    templateUrl: 'views/estoque/detalhe.html',
                    controller: 'EstoqueDetalheController as EstoqueDetalhe'
                })

                .state('app.estoque.retirada', {
                    url: '/retiradas',
                    templateUrl: 'views/layouts/default.html',
                })

                .state('app.estoque.retirada.index', {
                    url: '/list',
                    templateUrl: 'views/estoque/retirada/list.html',
                    controller: 'RetiradaEstoqueListController as RetiradaEstoqueList'
                })

                .state('app.estoque.retirada.form', {
                    url: '/form/{id}',
                    templateUrl: 'views/estoque/retirada/form.html',
                    controller: 'RetiradaEstoqueFormController as RetiradaEstoqueForm'
                })

                .state('app.estoque.baixa', {
                    url: '/baixa',
                    templateUrl: 'views/estoque/baixa.html',
                    controller: 'BaixaEstoqueController as BaixaEstoque'
                })
            ;
        });
})();
