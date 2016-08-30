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
                        icon: 'fa-cubes'
                    },
                    {
                        title: 'Clientes',
                        sref: $state.href('app.clientes.index'),
                        icon: 'fa-users'
                    },
                    {
                        title: 'Produtos',
                        icon: 'fa-dropbox',
                        sub: [
                            { title: 'Produtos', icon: 'fa-list' },
                            { title: 'Linhas', icon: 'fa-list-alt', sref: $state.href('app.produtos.linhas.index') },
                            { title: 'Marcas', icon: 'fa-list-alt', sref: $state.href('app.produtos.marcas.index') },
                            { title: 'Assistência', icon: 'fa-wrench' },
                        ]
                    },
                    {
                        title: 'Movimentações',
                        icon: 'fa-exchange',
                        sub: [
                            { title: 'Entrada', icon: 'fa-mail-reply' },
                            { title: 'Saída', icon: 'fa-mail-forward' },
                            { title: 'Defeito', icon: 'fa-chain-broken' },
                            { title: 'Transportadoras', icon: 'fa-truck' },
                            { title: 'Fornecedores', icon: 'fa-building' },
                            { title: 'Formas de pagamento', icon: 'fa-money' },
                            { title: 'Operação fiscal', icon: 'fa-percent' }
                        ]
                    },
                    {
                        title: 'Financeiro',
                        icon: 'fa-money',
                        sub: [
                            { title: 'Contas a pagar/receber', icon: 'fa-credit-card' },
                            { title: 'Plano de contas', icon: 'fa-list' },
                        ]
                    },
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
                        ]
                    },
                    {
                        title: 'Configurações',
                        icon: 'fa-cog',
                        roles: ['admin'],
                    },
                    {
                        title: 'Marketing',
                        icon: 'fa-bullhorn',
                        sub: [
                            {title: 'Template ML', icon: 'fa-clipboard', sref: $state.href('app.marketing.templateml')}
                        ]
                    },
                    {
                        title: 'Interno',
                        icon: 'fa-desktop',
                        sub: [
                            {
                                title: 'Dados da empresa',
                                icon: 'fa-info'
                            },
                            {
                                title: 'Impostos da nota',
                                icon: 'fa-percent'
                            },
                            {
                                title: 'Usuários',
                                icon: 'fa-users',
                                sref: $state.href('app.interno.usuarios.index')
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

                /**
                 * Timeout metas
                 */
                $interval(function() {
                    vm.loadMeta();
                }, 60000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duLmpzIiwiTG9hZGluZy5qcyIsIkxvZ291dC5qcyIsIk1lbnUuanMiLCJNZXRhcy5qcyIsIlBhZ2VUaXRsZS5qcyIsIlRhYmxlSGVhZGVyLmpzIiwiVGFibGVMaXN0LmpzIiwiVXBsb2FkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsWUFBQTtZQUNBLFVBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxZQUFBO1lBQ0EsYUFBQTs7OztBQ1ZBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTtZQUNBLFVBQUE7Z0JBQ0EsTUFBQTs7WUFFQSxhQUFBOzs7O0FDVEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxVQUFBO1lBQ0EsVUFBQTtZQUNBLDhDQUFBLFNBQUEsWUFBQSxPQUFBLFFBQUE7Z0JBQ0EsS0FBQSxTQUFBLFdBQUE7b0JBQ0EsTUFBQSxTQUFBLEtBQUEsV0FBQTt3QkFDQSxhQUFBLFdBQUE7d0JBQ0EsV0FBQSxnQkFBQTt3QkFDQSxXQUFBLGNBQUE7O3dCQUVBLE9BQUEsR0FBQTs7OztZQUlBLGNBQUE7OztBQ2xCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsdUJBQUEsU0FBQSxRQUFBO2dCQUNBLElBQUEsS0FBQTs7Ozs7OztnQkFPQSxHQUFBLFVBQUEsU0FBQSxNQUFBO29CQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxNQUFBO3dCQUNBLElBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUE7OztvQkFHQSxLQUFBLFVBQUEsQ0FBQSxLQUFBOzs7Ozs7Ozs7Z0JBU0EsR0FBQSxVQUFBLFNBQUEsTUFBQSxLQUFBO29CQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsU0FBQSxNQUFBO3dCQUNBLElBQUEsUUFBQTs0QkFDQSxLQUFBLFVBQUE7OztvQkFHQSxJQUFBLFVBQUEsQ0FBQSxJQUFBOzs7Ozs7O2dCQU9BLEdBQUEsUUFBQTtvQkFDQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBO3dCQUNBLE1BQUE7O29CQUVBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7d0JBQ0EsTUFBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTt3QkFDQSxNQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsS0FBQTs0QkFDQSxFQUFBLE9BQUEsWUFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUEsZUFBQSxNQUFBLE9BQUEsS0FBQTs0QkFDQSxFQUFBLE9BQUEsVUFBQSxNQUFBLGVBQUEsTUFBQSxPQUFBLEtBQUE7NEJBQ0EsRUFBQSxPQUFBLGVBQUEsTUFBQTs7O29CQUdBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxLQUFBOzRCQUNBLEVBQUEsT0FBQSxXQUFBLE1BQUE7NEJBQ0EsRUFBQSxPQUFBLFNBQUEsTUFBQTs0QkFDQSxFQUFBLE9BQUEsV0FBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxtQkFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxnQkFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSx1QkFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxtQkFBQSxNQUFBOzs7b0JBR0E7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLEtBQUE7NEJBQ0EsRUFBQSxPQUFBLDBCQUFBLE1BQUE7NEJBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7OztvQkFHQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsT0FBQSxDQUFBLFNBQUE7d0JBQ0EsS0FBQTs0QkFDQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7Z0NBQ0EsTUFBQSxPQUFBLEtBQUE7OzRCQUVBO2dDQUNBLE9BQUE7Z0NBQ0EsTUFBQTtnQ0FDQSxNQUFBLE9BQUEsS0FBQTs7NEJBRUE7Z0NBQ0EsT0FBQTtnQ0FDQSxNQUFBO2dD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LE1BQUEsWUFBQTtnQkFDQSxRQUFBLFNBQUE7O2dCQUVBLFdBQUEsU0FBQSxPQUFBO29CQUNBLFFBQUEsU0FBQSxpQkFBQSxZQUFBOzs7WUFHQSxhQUFBOzs7OztBQ3JCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFVBQUE7WUFDQSxhQUFBO1lBQ0EsOERBQUEsU0FBQSxRQUFBLFNBQUEsWUFBQSxZQUFBO2dCQUNBLElBQUEsS0FBQTs7Ozs7OztnQkFPQSxHQUFBLFNBQUEsVUFBQSxPQUFBO29CQUNBLElBQUEsU0FBQSxNQUFBLFFBQUE7d0JBQ0EsV0FBQSxXQUFBO3dCQUNBLE9BQUEsT0FBQTs0QkFDQSxLQUFBLFdBQUEsS0FBQSxZQUFBOzRCQUNBLFNBQUEsQ0FBQSxlQUFBLFdBQUEsYUFBQSxRQUFBOzRCQUNBLE1BQUE7Z0NBQ0EsVUFBQTs7MkJBRUEsUUFBQSxVQUFBLFVBQUE7NEJBQ0EsV0FBQSxXQUFBOzRCQUNBLFdBQUEsV0FBQTs0QkFDQSxRQUFBLElBQUEsV0FBQSxvQkFBQSxTQUFBLEtBQUE7MkJBQ0EsTUFBQSxZQUFBOzRCQUNBLFFBQUEsSUFBQSxTQUFBLG1CQUFBOzs7OztZQUtBLGNBQUE7OztLQUdBIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhciBcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJykgXG4gICAgICAgIC5jb21wb25lbnQoJ2Ryb3Bkb3duJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9kcm9wZG93bi5odG1sJ1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnOyBcblxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpIFxuICAgICAgICAuY29tcG9uZW50KCdsb2FkaW5nJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpY29uOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvbG9hZGluZy5odG1sJ1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCdsb2dvdXQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxidXR0b24gbmctY2xpY2s9XCJMb2dvdXQubG9nb3V0KClcIiBjbGFzcz1cImxvZ291dCBidG4tZGFuZ2VyXCI+PGkgY2xhc3M9XCJmYS1zaWduLW91dFwiPjwvaT48L2J1dHRvbj4nLFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHJvb3RTY29wZSwgJGF1dGgsICRzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0xvZ291dCdcbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ21lbnVUdWNhbm8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvbWVudS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBPcGVuIHN1Ym1lbnVcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0ub3BlblN1YiA9IGZ1bmN0aW9uKG1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBtZW51KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3ViT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBtZW51LnN1Yk9wZW4gPSAhbWVudS5zdWJPcGVuO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBPcGVuIGluZmVyaW9yIG1lbnVcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHN1YlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLm9wZW5JbmYgPSBmdW5jdGlvbihtZW51LCBzdWIpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1lbnUuc3ViLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBzdWIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHN1Yi5zdWJPcGVuID0gIXN1Yi5zdWJPcGVuO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRyaWV2ZSBtZW51IGl0ZW5zXG4gICAgICAgICAgICAgICAgICogQHR5cGUgeypbXX1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS5pdGVtcyA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQYWluZWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5kYXNoYm9hcmQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1kYXNoYm9hcmQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGVkaWRvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnBlZGlkb3MuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1jdWJlcydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdDbGllbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmNsaWVudGVzLmluZGV4JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHV0b3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRyb3Bib3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1Byb2R1dG9zJywgaWNvbjogJ2ZhLWxpc3QnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0xpbmhhcycsIGljb246ICdmYS1saXN0LWFsdCcsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucHJvZHV0b3MubGluaGFzLmluZGV4JykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTWFyY2FzJywgaWNvbjogJ2ZhLWxpc3QtYWx0Jywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wcm9kdXRvcy5tYXJjYXMuaW5kZXgnKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdBc3Npc3TDqm5jaWEnLCBpY29uOiAnZmEtd3JlbmNoJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ01vdmltZW50YcOnw7VlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtZXhjaGFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0VudHJhZGEnLCBpY29uOiAnZmEtbWFpbC1yZXBseScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnU2HDrWRhJywgaWNvbjogJ2ZhLW1haWwtZm9yd2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRGVmZWl0bycsIGljb246ICdmYS1jaGFpbi1icm9rZW4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1RyYW5zcG9ydGFkb3JhcycsIGljb246ICdmYS10cnVjaycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRm9ybmVjZWRvcmVzJywgaWNvbjogJ2ZhLWJ1aWxkaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdGb3JtYXMgZGUgcGFnYW1lbnRvJywgaWNvbjogJ2ZhLW1vbmV5JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdPcGVyYcOnw6NvIGZpc2NhbCcsIGljb246ICdmYS1wZXJjZW50JyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRmluYW5jZWlybycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtbW9uZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0NvbnRhcyBhIHBhZ2FyL3JlY2ViZXInLCBpY29uOiAnZmEtY3JlZGl0LWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1BsYW5vIGRlIGNvbnRhcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Jhc3RyZWlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnYXRlbmRpbWVudG8nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MgaW1wb3J0YW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnJhc3RyZWlvcy5pbXBvcnRhbnRlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUElcXCdzIHBlbmRlbnRlcycgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLnBpcy5wZW5kZW50ZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Rldm9sdcOnw7VlcyBwZW5kZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdW5kbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLmRldm9sdWNvZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZWxhdMOzcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtcGllLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ0NhaXhhIGRpw6FyaW8nLCBpY29uOiAnZmEtbW9uZXknfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdJQ01TIG1lbnNhbCcsIGljb246ICdmYS1maWxlLXBkZi1vJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hZG1pbi5pY21zJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ29uZmlndXJhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1jb2cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdNYXJrZXRpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWJ1bGxob3JuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ1RlbXBsYXRlIE1MJywgaWNvbjogJ2ZhLWNsaXBib2FyZCcsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAubWFya2V0aW5nLnRlbXBsYXRlbWwnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbnRlcm5vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1kZXNrdG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEYWRvcyBkYSBlbXByZXNhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWluZm8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSW1wb3N0b3MgZGEgbm90YScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1wZXJjZW50J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1VzdcOhcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS11c2VycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuaW50ZXJuby51c3Vhcmlvcy5pbmRleCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTWVudSdcbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ21ldGFzJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL21ldGFzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsICRpbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0ge307XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRNZXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbWV0YXMvYXR1YWwnKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKG1ldGFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gbWV0YXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5sb2FkTWV0YSgpO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogVGltZW91dCBtZXRhc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgICAgICAgICB9LCA2MDAwMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTWV0YXMnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3BhZ2VUaXRsZScsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaWNvbjogJ0AnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9wYWdlLXRpdGxlLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3RhYmxlSGVhZGVyJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtaGVhZGVyLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgIC5zZXJ2aWNlKCdUYWJsZUhlYWRlcicsIGZ1bmN0aW9uKCRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHZhciBuYW1lLCB2bSwgcGFnaW5hdGlvbjtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbihuYW1lLCB2bSwgdXNlRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0gICA9IHZtO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uKSAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvbi5oYXNPd25Qcm9wZXJ0eSh0aGlzLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb25bdGhpcy5uYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogJzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbiA9ICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvblt0aGlzLm5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwcmV2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdGlvbi5wYWdlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZS0tO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2luYXRpb24ucGFnZSA9PT0gdGhpcy52bS50YWJsZURhdGEubGFzdF9wYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZSsrO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2hhbmdlUGVyUGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCd0YWJsZUxpc3QnLCB0YWJsZUxpc3QpO1xuXG4gICAgZnVuY3Rpb24gdGFibGVMaXN0KCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHRhYmxlTGlzdDogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCwgdHJhbnNjbHVkZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3RhYmxlIGluZm8tc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgIHRyYW5zY2x1ZGUoZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbignI3RvVHJhbnNjbHVkZScpLnJlcGxhY2VXaXRoKGNsb25lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtbGlzdC5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCd1cGxvYWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdXBsb2FkLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oVXBsb2FkLCB0b2FzdGVyLCBlbnZTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFVwbG9hZCBub3Rhc1xuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIGZpbGVzXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0udXBsb2FkID0gZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtBdXRob3JpemF0aW9uOiAnQmVhcmVyICcrIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnF1aXZvczogZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzdG9wLWxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdVcGxvYWQgY29uY2x1w61kbycsIHJlc3BvbnNlLmRhdGEubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCBcIkVycm8gbm8gdXBsb2FkIVwiLCBcIkVycm8gYW8gZW52aWFyIGFycXVpdm9zLCB0ZW50ZSBub3ZhbWVudGUhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1VwbG9hZCdcbiAgICAgICAgfSk7XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
