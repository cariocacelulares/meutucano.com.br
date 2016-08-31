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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duLmpzIiwiTG9hZGluZy5qcyIsIkxvZ291dC5qcyIsIk1lbnUuanMiLCJNZXRhcy5qcyIsIlBhZ2VUaXRsZS5qcyIsIlRhYmxlSGVhZGVyLmpzIiwiVGFibGVMaXN0LmpzIiwiVGFicy5qcyIsIlVwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFlBQUE7WUFDQSxVQUFBO2dCQUNBLE9BQUE7O1lBRUEsWUFBQTtZQUNBLGFBQUE7Ozs7QUNWQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7WUFDQSxVQUFBO2dCQUNBLE1BQUE7O1lBRUEsYUFBQTs7OztBQ1RBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsVUFBQTtZQUNBLFVBQUE7WUFDQSw4Q0FBQSxTQUFBLFlBQUEsT0FBQSxRQUFBO2dCQUNBLEtBQUEsU0FBQSxXQUFBO29CQUNBLE1BQUEsU0FBQSxLQUFBLFdBQUE7d0JBQ0EsYUFBQSxXQUFBO3dCQUNBLFdBQUEsZ0JBQUE7d0JBQ0EsV0FBQSxjQUFBOzt3QkFFQSxPQUFBLEdBQUE7Ozs7WUFJQSxjQUFBOzs7QUNsQkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxjQUFBO1lBQ0EsYUFBQTtZQUNBLHVCQUFBLFNBQUEsUUFBQTtnQkFDQSxJQUFBLEtBQUE7Ozs7Ozs7Z0JBT0EsR0FBQSxVQUFBLFNBQUEsTUFBQTtvQkFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBOzs7b0JBR0EsS0FBQSxVQUFBLENBQUEsS0FBQTs7Ozs7Ozs7O2dCQVNBLEdBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtvQkFDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLFFBQUE7NEJBQ0EsS0FBQSxVQUFBOzs7b0JBR0EsSUFBQSxVQUFBLENBQUEsSUFBQTs7Ozs7OztnQkFPQSxHQUFBLFFBQUE7b0JBQ0E7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTt3QkFDQSxNQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBO3dCQUNBLE1BQUE7O29CQUVBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7d0JBQ0EsTUFBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLEtBQUE7NEJBQ0EsRUFBQSxPQUFBLFlBQUEsTUFBQTs0QkFDQSxFQUFBLE9BQUEsVUFBQSxNQUFBLGVBQUEsTUFBQSxPQUFBLEtBQUE7NEJBQ0EsRUFBQSxPQUFBLFVBQUEsTUFBQSxlQUFBLE1BQUEsT0FBQSxLQUFBOzRCQUNBLEVBQUEsT0FBQSxlQUFBLE1BQUE7OztvQkFHQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsS0FBQTs0QkFDQSxFQUFBLE9BQUEsV0FBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxTQUFBLE1BQUE7NEJBQ0EsRUFBQSxPQUFBLFdBQUEsTUFBQTs0QkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTs0QkFDQSxFQUFBLE9BQUEsZ0JBQUEsTUFBQTs0QkFDQSxFQUFBLE9BQUEsdUJBQUEsTUFBQTs0QkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTs7O29CQUdBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxLQUFBOzRCQUNBLEVBQUEsT0FBQSwwQkFBQSxNQUFBOzRCQUNBLEVBQUEsT0FBQSxtQkFBQSxNQUFBOzs7b0JBR0E7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE9BQUEsQ0FBQSxTQUFBO3dCQUNBLEtBQUE7NEJBQ0E7Z0NBQ0EsT0FBQTtnQ0FDQSxNQUFBO2dDQUNBLE1BQUEsT0FBQSxLQUFBOzs0QkFFQTtnQ0FDQSxPQUFBO2dDQUNBLE1BQUE7Z0NBQ0EsTUFBQSxPQUFBLEtBQUE7OzRCQUVBO2dDQUNBLE9BQUE7Z0NB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O2dCQUVBLFdBQUEsU0FBQSxPQUFBO29CQUNBLFFBQUEsU0FBQSxpQkFBQSxZQUFBOzs7WUFHQSxhQUFBOzs7OztBQ3JCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFFBQUE7WUFDQSxZQUFBO1lBQ0EsYUFBQTs7OztBQ1BBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsVUFBQTtZQUNBLGFBQUE7WUFDQSw4REFBQSxTQUFBLFFBQUEsU0FBQSxZQUFBLFlBQUE7Z0JBQ0EsSUFBQSxLQUFBOzs7Ozs7O2dCQU9BLEdBQUEsU0FBQSxVQUFBLE9BQUE7b0JBQ0EsSUFBQSxTQUFBLE1BQUEsUUFBQTt3QkFDQSxXQUFBLFdBQUE7d0JBQ0EsT0FBQSxPQUFBOzRCQUNBLEtBQUEsV0FBQSxLQUFBLFlBQUE7NEJBQ0EsU0FBQSxDQUFBLGVBQUEsV0FBQSxhQUFBLFFBQUE7NEJBQ0EsTUFBQTtnQ0FDQSxVQUFBOzsyQkFFQSxRQUFBLFVBQUEsVUFBQTs0QkFDQSxXQUFBLFdBQUE7NEJBQ0EsV0FBQSxXQUFBOzRCQUNBLFFBQUEsSUFBQSxXQUFBLG9CQUFBLFNBQUEsS0FBQTsyQkFDQSxNQUFBLFlBQUE7NEJBQ0EsUUFBQSxJQUFBLFNBQUEsbUJBQUE7Ozs7O1lBS0EsY0FBQTs7O0tBR0EiLCJmaWxlIjoiY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyIFxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKSBcbiAgICAgICAgLmNvbXBvbmVudCgnZHJvcGRvd24nLCB7XG4gICAgICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL2Ryb3Bkb3duLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7IFxuXG4gICAgYW5ndWxhciBcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJykgXG4gICAgICAgIC5jb21wb25lbnQoJ2xvYWRpbmcnLCB7XG4gICAgICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgICAgIGljb246ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9sb2FkaW5nLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ2xvZ291dCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGJ1dHRvbiBuZy1jbGljaz1cIkxvZ291dC5sb2dvdXQoKVwiIGNsYXNzPVwibG9nb3V0IGJ0bi1kYW5nZXJcIj48aSBjbGFzcz1cImZhLXNpZ24tb3V0XCI+PC9pPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkcm9vdFNjb3BlLCAkYXV0aCwgJHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGF1dGgubG9nb3V0KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTG9nb3V0J1xuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgnbWVudVR1Y2FubycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9tZW51Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIE9wZW4gc3VibWVudVxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG1lbnVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS5vcGVuU3ViID0gZnVuY3Rpb24obWVudSkge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtICE9IG1lbnUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIG1lbnUuc3ViT3BlbiA9ICFtZW51LnN1Yk9wZW47XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIE9wZW4gaW5mZXJpb3IgbWVudVxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG1lbnVcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gc3ViXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdm0ub3BlbkluZiA9IGZ1bmN0aW9uKG1lbnUsIHN1Yikge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gobWVudS5zdWIsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtICE9IHN1YilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN1Yk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc3ViLnN1Yk9wZW4gPSAhc3ViLnN1Yk9wZW47XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldHJpZXZlIG1lbnUgaXRlbnNcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7KltdfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZtLml0ZW1zID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BhaW5lbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmRhc2hib2FyZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRhc2hib2FyZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQZWRpZG9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucGVkaWRvcy5pbmRleCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWN1YmVzJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0NsaWVudGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuY2xpZW50ZXMuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS11c2VycydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdXRvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtZHJvcGJveCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnUHJvZHV0b3MnLCBpY29uOiAnZmEtbGlzdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTGluaGFzJywgaWNvbjogJ2ZhLWxpc3QtYWx0Jywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wcm9kdXRvcy5saW5oYXMuaW5kZXgnKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdNYXJjYXMnLCBpY29uOiAnZmEtbGlzdC1hbHQnLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnByb2R1dG9zLm1hcmNhcy5pbmRleCcpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0Fzc2lzdMOqbmNpYScsIGljb246ICdmYS13cmVuY2gnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92aW1lbnRhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1leGNoYW5nZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRW50cmFkYScsIGljb246ICdmYS1tYWlsLXJlcGx5JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdTYcOtZGEnLCBpY29uOiAnZmEtbWFpbC1mb3J3YXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdEZWZlaXRvJywgaWNvbjogJ2ZhLWNoYWluLWJyb2tlbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnVHJhbnNwb3J0YWRvcmFzJywgaWNvbjogJ2ZhLXRydWNrJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdGb3JuZWNlZG9yZXMnLCBpY29uOiAnZmEtYnVpbGRpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0Zvcm1hcyBkZSBwYWdhbWVudG8nLCBpY29uOiAnZmEtbW9uZXknIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ09wZXJhw6fDo28gZmlzY2FsJywgaWNvbjogJ2ZhLXBlcmNlbnQnIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdGaW5hbmNlaXJvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1tb25leScsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnQ29udGFzIGEgcGFnYXIvcmVjZWJlcicsIGljb246ICdmYS1jcmVkaXQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnUGxhbm8gZGUgY29udGFzJywgaWNvbjogJ2ZhLWxpc3QnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmFzdHJlaW9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS10cnVjaycsXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbicsICdhdGVuZGltZW50byddLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Jhc3RyZWlvcyBpbXBvcnRhbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS10cnVjaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLmltcG9ydGFudGVzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQSVxcJ3MgcGVuZGVudGVzJyAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS13YXJuaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5yYXN0cmVpb3MucGlzLnBlbmRlbnRlcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGV2b2x1w6fDtWVzIHBlbmRlbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS11bmRvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5yYXN0cmVpb3MuZGV2b2x1Y29lcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbGF0w7NyaW9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1waWUtY2hhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnQ2FpeGEgZGnDoXJpbycsIGljb246ICdmYS1tb25leSd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ0lDTVMgbWVuc2FsJywgaWNvbjogJ2ZhLWZpbGUtcGRmLW8nLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmFkbWluLmljbXMnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdDb25maWd1cmHDp8O1ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWNvZycsXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbiddLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ01hcmtldGluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtYnVsbGhvcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnVGVtcGxhdGUgTUwnLCBpY29uOiAnZmEtY2xpcGJvYXJkJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5tYXJrZXRpbmcudGVtcGxhdGVtbCcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0ludGVybm8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRlc2t0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0RhZG9zIGRhIGVtcHJlc2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtaW5mbydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbXBvc3RvcyBkYSBub3RhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXBlcmNlbnQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVXN1w6FyaW9zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVzZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5pbnRlcm5vLnVzdWFyaW9zLmluZGV4JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdNZW51J1xuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgnbWV0YXMnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvbWV0YXMuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgJGludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHZtLmRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdtZXRhcy9hdHVhbCcpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24obWV0YXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRhdGEgPSBtZXRhcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRNZXRhKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTWV0YXMnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3BhZ2VUaXRsZScsIHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaWNvbjogJ0AnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQCcsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9wYWdlLXRpdGxlLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3RhYmxlSGVhZGVyJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtaGVhZGVyLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgIC5zZXJ2aWNlKCdUYWJsZUhlYWRlcicsIGZ1bmN0aW9uKCRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHZhciBuYW1lLCB2bSwgcGFnaW5hdGlvbjtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbihuYW1lLCB2bSwgdXNlRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0gICA9IHZtO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uKSAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvbi5oYXNPd25Qcm9wZXJ0eSh0aGlzLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb25bdGhpcy5uYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogJzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbiA9ICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvblt0aGlzLm5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwcmV2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnaW5hdGlvbi5wYWdlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZS0tO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2luYXRpb24ucGFnZSA9PT0gdGhpcy52bS50YWJsZURhdGEubGFzdF9wYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZSsrO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2hhbmdlUGVyUGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCd0YWJsZUxpc3QnLCB0YWJsZUxpc3QpO1xuXG4gICAgZnVuY3Rpb24gdGFibGVMaXN0KCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHRhYmxlTGlzdDogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCwgdHJhbnNjbHVkZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3RhYmxlIGluZm8tc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgIHRyYW5zY2x1ZGUoZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbignI3RvVHJhbnNjbHVkZScpLnJlcGxhY2VXaXRoKGNsb25lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtbGlzdC5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29tcG9uZW50KCd0YWJzJywge1xuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy90YWJzLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb21wb25lbnQoJ3VwbG9hZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy91cGxvYWQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbihVcGxvYWQsIHRvYXN0ZXIsIGVudlNlcnZpY2UsICRyb290U2NvcGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogVXBsb2FkIG5vdGFzXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gZmlsZXNcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2bS51cGxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3VwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJysgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycXVpdm9zOiBmaWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3N0b3AtbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1VwbG9hZCBjb25jbHXDrWRvJywgcmVzcG9uc2UuZGF0YS5tc2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiRXJybyBubyB1cGxvYWQhXCIsIFwiRXJybyBhbyBlbnZpYXIgYXJxdWl2b3MsIHRlbnRlIG5vdmFtZW50ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVXBsb2FkJ1xuICAgICAgICB9KTtcblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
