(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('menuTucano', {
            templateUrl: 'views/components/menu.html',
            controller: function($state) {
                var vm = this;

                /**
                 * Open submenu
                 *
                 * @param menu
                 */
                vm.openSub = function(menu) {
                    angular.forEach(vm.items, function(item) {
                        if (item !== menu)
                            item.subOpen = false;
                    });

                    menu.subOpen = !menu.subOpen;
                };

                /**
                 * Open inferior menu
                 *
                 * @param menu
                 * @param sub
                 */
                vm.openInf = function(menu, sub) {
                    angular.forEach(menu.sub, function(item) {
                        if (item !== sub)
                            item.subOpen = false;
                    });

                    sub.subOpen = !sub.subOpen;
                };

                /**
                 * Retrieve menu itens
                 * @type {*[]}
                 */
                vm.items = [
                    {
                        title: 'Painel',
                        sref: $state.href('app.dashboard'),
                        icon: 'fa-dashboard'
                    },
                    {
                        title: 'Pedidos',
                        sref: $state.href('app.pedidos.index'),
                        icon: 'fa-cubes',
                        roles: ['admin', 'gestor', 'atendimento', 'faturamento']
                    },
                    {
                        title: 'Faturamento',
                        sref: $state.href('app.faturamento.index'),
                        icon: 'fa-barcode',
                        roles: ['admin', 'faturamento']
                    },
                    {
                        title: 'Clientes',
                        sref: $state.href('app.clientes.index'),
                        icon: 'fa-users',
                        roles: ['admin', 'gestor']
                    },
                    {
                        title: 'Produtos',
                        icon: 'fa-dropbox',
                        sref: $state.href('app.produtos.index'),
                        //sub: [
                            // { title: 'Produtos', icon: 'fa-list', sref: $state.href('app.produtos.index') },
                            // { title: 'Linhas', icon: 'fa-list-alt', sref: $state.href('app.produtos.linhas.index') },
                            // { title: 'Marcas', icon: 'fa-list-alt', sref: $state.href('app.produtos.marcas.index') },
                            // { title: 'Assistência', icon: 'fa-wrench' },
                        //],
                        roles: ['admin', 'gestor']
                    },
                    // {
                    //     title: 'Movimentações',
                    //     icon: 'fa-exchange',
                    //     sub: [
                    //         { title: 'Entrada', icon: 'fa-mail-reply' },
                    //         { title: 'Saída', icon: 'fa-mail-forward' },
                    //         { title: 'Defeito', icon: 'fa-chain-broken' },
                    //         { title: 'Transportadoras', icon: 'fa-truck' },
                    //         { title: 'Fornecedores', icon: 'fa-building' },
                    //         { title: 'Formas de pagamento', icon: 'fa-money' },
                    //         { title: 'Operação fiscal', icon: 'fa-percent' }
                    //     ]
                    // },
                    // {
                    //     title: 'Financeiro',
                    //     icon: 'fa-money',
                    //     sub: [
                    //         { title: 'Contas a pagar/receber', icon: 'fa-credit-card' },
                    //         { title: 'Plano de contas', icon: 'fa-list' },
                    //     ]
                    // },
                    {
                        title: 'Rastreios',
                        icon: 'fa-truck',
                        roles: ['admin', 'atendimento'],
                        sub: [
                            {
                                title: 'Rastreios importantes',
                                icon: 'fa-truck',
                                sref: $state.href('app.rastreios.importantes')
                            },
                            {
                                title: 'PI\'s pendentes' ,
                                icon: 'fa-warning',
                                sref: $state.href('app.rastreios.pis.pendentes')
                            },
                            {
                                title: 'Devoluções pendentes',
                                icon: 'fa-undo',
                                sref: $state.href('app.rastreios.devolucoes')
                            },
                            {
                                title: 'Rastreios monitorados',
                                icon: 'fa-video-camera ',
                                sref: $state.href('app.rastreios.monitorados')
                            }
                        ]
                    },
                    {
                        title: 'Relatórios',
                        icon: 'fa-pie-chart',
                        sub: [
                            {title: 'Caixa diário', icon: 'fa-money'},
                            {title: 'ICMS mensal', icon: 'fa-file-pdf-o', sref: $state.href('app.admin.icms')}
                        ],
                        roles: ['admin', 'gestor']
                    },
                    // {
                    //     title: 'Configurações',
                    //     icon: 'fa-cog',
                    //     roles: ['admin'],
                    // },
                    {
                        title: 'Marketing',
                        icon: 'fa-bullhorn',
                        sub: [
                            {title: 'Template ML', icon: 'fa-clipboard', sref: $state.href('app.marketing.templateml')}
                        ],
                        roles: ['admin', 'marketing']
                    },
                    {
                        title: 'Inspeção técnica',
                        icon: 'fa-bug',
                        sref: $state.href('app.inspecao.index'),
                        roles: ['admin', 'tecnico']
                    },
                    {
                        title: 'Interno',
                        icon: 'fa-desktop',
                        sub: [
                            // {
                            //     title: 'Dados da empresa',
                            //     icon: 'fa-info'
                            // },
                            // {
                            //     title: 'Impostos da nota',
                            //     icon: 'fa-percent'
                            // },
                            {
                                title: 'Usuários',
                                icon: 'fa-users',
                                sref: $state.href('app.interno.usuarios.index'),
                                roles: ['admin']
                            },
                            {
                                title: 'Minhas senhas',
                                icon: 'fa-key',
                                sref: $state.href('app.interno.senhas.minhas')
                            },
                            {
                                title: 'Sugestões',
                                icon: 'fa-comments-o',
                                sref: $state.href('app.interno.sugestoes.index')
                            }
                        ]
                    },
                ];
            },
            controllerAs: 'Menu'
        });
})();