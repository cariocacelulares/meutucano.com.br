(function() {
    'use strict';

    angular 
        .module('MeuTucano') 
        .component('dropdown', {
            bindings: {
                title: '@'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duLmpzIiwiTG9hZGluZy5qcyIsIkxvZ291dC5qcyIsIk1lbnUuanMiLCJNZXRhcy5qcyIsIlBhZ2VUaXRsZS5qcyIsIlRhYmxlSGVhZGVyLmpzIiwiVGFibGVMaXN0LmpzIiwiVGFicy5qcyIsIlVwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFlBQUE7WUFDQSxVQUFBO2dCQUNBLE9BQUE7O1lBRUEsWUFBQTtZQUNBLGFBQUE7Ozs7QUNWQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7WUFDQSxVQUFBO2dCQUNBLE1BQUE7O1lBRUEsYUFBQTs7OztBQ1RBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsVUFBQTtZQUNBLFVBQUE7WUFDQSw4Q0FBQSxTQUFBLFlBQUEsT0FBQSxRQUFBO2dCQUNBLEtBQUEsU0FBQSxXQUFBO29CQUNBLE1BQUEsU0FBQSxLQUFBLFdBQUE7d0JBQ0EsYUFBQSxXQUFBO3dCQUNBLFdBQUEsZ0JBQUE7d0JBQ0EsV0FBQSxjQUFBOzt3QkFFQSxPQUFBLEdBQUE7Ozs7WUFJQSxjQUFBOzs7QUNsQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxjQUFBO1lBQ0EsYUFBQTtZQUNBLHVCQUFBLFNBQUEsUUFBQTtnQkFDQSxJQUFBLEtBQUE7Ozs7Ozs7Z0JBT0EsR0FBQSxVQUFBLFNBQUEsTUFBQTtvQkFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBOzs7b0JBR0EsS0FBQSxVQUFBLENBQUEsS0FBQTs7Ozs7Ozs7O2dCQVNBLEdBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtvQkFDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBOzs7b0JBR0EsSUFBQSxVQUFBLENBQUEsSUFBQTs7Ozs7OztnQkFPQSxHQUFBLFFBQUE7b0JBQ0E7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTt3QkFDQSxNQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBO3dCQUNBLE1BQUE7d0JBQ0EsT0FBQSxDQUFBLFNBQUEsVUFBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTt3QkFDQSxNQUFBO3dCQUNBLE9BQUEsQ0FBQSxTQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsS0FBQTs0QkFDQSxFQUFBLE9BQUEsWUFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUEsZUFBQSxNQUFBLE9BQUEsS0FBQTs0QkFDQSxFQUFBLE9BQUEsVUFBQSxNQUFBLGVBQUEsTUFBQSxPQUFBLEtBQUE7Ozt3QkFHQSxPQUFBLENBQUEsU0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBdUJBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxPQUFBLENBQUEsU0FBQTt3QkFDQSxLQUFBOzRCQUNBO2dDQUNBLE9BQUE7Z0NBQ0EsTUFBQTtnQ0FDQSxNQUFBLE9BQUEsS0FBQTs7NEJBRUE7Z0NBQ0EsT0FBQTtnQ0FDQSxNQUFBO2dDQUNBLE1BQUEsT0FBQSxLQUFBOzs0QkFFQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7Z0NBQ0EsTUFBQSxPQUFBLEtBQUE7Ozs7b0JBSUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLEtBQUE7NEJBQ0EsQ0FBQSxPQUFBLGdCQUFBLE1BQUE7NEJBQ0EsQ0FBQSxPQUFBLGVBQUEsTUFBQSxpQkFBQSxNQUFBLE9BQUEsS0FBQTs7d0JBRUEsT0FBQSxDQUFBLFNBQUE7Ozs7Ozs7b0JBT0E7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLEtBQUE7NEJBQ0EsQ0FBQSxPQUFBLGVBQUEsTUFBQSxnQkFBQSxNQUFBLE9BQUEsS0FB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QSxJQUFBLFNBQUEsTUFBQSxRQUFBO3dCQUNBLFdBQUEsV0FBQTt3QkFDQSxPQUFBLE9BQUE7NEJBQ0EsS0FBQSxXQUFBLEtBQUEsWUFBQTs0QkFDQSxTQUFBLENBQUEsZUFBQSxXQUFBLGFBQUEsUUFBQTs0QkFDQSxNQUFBO2dDQUNBLFVBQUE7OzJCQUVBLFFBQUEsVUFBQSxVQUFBOzRCQUNBLFdBQUEsV0FBQTs0QkFDQSxXQUFBLFdBQUE7NEJBQ0EsUUFBQSxJQUFBLFdBQUEsb0JBQUEsU0FBQSxLQUFBOzJCQUNBLE1BQUEsWUFBQTs0QkFDQSxRQUFBLElBQUEsU0FBQSxtQkFBQTs7Ozs7WUFLQSxjQUFBOzs7S0FHQSIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpIFxuICAgICAgICAuY29tcG9uZW50KCdkcm9wZG93bicsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvZHJvcGRvd24uaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JzsgXG5cbiAgICBhbmd1bGFyIFxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKSBcbiAgICAgICAgLmNvbXBvbmVudCgnbG9hZGluZycsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaWNvbjogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL2xvYWRpbmcuaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgnbG9nb3V0Jywge1xuICAgICAgICAgICAgdGVtcGxhdGU6ICc8YnV0dG9uIG5nLWNsaWNrPVwiTG9nb3V0LmxvZ291dCgpXCIgY2xhc3M9XCJsb2dvdXQgYnRuLWRhbmdlclwiPjxpIGNsYXNzPVwiZmEtc2lnbi1vdXRcIj48L2k+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRyb290U2NvcGUsICRhdXRoLCAkc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkYXV0aC5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdMb2dvdXQnXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCdtZW51VHVjYW5vJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL21lbnUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogT3BlbiBzdWJtZW51XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbWVudVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLm9wZW5TdWIgPSBmdW5jdGlvbihtZW51KSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gbWVudSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN1Yk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbWVudS5zdWJPcGVuID0gIW1lbnUuc3ViT3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogT3BlbiBpbmZlcmlvciBtZW51XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbWVudVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBzdWJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS5vcGVuSW5mID0gZnVuY3Rpb24obWVudSwgc3ViKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZW51LnN1YiwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gc3ViKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3ViT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzdWIuc3ViT3BlbiA9ICFzdWIuc3ViT3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0cmlldmUgbWVudSBpdGVuc1xuICAgICAgICAgICAgICAgICAqIEB0eXBlIHsqW119XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0uaXRlbXMgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGFpbmVsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuZGFzaGJvYXJkJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtZGFzaGJvYXJkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BlZGlkb3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wZWRpZG9zLmluZGV4JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtY3ViZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnZ2VzdG9yJywgJ2F0ZW5kaW1lbnRvJ11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdDbGllbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmNsaWVudGVzLmluZGV4JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnZ2VzdG9yJ11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdXRvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtZHJvcGJveCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnUHJvZHV0b3MnLCBpY29uOiAnZmEtbGlzdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTGluaGFzJywgaWNvbjogJ2ZhLWxpc3QtYWx0Jywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wcm9kdXRvcy5saW5oYXMuaW5kZXgnKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdNYXJjYXMnLCBpY29uOiAnZmEtbGlzdC1hbHQnLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnByb2R1dG9zLm1hcmNhcy5pbmRleCcpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8geyB0aXRsZTogJ0Fzc2lzdMOqbmNpYScsIGljb246ICdmYS13cmVuY2gnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnZ2VzdG9yJ11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGl0bGU6ICdNb3ZpbWVudGHDp8O1ZXMnLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWNvbjogJ2ZhLWV4Y2hhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHsgdGl0bGU6ICdFbnRyYWRhJywgaWNvbjogJ2ZhLW1haWwtcmVwbHknIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgeyB0aXRsZTogJ1Nhw61kYScsIGljb246ICdmYS1tYWlsLWZvcndhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgeyB0aXRsZTogJ0RlZmVpdG8nLCBpY29uOiAnZmEtY2hhaW4tYnJva2VuJyB9LFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHsgdGl0bGU6ICdUcmFuc3BvcnRhZG9yYXMnLCBpY29uOiAnZmEtdHJ1Y2snIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgeyB0aXRsZTogJ0Zvcm5lY2Vkb3JlcycsIGljb246ICdmYS1idWlsZGluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB7IHRpdGxlOiAnRm9ybWFzIGRlIHBhZ2FtZW50bycsIGljb246ICdmYS1tb25leScgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB7IHRpdGxlOiAnT3BlcmHDp8OjbyBmaXNjYWwnLCBpY29uOiAnZmEtcGVyY2VudCcgfVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgXVxuICAgICAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB0aXRsZTogJ0ZpbmFuY2Vpcm8nLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWNvbjogJ2ZhLW1vbmV5JyxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHsgdGl0bGU6ICdDb250YXMgYSBwYWdhci9yZWNlYmVyJywgaWNvbjogJ2ZhLWNyZWRpdC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHsgdGl0bGU6ICdQbGFubyBkZSBjb250YXMnLCBpY29uOiAnZmEtbGlzdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIF1cbiAgICAgICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXRydWNrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJywgJ2F0ZW5kaW1lbnRvJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmFzdHJlaW9zIGltcG9ydGFudGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXRydWNrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5yYXN0cmVpb3MuaW1wb3J0YW50ZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BJXFwncyBwZW5kZW50ZXMnICxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXdhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnJhc3RyZWlvcy5waXMucGVuZGVudGVzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEZXZvbHXDp8O1ZXMgcGVuZGVudGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVuZG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnJhc3RyZWlvcy5kZXZvbHVjb2VzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVsYXTDs3Jpb3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXBpZS1jaGFydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdDYWl4YSBkacOhcmlvJywgaWNvbjogJ2ZhLW1vbmV5J30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnSUNNUyBtZW5zYWwnLCBpY29uOiAnZmEtZmlsZS1wZGYtbycsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuYWRtaW4uaWNtcycpfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJywgJ2dlc3RvciddXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRpdGxlOiAnQ29uZmlndXJhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGljb246ICdmYS1jb2cnLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgcm9sZXM6IFsnYWRtaW4nXSxcbiAgICAgICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdNYXJrZXRpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWJ1bGxob3JuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ1RlbXBsYXRlIE1MJywgaWNvbjogJ2ZhLWNsaXBib2FyZCcsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAubWFya2V0aW5nLnRlbXBsYXRlbWwnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbicsICdtYXJrZXRpbmcnXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0ludGVybm8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRlc2t0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0aXRsZTogJ0RhZG9zIGRhIGVtcHJlc2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiAnZmEtaW5mbydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdGl0bGU6ICdJbXBvc3RvcyBkYSBub3RhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWNvbjogJ2ZhLXBlcmNlbnQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVXN1w6FyaW9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVzZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5pbnRlcm5vLnVzdWFyaW9zLmluZGV4JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdNZW51J1xuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgnbWV0YXMnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvbWV0YXMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgJGludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHZtLmRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdtZXRhcy9hdHVhbCcpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24obWV0YXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBtZXRhcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRNZXRhKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTWV0YXMnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3BhZ2VUaXRsZScsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaWNvbjogJ0AnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9wYWdlLXRpdGxlLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3RhYmxlSGVhZGVyJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtaGVhZGVyLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgIC5zZXJ2aWNlKCdUYWJsZUhlYWRlcicsIGZ1bmN0aW9uKCRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHZhciBuYW1lLCB2bSwgcGFnaW5hdGlvbjtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbihuYW1lLCB2bSwgdXNlRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0gICA9IHZtO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uKSAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvbi5oYXNPd25Qcm9wZXJ0eSh0aGlzLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb25bdGhpcy5uYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogJzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbiA9ICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvblt0aGlzLm5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwcmV2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdGlvbi5wYWdlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZS0tO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2luYXRpb24ucGFnZSA9PT0gdGhpcy52bS50YWJsZURhdGEubGFzdF9wYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZSsrO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2hhbmdlUGVyUGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCd0YWJsZUxpc3QnLCB0YWJsZUxpc3QpO1xuXG4gICAgZnVuY3Rpb24gdGFibGVMaXN0KCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHRhYmxlTGlzdDogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCwgdHJhbnNjbHVkZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3RhYmxlIGluZm8tc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgIHRyYW5zY2x1ZGUoZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbignI3RvVHJhbnNjbHVkZScpLnJlcGxhY2VXaXRoKGNsb25lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtbGlzdC5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCd0YWJzJywge1xuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy90YWJzLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3VwbG9hZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy91cGxvYWQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbihVcGxvYWQsIHRvYXN0ZXIsIGVudlNlcnZpY2UsICRyb290U2NvcGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogVXBsb2FkIG5vdGFzXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gZmlsZXNcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS51cGxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3VwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJysgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycXVpdm9zOiBmaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3N0b3AtbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1VwbG9hZCBjb25jbHXDrWRvJywgcmVzcG9uc2UuZGF0YS5tc2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiRXJybyBubyB1cGxvYWQhXCIsIFwiRXJybyBhbyBlbnZpYXIgYXJxdWl2b3MsIHRlbnRlIG5vdmFtZW50ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVXBsb2FkJ1xuICAgICAgICB9KTtcblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
