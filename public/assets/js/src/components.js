(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('dropdown', {
            bindings: {
                title: '@',
                size:  '@'
            },
            transclude: true,
            templateUrl: 'views/components/dropdown.html'
        });

})();
(function() {
    'use strict'; 

    angular 
        .module('MeuTucano') 
        .component('loading', {
            bindings: {
                icon: '@'
            },
            templateUrl: 'views/components/loading.html'
        });

})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('logout', {
            template: '<button ng-click="Logout.logout()" class="logout btn-danger"><i class="fa-sign-out"></i></button>',
            controller: ["$rootScope", "$auth", "$state", function($rootScope, $auth, $state) {
                this.logout = function() {
                    $auth.logout().then(function() {
                        localStorage.removeItem('user');
                        $rootScope.authenticated = false;
                        $rootScope.currentUser = null;

                        $state.go('login');
                    });
                };
            }],
            controllerAs: 'Logout'
        });
})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('menuTucano', {
            templateUrl: 'views/components/menu.html',
            controller: ["$state", function($state) {
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
                        roles: ['admin', 'gestor', 'atendimento']
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
                        sub: [
                            { title: 'Produtos', icon: 'fa-list' },
                            { title: 'Linhas', icon: 'fa-list-alt', sref: $state.href('app.produtos.linhas.index') },
                            { title: 'Marcas', icon: 'fa-list-alt', sref: $state.href('app.produtos.marcas.index') },
                            // { title: 'Assistência', icon: 'fa-wrench' },
                        ],
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
                            }
                        ]
                    },
                ];
            }],
            controllerAs: 'Menu'
        });
})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('metas', {
            templateUrl: 'views/components/metas.html',
            controller: ["$rootScope", "Restangular", "$interval", function($rootScope, Restangular, $interval) {
                var vm = this;

                vm.data = {};
                vm.loading = false;

                $rootScope.$on('loading', function() {
                    vm.loading = true;
                });

                $rootScope.$on('stop-loading', function() {
                    vm.loading = false;
                });

                vm.loadMeta = function() {
                    vm.loading = true;

                    Restangular.one('metas/atual').customGET().then(function(metas) {
                        vm.data = metas;
                        vm.loading = false;
                    });
                };

                vm.loadMeta();
            }],
            controllerAs: 'Metas'
        });

})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('pageTitle', {
            bindings: {
                icon: '@',
                title: '@',
                description: '@'
            },
            templateUrl: 'views/components/page-title.html'
        });

})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('tableHeader', {
            bindings: {
                data: '='
            },
            templateUrl: 'views/components/table-header.html'
        })
        .service('TableHeader', ["$localStorage", function($localStorage) {
            var name, vm, pagination;

            return {
                init: function(name, vm, useFilter) {
                    this.name = name;
                    this.vm   = vm;

                    if (!$localStorage.pagination) $localStorage.pagination = {};

                    if (!$localStorage.pagination.hasOwnProperty(this.name)) {
                        $localStorage.pagination[this.name] = {
                            page:     1,
                            per_page: '20'
                        };
                    }

                    this.pagination = $localStorage.pagination[this.name];

                    return this;
                },

                prev: function() {
                    if (this.pagination.page === 1) {
                        return false;
                    }

                    this.pagination.page--;
                    this.vm.load();
                },

                next: function() {
                    if (this.pagination.page === this.vm.tableData.last_page) {
                        return false;
                    }

                    this.pagination.page++;
                    this.vm.load();
                },

                changePerPage: function() {
                    this.pagination.page = 1;
                    this.vm.load();
                },

                reset: function() {
                    this.pagination.page = 1;
                    this.vm.load();
                }
            };
        }]);
})();

