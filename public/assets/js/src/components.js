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
                            { title: 'Produtos', icon: 'fa-list', sref: $state.href('app.produtos.index') },
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
                /*$interval(function() {
                    vm.loadMeta();
                }, 60000);z*/
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
        .service('TabsHelper', function() {
            var vm = this;
            vm.tabs = [];
            vm.tab = null;

            return {
                clear: function() {
                    vm.tabs = [];
                    vm.tab = null;

                    return true;
                },
                get: function() {
                    return vm.tabs;
                },
                set: function(tab) {
                    var tabs = this.get();

                    for (var i in tabs) {
                        if (tabs[i].name === tab || tabs[i].name === tab.name) {
                            vm.tab = tabs[i];
                            break;
                        }
                    }
                },
                is: function(tab) {
                    return vm.tab.name === tab.name || vm.tab.name === tab;
                },
                register: function(tab) {
                    var match = false;
                    var tabs = this.get();
                    for (var i in tabs) {
                        if (tabs[i].name === tab || tabs[i].name === tab.name) {
                            match = true;
                            break;
                        }
                    }

                    if (!match)
                        vm.tabs.push(tab);

                    if (!vm.tab)
                        vm.tab = tab;
                }
            };
        })

        .directive('tabs', ["TabsHelper", function(TabsHelper) {
            return {
                scope: {},
                transclude: true,
                replace: true,
                restrict: 'E',
                templateUrl: 'views/components/tabs.html',
                controller: function() {
                    TabsHelper.clear();

                    this.get = function() {
                        return TabsHelper.get();
                    };

                    this.set = function(tab) {
                        TabsHelper.set(tab);
                    };

                    this.is = function(tab) {
                        return TabsHelper.is(tab);
                    };
                },
                controllerAs: 'Tabs'
            };
        }])

        .directive('tab', ["TabsHelper", function(TabsHelper) {
            return {
                restrict: 'E',
                scope: {
                    name: '@',
                    title: '@'
                },
                require: '^tabs',
                template: '<div class="tab-item" ng-class="{ \'active\': Tab.is() }" ng-transclude></div>',
                replace: true,
                transclude: true,
                controller: ["$scope", function($scope) {
                    this.tab = { name: $scope.name, title: $scope.title };
                    TabsHelper.register(this.tab);

                    this.is = function(tab) {
                        return TabsHelper.is(this.tab);
                    };
                }],
                controllerAs: 'Tab'
            };
        }]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duLmpzIiwiTG9hZGluZy5qcyIsIkxvZ291dC5qcyIsIk1lbnUuanMiLCJNZXRhcy5qcyIsIlBhZ2VUaXRsZS5qcyIsIlRhYmxlSGVhZGVyLmpzIiwiVGFibGVMaXN0LmpzIiwiVGFicy5qcyIsIlVwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFlBQUE7WUFDQSxVQUFBO2dCQUNBLE9BQUE7O1lBRUEsWUFBQTtZQUNBLGFBQUE7Ozs7QUNWQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7WUFDQSxVQUFBO2dCQUNBLE1BQUE7O1lBRUEsYUFBQTs7OztBQ1RBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsVUFBQTtZQUNBLFVBQUE7WUFDQSw4Q0FBQSxTQUFBLFlBQUEsT0FBQSxRQUFBO2dCQUNBLEtBQUEsU0FBQSxXQUFBO29CQUNBLE1BQUEsU0FBQSxLQUFBLFdBQUE7d0JBQ0EsYUFBQSxXQUFBO3dCQUNBLFdBQUEsZ0JBQUE7d0JBQ0EsV0FBQSxjQUFBOzt3QkFFQSxPQUFBLEdBQUE7Ozs7WUFJQSxjQUFBOzs7QUNsQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxjQUFBO1lBQ0EsYUFBQTtZQUNBLHVCQUFBLFNBQUEsUUFBQTtnQkFDQSxJQUFBLEtBQUE7Ozs7Ozs7Z0JBT0EsR0FBQSxVQUFBLFNBQUEsTUFBQTtvQkFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBOzs7b0JBR0EsS0FBQSxVQUFBLENBQUEsS0FBQTs7Ozs7Ozs7O2dCQVNBLEdBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtvQkFDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBOzs7b0JBR0EsSUFBQSxVQUFBLENBQUEsSUFBQTs7Ozs7OztnQkFPQSxHQUFBLFFBQUE7b0JBQ0E7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTt3QkFDQSxNQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBO3dCQUNBLE1BQUE7O29CQUVBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7d0JBQ0EsTUFBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLEtBQUE7NEJBQ0EsRUFBQSxPQUFBLFlBQUEsTUFBQSxXQUFBLE1BQUEsT0FBQSxLQUFBOzRCQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUEsZUFBQSxNQUFBLE9BQUEsS0FBQTs0QkFDQSxFQUFBLE9BQUEsVUFBQSxNQUFBLGVBQUEsTUFBQSxPQUFBLEtBQUE7NEJBQ0EsRUFBQSxPQUFBLGVBQUEsTUFBQTs7O29CQUdBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxLQUFBOzRCQUNBLEVBQUEsT0FBQSxXQUFBLE1BQUE7NEJBQ0EsRUFBQSxPQUFBLFNBQUEsTUFBQTs0QkFDQSxFQUFBLE9BQUEsV0FBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxtQkFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxnQkFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSx1QkFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxtQkFBQSxNQUFBOzs7b0JBR0E7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLEtBQUE7NEJBQ0EsRUFBQSxPQUFBLDBCQUFBLE1BQUE7NEJBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7OztvQkFHQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsT0FBQSxDQUFBLFNBQUE7d0JBQ0EsS0FBQTs0QkFDQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7Z0NBQ0EsTUFBQSxPQUFBLEtBQUE7OzRCQUVBO2dDQUNBLE9BQUE7Z0NBQ0EsTUFBQTtnQ0FDQSxNQUFBLE9BQUEsS0FBQTs7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LE1BQUEsWUFBQTtnQkFDQSxRQUFBLFNBQUE7O2dCQUVBLFdBQUEsU0FBQSxPQUFBO29CQUNBLFFBQUEsU0FBQSxpQkFBQSxZQUFBOzs7WUFHQSxhQUFBOzs7OztBQ3JCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLGNBQUEsV0FBQTtZQUNBLElBQUEsS0FBQTtZQUNBLEdBQUEsT0FBQTtZQUNBLEdBQUEsTUFBQTs7WUFFQSxPQUFBO2dCQUNBLE9BQUEsV0FBQTtvQkFDQSxHQUFBLE9BQUE7b0JBQ0EsR0FBQSxNQUFBOztvQkFFQSxPQUFBOztnQkFFQSxLQUFBLFdBQUE7b0JBQ0EsT0FBQSxHQUFBOztnQkFFQSxLQUFBLFNBQUEsS0FBQTtvQkFDQSxJQUFBLE9BQUEsS0FBQTs7b0JBRUEsS0FBQSxJQUFBLEtBQUEsTUFBQTt3QkFDQSxJQUFBLEtBQUEsR0FBQSxTQUFBLE9BQUEsS0FBQSxHQUFBLFNBQUEsSUFBQSxNQUFBOzRCQUNBLEdBQUEsTUFBQSxLQUFBOzRCQUNBOzs7O2dCQUlBLElBQUEsU0FBQSxLQUFBO29CQUNBLE9BQUEsR0FBQSxJQUFBLFNBQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxTQUFBOztnQkFFQSxVQUFBLFNBQUEsS0FBQTtvQkFDQSxJQUFBLFFBQUE7b0JBQ0EsSUFBQSxPQUFBLEtBQUE7b0JBQ0EsS0FBQSxJQUFBLEtBQUEsTUFBQTt3QkFDQSxJQUFBLEtBQUEsR0FBQSxTQUFBLE9BQUEsS0FBQSxHQUFBLFNBQUEsSUFBQSxNQUFBOzRCQUNBLFFBQUE7NEJBQ0E7Ozs7b0JBSUEsSUFBQSxDQUFBO3dCQUNBLEdBQUEsS0FBQSxLQUFBOztvQkFFQSxJQUFBLENBQUEsR0FBQTt3QkFDQSxHQUFBLE1BQUE7Ozs7O1NBS0EsVUFBQSx1QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsWUFBQTtnQkFDQSxTQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsYUFBQTtnQkFDQSxZQUFBLFdBQUE7b0JBQ0EsV0FBQTs7b0JBRUEsS0FBQSxNQUFBLFdBQUE7d0JBQ0EsT0FBQSxXQUFBOzs7b0JBR0EsS0FBQSxNQUFBLFNBQUEsS0FBQTt3QkFDQSxXQUFBLElBQUE7OztvQkFHQSxLQUFBLEtBQUEsU0FBQSxLQUFBO3dCQUNBLE9BQUEsV0FBQSxHQUFBOzs7Z0JBR0EsY0FBQTs7OztTQUlBLFVBQUEsc0JBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQTtnQkFDQSxVQUFBO2dCQUNBLE9BQUE7b0JBQ0EsTUFBQTtvQkFDQSxPQUFBOztnQkFFQSxTQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsU0FBQTtnQkFDQSxZQUFBO2dCQUNBLHVCQUFBLFNBQUEsUUFBQTtvQkFDQSxLQUFBLE1BQUEsRUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLE9BQUE7b0JBQ0EsV0FBQSxTQUFBLEtBQUE7O29CQUVBLEtBQUEsS0FBQSxTQUFBLEtBQUE7d0JBQ0EsT0FBQSxXQUFBLEdBQUEsS0FBQTs7O2dCQUdBLGNBQUE7Ozs7QUNqR0EsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLDhEQUFBLFNBQUEsUUFBQSxTQUFBLFlBQUEsWUFBQTtnQkFDQSxJQUFBLEtBQUE7Ozs7Ozs7Z0JBT0EsR0FBQSxTQUFBLFVBQUEsT0FBQTtvQkFDQSxJQUFBLFNBQUEsTUFBQSxRQUFBO3dCQUNBLFdBQUEsV0FBQTt3QkFDQSxPQUFBLE9BQUE7NEJBQ0EsS0FBQSxXQUFBLEtBQUEsWUFBQTs0QkFDQSxTQUFBLENBQUEsZUFBQSxXQUFBLGFBQUEsUUFBQTs0QkFDQSxNQUFBO2dDQUNBLFVBQUE7OzJCQUVBLFFBQUEsVUFBQSxVQUFBOzRCQUNBLFdBQUEsV0FBQTs0QkFDQSxXQUFBLFdBQUE7NEJBQ0EsUUFBQSxJQUFBLFdBQUEsb0JBQUEsU0FBQSxLQUFBOzJCQUNBLE1BQUEsWUFBQTs0QkFDQSxRQUFBLElBQUEsU0FBQSxtQkFBQTs7Ozs7WUFLQSxjQUFBOzs7S0FHQSIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpIFxuICAgICAgICAuY29tcG9uZW50KCdkcm9wZG93bicsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvZHJvcGRvd24uaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JzsgXG5cbiAgICBhbmd1bGFyIFxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKSBcbiAgICAgICAgLmNvbXBvbmVudCgnbG9hZGluZycsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaWNvbjogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL2xvYWRpbmcuaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgnbG9nb3V0Jywge1xuICAgICAgICAgICAgdGVtcGxhdGU6ICc8YnV0dG9uIG5nLWNsaWNrPVwiTG9nb3V0LmxvZ291dCgpXCIgY2xhc3M9XCJsb2dvdXQgYnRuLWRhbmdlclwiPjxpIGNsYXNzPVwiZmEtc2lnbi1vdXRcIj48L2k+PC9idXR0b24+JyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRyb290U2NvcGUsICRhdXRoLCAkc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkYXV0aC5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdMb2dvdXQnXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCdtZW51VHVjYW5vJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL21lbnUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogT3BlbiBzdWJtZW51XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbWVudVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLm9wZW5TdWIgPSBmdW5jdGlvbihtZW51KSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gbWVudSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN1Yk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbWVudS5zdWJPcGVuID0gIW1lbnUuc3ViT3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogT3BlbiBpbmZlcmlvciBtZW51XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbWVudVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBzdWJcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS5vcGVuSW5mID0gZnVuY3Rpb24obWVudSwgc3ViKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZW51LnN1YiwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gc3ViKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3ViT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzdWIuc3ViT3BlbiA9ICFzdWIuc3ViT3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0cmlldmUgbWVudSBpdGVuc1xuICAgICAgICAgICAgICAgICAqIEB0eXBlIHsqW119XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0uaXRlbXMgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGFpbmVsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuZGFzaGJvYXJkJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtZGFzaGJvYXJkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BlZGlkb3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wZWRpZG9zLmluZGV4JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtY3ViZXMnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ2xpZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5jbGllbnRlcy5pbmRleCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVzZXJzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1dG9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1kcm9wYm94JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdQcm9kdXRvcycsIGljb246ICdmYS1saXN0Jywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wcm9kdXRvcy5pbmRleCcpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0xpbmhhcycsIGljb246ICdmYS1saXN0LWFsdCcsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucHJvZHV0b3MubGluaGFzLmluZGV4JykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTWFyY2FzJywgaWNvbjogJ2ZhLWxpc3QtYWx0Jywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wcm9kdXRvcy5tYXJjYXMuaW5kZXgnKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdBc3Npc3TDqm5jaWEnLCBpY29uOiAnZmEtd3JlbmNoJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ01vdmltZW50YcOnw7VlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtZXhjaGFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0VudHJhZGEnLCBpY29uOiAnZmEtbWFpbC1yZXBseScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnU2HDrWRhJywgaWNvbjogJ2ZhLW1haWwtZm9yd2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRGVmZWl0bycsIGljb246ICdmYS1jaGFpbi1icm9rZW4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1RyYW5zcG9ydGFkb3JhcycsIGljb246ICdmYS10cnVjaycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRm9ybmVjZWRvcmVzJywgaWNvbjogJ2ZhLWJ1aWxkaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdGb3JtYXMgZGUgcGFnYW1lbnRvJywgaWNvbjogJ2ZhLW1vbmV5JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdPcGVyYcOnw6NvIGZpc2NhbCcsIGljb246ICdmYS1wZXJjZW50JyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRmluYW5jZWlybycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtbW9uZXknLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0NvbnRhcyBhIHBhZ2FyL3JlY2ViZXInLCBpY29uOiAnZmEtY3JlZGl0LWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1BsYW5vIGRlIGNvbnRhcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Jhc3RyZWlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnYXRlbmRpbWVudG8nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MgaW1wb3J0YW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnJhc3RyZWlvcy5pbXBvcnRhbnRlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUElcXCdzIHBlbmRlbnRlcycgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLnBpcy5wZW5kZW50ZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Rldm9sdcOnw7VlcyBwZW5kZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdW5kbycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLmRldm9sdWNvZXMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZWxhdMOzcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtcGllLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ0NhaXhhIGRpw6FyaW8nLCBpY29uOiAnZmEtbW9uZXknfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdJQ01TIG1lbnNhbCcsIGljb246ICdmYS1maWxlLXBkZi1vJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hZG1pbi5pY21zJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ29uZmlndXJhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1jb2cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdNYXJrZXRpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWJ1bGxob3JuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ1RlbXBsYXRlIE1MJywgaWNvbjogJ2ZhLWNsaXBib2FyZCcsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAubWFya2V0aW5nLnRlbXBsYXRlbWwnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbnRlcm5vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1kZXNrdG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEYWRvcyBkYSBlbXByZXNhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWluZm8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSW1wb3N0b3MgZGEgbm90YScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1wZXJjZW50J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1VzdcOhcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS11c2VycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuaW50ZXJuby51c3Vhcmlvcy5pbmRleCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTWVudSdcbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ21ldGFzJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL21ldGFzLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsICRpbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB2bS5kYXRhID0ge307XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRNZXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbWV0YXMvYXR1YWwnKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKG1ldGFzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5kYXRhID0gbWV0YXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5sb2FkTWV0YSgpO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogVGltZW91dCBtZXRhc1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8qJGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkTWV0YSgpO1xuICAgICAgICAgICAgICAgIH0sIDYwMDAwKTt6Ki9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdNZXRhcydcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgncGFnZVRpdGxlJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpY29uOiAnQCcsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3BhZ2UtdGl0bGUuaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgndGFibGVIZWFkZXInLCB7XG4gICAgICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgICAgIGRhdGE6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy90YWJsZS1oZWFkZXIuaHRtbCdcbiAgICAgICAgfSlcbiAgICAgICAgLnNlcnZpY2UoJ1RhYmxlSGVhZGVyJywgZnVuY3Rpb24oJGxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgdmFyIG5hbWUsIHZtLCBwYWdpbmF0aW9uO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKG5hbWUsIHZtLCB1c2VGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bSAgID0gdm07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb24pICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvbiA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uLmhhc093blByb3BlcnR5KHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvblt0aGlzLm5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6ICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcl9wYWdlOiAnMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0gJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uW3RoaXMubmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHByZXY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0aW9uLnBhZ2UgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlLS07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdGlvbi5wYWdlID09PSB0aGlzLnZtLnRhYmxlRGF0YS5sYXN0X3BhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlKys7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBjaGFuZ2VQZXJQYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RhYmxlTGlzdCcsIHRhYmxlTGlzdCk7XG5cbiAgICBmdW5jdGlvbiB0YWJsZUxpc3QoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdGFibGVMaXN0OiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsLCB0cmFuc2NsdWRlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygndGFibGUgaW5mby1zdHlsZScpO1xuXG4gICAgICAgICAgICAgICAgdHJhbnNjbHVkZShmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCcjdG9UcmFuc2NsdWRlJykucmVwbGFjZVdpdGgoY2xvbmUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy90YWJsZS1saXN0Lmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdUYWJzSGVscGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgdm0udGFicyA9IFtdO1xuICAgICAgICAgICAgdm0udGFiID0gbnVsbDtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnRhYnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdm0udGFiID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS50YWJzO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYnMgPSB0aGlzLmdldCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGFicykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYnNbaV0ubmFtZSA9PT0gdGFiIHx8IHRhYnNbaV0ubmFtZSA9PT0gdGFiLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50YWIgPSB0YWJzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpczogZnVuY3Rpb24odGFiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS50YWIubmFtZSA9PT0gdGFiLm5hbWUgfHwgdm0udGFiLm5hbWUgPT09IHRhYjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlZ2lzdGVyOiBmdW5jdGlvbih0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJzID0gdGhpcy5nZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0YWJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFic1tpXS5uYW1lID09PSB0YWIgfHwgdGFic1tpXS5uYW1lID09PSB0YWIubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbWF0Y2gpXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS50YWJzLnB1c2godGFiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZtLnRhYilcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRhYiA9IHRhYjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3RhYnMnLCBmdW5jdGlvbihUYWJzSGVscGVyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFicy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgVGFic0hlbHBlci5jbGVhcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVGFic0hlbHBlci5nZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCA9IGZ1bmN0aW9uKHRhYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgVGFic0hlbHBlci5zZXQodGFiKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzID0gZnVuY3Rpb24odGFiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVGFic0hlbHBlci5pcyh0YWIpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVGFicydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgndGFiJywgZnVuY3Rpb24oVGFic0hlbHBlcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdAJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdAJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVxdWlyZTogJ150YWJzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0YWItaXRlbVwiIG5nLWNsYXNzPVwieyBcXCdhY3RpdmVcXCc6IFRhYi5pcygpIH1cIiBuZy10cmFuc2NsdWRlPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYiA9IHsgbmFtZTogJHNjb3BlLm5hbWUsIHRpdGxlOiAkc2NvcGUudGl0bGUgfTtcbiAgICAgICAgICAgICAgICAgICAgVGFic0hlbHBlci5yZWdpc3Rlcih0aGlzLnRhYik7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pcyA9IGZ1bmN0aW9uKHRhYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRhYnNIZWxwZXIuaXModGhpcy50YWIpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVGFiJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3VwbG9hZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy91cGxvYWQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbihVcGxvYWQsIHRvYXN0ZXIsIGVudlNlcnZpY2UsICRyb290U2NvcGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogVXBsb2FkIG5vdGFzXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gZmlsZXNcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS51cGxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3VwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJysgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycXVpdm9zOiBmaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3N0b3AtbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1VwbG9hZCBjb25jbHXDrWRvJywgcmVzcG9uc2UuZGF0YS5tc2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiRXJybyBubyB1cGxvYWQhXCIsIFwiRXJybyBhbyBlbnZpYXIgYXJxdWl2b3MsIHRlbnRlIG5vdmFtZW50ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVXBsb2FkJ1xuICAgICAgICB9KTtcblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
