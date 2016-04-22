(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('MenuController', MenuController);

    function MenuController($state, $rootScope) {
        var vm = this;

        /**
         * Open submenu
         *
         * @param menu
         */
        vm.openSub = function(menu) {
            angular.forEach(vm.items, function(item) {
                if (item != menu)
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
                if (item != sub)
                    item.subOpen = false;
            });

            sub.subOpen = !sub.subOpen;
        };

        /**
         * Check permission for menu
         *
         * @param menu
         * @returns {boolean}
         */
        vm.permissaoMenu = function(menu) {


            return true;
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
                title: 'Atendimento',
                icon: 'fa-user-md',
                grupo: ['atendimento'],
                sub: [
                    {
                        title: 'Rastreio',
                        icon: 'fa-truck',
                        sref: $state.href('app.atendimento.rastreio')
                    }
                ]
            },
            {
                title: 'Faturamento',
                icon: 'fa-barcode',
                sref: $state.href('app.faturamento.etiqueta')
            },
            {
                title: 'Gestor',
                icon: 'fa-money',
                grupo: ['gestor'],
                sub: [
                    {
                        title: 'Painel',
                        icon: 'fa-dashboard',
                        sref: $state.href('app.gestor.dashboard')
                    },
                    {
                        title: 'Monitoramento',
                        icon: 'fa-user-secret',
                        sref: $state.href('app.gestor.monitoramento.marketplace')
                    },
                    {
                        title: 'Relatórios',
                        icon: 'fa-file-pdf-o',
                        sub: [
                            {title: 'Por marketplace', sref: $state.href('app.gestor.estatisticas.marketplace')},
                            {title: 'Por estado', sref: $state.href('app.gestor.estatisticas.estado')},
                            {title: 'Por produto', sref: $state.href('app.gestor.estatisticas.produto')}
                        ]
                    }
                ]
            },
            {
                title: 'Interno',
                icon: 'fa-desktop',
                sub: [
                    {title: 'Usuários', sref: $state.href('app.interno.usuarios.list'), grupo: ['admin']},
                    {title: 'Minhas senhas', sref: $state.href('app.interno.usuarios.edit', {id: $rootScope.currentUser.id})}
                ]
            }
        ];
    }

})();