(function() {
    'use strict';

    tableList.$inject = ["$rootScope"];
    angular
        .module('MeuTucano')
        .directive('tableList', tableList);

    function tableList($rootScope) {
        return {
            restrict: 'A',
            scope: {
                tableList: '='
            },
            transclude: true,
            link: function(scope, element, attrs, ctrl, transclude) {
                element.addClass('table info-style');

                transclude(function(clone) {
                    element.children('#toTransclude').replaceWith(clone);
                });
            },
            templateUrl: 'views/components/table-list.html'
        };
    }

})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('tabs', {
            transclude: true,
            templateUrl: 'views/components/tabs.html'
        });

})();
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('upload', {
            templateUrl: 'views/components/upload.html',
            controller: ["Upload", "toaster", "envService", "$rootScope", function(Upload, toaster, envService, $rootScope) {
                var vm = this;

                /**
                 * Upload notas
                 *
                 * @param files
                 */
                vm.upload = function (files) {
                    if (files && files.length) {
                        $rootScope.$broadcast('loading');
                        Upload.upload({
                            url: envService.read('apiUrl') + '/upload',
                            headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                            data: {
                                arquivos: files
                            }
                        }).success(function (response) {
                            $rootScope.$broadcast('upload');
                            $rootScope.$broadcast('stop-loading');
                            toaster.pop('success', 'Upload concluído', response.data.msg);
                        }).error(function () {
                            toaster.pop('error', "Erro no upload!", "Erro ao enviar arquivos, tente novamente!");
                        });
                    }
                };
            }],
            controllerAs: 'Upload'
        });

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duLmpzIiwiTG9hZGluZy5qcyIsIkxvZ291dC5qcyIsIk1lbnUuanMiLCJNZXRhcy5qcyIsIlBhZ2VUaXRsZS5qcyIsIlRhYmxlSGVhZGVyLmpzIiwiVGFibGVMaXN0LmpzIiwiVGFicy5qcyIsIlVwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFlBQUE7WUFDQSxVQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsT0FBQTs7WUFFQSxZQUFBO1lBQ0EsYUFBQTs7OztBQ1hBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTtZQUNBLFVBQUE7Z0JBQ0EsTUFBQTs7WUFFQSxhQUFBOzs7O0FDVEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxVQUFBO1lBQ0EsVUFBQTtZQUNBLDhDQUFBLFNBQUEsWUFBQSxPQUFBLFFBQUE7Z0JBQ0EsS0FBQSxTQUFBLFdBQUE7b0JBQ0EsTUFBQSxTQUFBLEtBQUEsV0FBQTt3QkFDQSxhQUFBLFdBQUE7d0JBQ0EsV0FBQSxnQkFBQTt3QkFDQSxXQUFBLGNBQUE7O3dCQUVBLE9BQUEsR0FBQTs7OztZQUlBLGNBQUE7OztBQ2xCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsdUJBQUEsU0FBQSxRQUFBO2dCQUNBLElBQUEsS0FBQTs7Ozs7OztnQkFPQSxHQUFBLFVBQUEsU0FBQSxNQUFBO29CQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxNQUFBO3dCQUNBLElBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUE7OztvQkFHQSxLQUFBLFVBQUEsQ0FBQSxLQUFBOzs7Ozs7Ozs7Z0JBU0EsR0FBQSxVQUFBLFNBQUEsTUFBQSxLQUFBO29CQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsU0FBQSxNQUFBO3dCQUNBLElBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUE7OztvQkFHQSxJQUFBLFVBQUEsQ0FBQSxJQUFBOzs7Ozs7O2dCQU9BLEdBQUEsUUFBQTtvQkFDQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBO3dCQUNBLE1BQUE7O29CQUVBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7d0JBQ0EsTUFBQTt3QkFDQSxPQUFBLENBQUEsU0FBQSxVQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBO3dCQUNBLE1BQUE7d0JBQ0EsT0FBQSxDQUFBLFNBQUE7O29CQUVBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxLQUFBOzRCQUNBLEVBQUEsT0FBQSxZQUFBLE1BQUE7NEJBQ0EsRUFBQSxPQUFBLFVBQUEsTUFBQSxlQUFBLE1BQUEsT0FBQSxLQUFBOzRCQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUEsZUFBQSxNQUFBLE9BQUEsS0FBQTs7O3dCQUdBLE9BQUEsQ0FBQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkF1QkE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE9BQUEsQ0FBQSxTQUFBO3dCQUNBLEtBQUE7NEJBQ0E7Z0NBQ0EsT0FBQTtnQ0FDQSxNQUFBO2dDQUNBLE1BQUEsT0FBQSxLQUFBOzs0QkFFQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7Z0NBQ0EsTUFBQSxPQUFBLEtBQUE7OzRCQUVBO2dDQUNBLE9BQUE7Z0NBQ0EsTUFBQTtnQ0FDQSxNQUFBLE9BQUEsS0FBQTs7OztvQkFJQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsS0FBQTs0QkFDQSxDQUFBLE9BQUEsZ0JBQUEsTUFBQTs0QkFDQSxDQUFBLE9BQUEsZUFBQSxNQUFBLGlCQUFBLE1BQUEsT0FBQSxLQUFBOzt3QkFFQSxPQUFBLENBQUEsU0FBQTs7Ozs7OztvQkFPQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsS0FBQTs0QkFDQSxDQUFBLE9BQUEsZUFBQSxNQUFBLGdCQUFBLE1B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QSxPQUFBO29CQUNBLElBQUEsU0FBQSxNQUFBLFFBQUE7d0JBQ0EsV0FBQSxXQUFBO3dCQUNBLE9BQUEsT0FBQTs0QkFDQSxLQUFBLFdBQUEsS0FBQSxZQUFBOzRCQUNBLFNBQUEsQ0FBQSxlQUFBLFdBQUEsYUFBQSxRQUFBOzRCQUNBLE1BQUE7Z0NBQ0EsVUFBQTs7MkJBRUEsUUFBQSxVQUFBLFVBQUE7NEJBQ0EsV0FBQSxXQUFBOzRCQUNBLFdBQUEsV0FBQTs0QkFDQSxRQUFBLElBQUEsV0FBQSxvQkFBQSxTQUFBLEtBQUE7MkJBQ0EsTUFBQSxZQUFBOzRCQUNBLFFBQUEsSUFBQSxTQUFBLG1CQUFBOzs7OztZQUtBLGNBQUE7OztLQUdBIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCdkcm9wZG93bicsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJyxcbiAgICAgICAgICAgICAgICBzaXplOiAgJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9kcm9wZG93bi5odG1sJ1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnOyBcblxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpIFxuICAgICAgICAuY29tcG9uZW50KCdsb2FkaW5nJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpY29uOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvbG9hZGluZy5odG1sJ1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCdsb2dvdXQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxidXR0b24gbmctY2xpY2s9XCJMb2dvdXQubG9nb3V0KClcIiBjbGFzcz1cImxvZ291dCBidG4tZGFuZ2VyXCI+PGkgY2xhc3M9XCJmYS1zaWduLW91dFwiPjwvaT48L2J1dHRvbj4nLFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHJvb3RTY29wZSwgJGF1dGgsICRzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0xvZ291dCdcbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ21lbnVUdWNhbm8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvbWVudS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBPcGVuIHN1Ym1lbnVcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0ub3BlblN1YiA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBtZW51KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3ViT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBtZW51LnN1Yk9wZW4gPSAhbWVudS5zdWJPcGVuO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBPcGVuIGluZmVyaW9yIG1lbnVcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHN1YlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLm9wZW5JbmYgPSBmdW5jdGlvbihtZW51LCBzdWIpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1lbnUuc3ViLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBzdWIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHN1Yi5zdWJPcGVuID0gIXN1Yi5zdWJPcGVuO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRyaWV2ZSBtZW51IGl0ZW5zXG4gICAgICAgICAgICAgICAgICogQHR5cGUgeypbXX1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS5pdGVtcyA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQYWluZWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5kYXNoYm9hcmQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1kYXNoYm9hcmQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGVkaWRvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnBlZGlkb3MuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1jdWJlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbicsICdnZXN0b3InLCAnYXRlbmRpbWVudG8nXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0NsaWVudGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuY2xpZW50ZXMuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS11c2VycycsXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbicsICdnZXN0b3InXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1dG9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1kcm9wYm94JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdQcm9kdXRvcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdMaW5oYXMnLCBpY29uOiAnZmEtbGlzdC1hbHQnLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnByb2R1dG9zLmxpbmhhcy5pbmRleCcpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ01hcmNhcycsIGljb246ICdmYS1saXN0LWFsdCcsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucHJvZHV0b3MubWFyY2FzLmluZGV4JykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB7IHRpdGxlOiAnQXNzaXN0w6puY2lhJywgaWNvbjogJ2ZhLXdyZW5jaCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbicsICdnZXN0b3InXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB0aXRsZTogJ01vdmltZW50YcOnw7VlcycsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAnZmEtZXhjaGFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgeyB0aXRsZTogJ0VudHJhZGEnLCBpY29uOiAnZmEtbWFpbC1yZXBseScgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB7IHRpdGxlOiAnU2HDrWRhJywgaWNvbjogJ2ZhLW1haWwtZm9yd2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB7IHRpdGxlOiAnRGVmZWl0bycsIGljb246ICdmYS1jaGFpbi1icm9rZW4nIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgeyB0aXRsZTogJ1RyYW5zcG9ydGFkb3JhcycsIGljb246ICdmYS10cnVjaycgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB7IHRpdGxlOiAnRm9ybmVjZWRvcmVzJywgaWNvbjogJ2ZhLWJ1aWxkaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHsgdGl0bGU6ICdGb3JtYXMgZGUgcGFnYW1lbnRvJywgaWNvbjogJ2ZhLW1vbmV5JyB9LFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHsgdGl0bGU6ICdPcGVyYcOnw6NvIGZpc2NhbCcsIGljb246ICdmYS1wZXJjZW50JyB9XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBdXG4gICAgICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRpdGxlOiAnRmluYW5jZWlybycsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAnZmEtbW9uZXknLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgeyB0aXRsZTogJ0NvbnRhcyBhIHBhZ2FyL3JlY2ViZXInLCBpY29uOiAnZmEtY3JlZGl0LWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgeyB0aXRsZTogJ1BsYW5vIGRlIGNvbnRhcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXVxuICAgICAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Jhc3RyZWlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnYXRlbmRpbWVudG8nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MgaW1wb3J0YW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnJhc3RyZWlvcy5pbXBvcnRhbnRlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUElcXCdzIHBlbmRlbnRlcycgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLnBpcy5wZW5kZW50ZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Rldm9sdcOnw7VlcyBwZW5kZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdW5kbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLmRldm9sdWNvZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZWxhdMOzcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtcGllLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ0NhaXhhIGRpw6FyaW8nLCBpY29uOiAnZmEtbW9uZXknfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdJQ01TIG1lbnNhbCcsIGljb246ICdmYS1maWxlLXBkZi1vJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hZG1pbi5pY21zJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnZ2VzdG9yJ11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGl0bGU6ICdDb25maWd1cmHDp8O1ZXMnLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWNvbjogJ2ZhLWNvZycsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICByb2xlczogWydhZG1pbiddLFxuICAgICAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ01hcmtldGluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtYnVsbGhvcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnVGVtcGxhdGUgTUwnLCBpY29uOiAnZmEtY2xpcGJvYXJkJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5tYXJrZXRpbmcudGVtcGxhdGVtbCcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJywgJ21hcmtldGluZyddXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSW50ZXJubycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtZGVza3RvcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRpdGxlOiAnRGFkb3MgZGEgZW1wcmVzYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGljb246ICdmYS1pbmZvJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aXRsZTogJ0ltcG9zdG9zIGRhIG5vdGEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAnZmEtcGVyY2VudCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVc3XDoXJpb3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmludGVybm8udXN1YXJpb3MuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ01lbnUnXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCdtZXRhcycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9tZXRhcy5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCAkaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdm0uZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2bS5sb2FkTWV0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21ldGFzL2F0dWFsJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihtZXRhcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGF0YSA9IG1ldGFzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdNZXRhcydcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgncGFnZVRpdGxlJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpY29uOiAnQCcsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3BhZ2UtdGl0bGUuaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgndGFibGVIZWFkZXInLCB7XG4gICAgICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgICAgIGRhdGE6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy90YWJsZS1oZWFkZXIuaHRtbCdcbiAgICAgICAgfSlcbiAgICAgICAgLnNlcnZpY2UoJ1RhYmxlSGVhZGVyJywgZnVuY3Rpb24oJGxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgdmFyIG5hbWUsIHZtLCBwYWdpbmF0aW9uO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKG5hbWUsIHZtLCB1c2VGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bSAgID0gdm07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb24pICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uLmhhc093blByb3BlcnR5KHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvblt0aGlzLm5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcl9wYWdlOiAnMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0gJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uW3RoaXMubmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHByZXY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0aW9uLnBhZ2UgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlLS07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdGlvbi5wYWdlID09PSB0aGlzLnZtLnRhYmxlRGF0YS5sYXN0X3BhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBjaGFuZ2VQZXJQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RhYmxlTGlzdCcsIHRhYmxlTGlzdCk7XG5cbiAgICBmdW5jdGlvbiB0YWJsZUxpc3QoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdGFibGVMaXN0OiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsLCB0cmFuc2NsdWRlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygndGFibGUgaW5mby1zdHlsZScpO1xuXG4gICAgICAgICAgICAgICAgdHJhbnNjbHVkZShmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCcjdG9UcmFuc2NsdWRlJykucmVwbGFjZVdpdGgoY2xvbmUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy90YWJsZS1saXN0Lmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3RhYnMnLCB7XG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3RhYnMuaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgndXBsb2FkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3VwbG9hZC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKFVwbG9hZCwgdG9hc3RlciwgZW52U2VydmljZSwgJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBVcGxvYWQgbm90YXNcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBmaWxlc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLnVwbG9hZCA9IGZ1bmN0aW9uIChmaWxlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvdXBsb2FkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIil9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJxdWl2b3M6IGZpbGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnc3RvcC1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnVXBsb2FkIGNvbmNsdcOtZG8nLCByZXNwb25zZS5kYXRhLm1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgXCJFcnJvIG5vIHVwbG9hZCFcIiwgXCJFcnJvIGFvIGVudmlhciBhcnF1aXZvcywgdGVudGUgbm92YW1lbnRlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdVcGxvYWQnXG4gICAgICAgIH0pO1xuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
