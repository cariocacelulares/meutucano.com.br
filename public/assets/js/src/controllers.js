(function() {
    'use strict';
 
    AppController.$inject = ["$auth", "$state", "$rootScope", "focus", "envService", "$window", "$httpParamSerializer", "ngDialog", "Restangular", "$interval", "toaster"];
    angular 
        .module('MeuTucano')
        .controller('AppController', AppController);

    function AppController($auth, $state, $rootScope, focus, envService, $window, $httpParamSerializer, ngDialog, Restangular, $interval, toaster) {
        var vm = this;

        vm.searchOpen = false;
        vm.user = $rootScope.currentUser;
        vm.metas = {};
        vm.loadingMetas = false;

        $rootScope.$on('upload', function() {
            vm.loadMeta();
        });

        $rootScope.$on('loading', function() {
            vm.loadingMetas = true;
        });

        $rootScope.$on('stop-loading', function() {
            vm.loadingMetas = false;
        });

        vm.loadMeta = function() {
            vm.loadingMetas = true;

            Restangular.one('metas/atual').customGET().then(function(metas) {
                vm.metas = metas;
                vm.loadingMetas = false;
            });
        };
        vm.loadMeta();

        /**
         * Timeout metas
         */
        $interval(function() {
            vm.loadMeta();
        }, 60000);

        /**
         * Open search overlay
         */
        vm.openSearch = function() {
            vm.searchOpen = true;
            focus('searchInput');
        };

        /**
         * Close search overlay
         */
        $rootScope.$on("closeSearch", function(){
            vm.searchOpen = false;
        });

        /**
         * Logout
         */
        vm.logout = function() {
            $auth.logout().then(function() {
                localStorage.removeItem('user');
                $rootScope.authenticated = false;
                $rootScope.currentUser = null;

                $state.go('login');
            });
        };

        /**
         * Generate XML
         * @param pedido_id
         */
        vm.printXML = function(pedido_id) {
            var auth = {
                token: localStorage.getItem("satellizer_token")
            };

            $window.open(envService.read('apiUrl') + '/notas/xml/' + pedido_id + '?' + $httpParamSerializer(auth), 'xml');
        };

        /**
         * Generate DANFE
         * @param pedido_id
         */
        vm.printDanfe = function(pedido_id) {
            var auth = {
                token: localStorage.getItem("satellizer_token")
            };

            $window.open(envService.read('apiUrl') + '/notas/danfe/' + pedido_id + '?' + $httpParamSerializer(auth), 'danfe');
        };

        /**
         * Generate DANFE
         *
         * @param rastreio_id
         */
        vm.printEtiqueta = function(rastreio_id) {
            var auth = {
                token: localStorage.getItem("satellizer_token")
            };

            $window.open(envService.read('apiUrl') + '/rastreios/etiqueta/' + rastreio_id + '?' + $httpParamSerializer(auth), 'etiqueta');
        };

        /**
         * Enviar nota por e-mail
         * @param rastreio
         */
        vm.email = function(pedido_id, email) {
            ngDialog.open({
                template: 'views/atendimento/partials/email.html',
                className: 'ngdialog-theme-default ngdialog-big',
                controller: 'EmailController',
                controllerAs: 'Email',
                data: {
                    pedido_id: pedido_id,
                    email: email
                }
            });
        };

        /**
         * Abrir PI
         * @param rastreio
         */
        vm.pi = function(rastreio) {
            ngDialog.open({
                template: 'views/atendimento/partials/pi.html',
                className: 'ngdialog-theme-default ngdialog-big',
                controller: 'PiController',
                controllerAs: 'Pi',
                data: {
                    rastreio: rastreio
                }
            });
        };

        /**
         * Devolução
         * @param rastreio
         */
        vm.devolucao = function(rastreio) {
            ngDialog.open({
                template: 'views/atendimento/partials/devolucao.html',
                className: 'ngdialog-theme-default ngdialog-big',
                controller: 'DevolucaoController',
                controllerAs: 'Devolucao',
                data: {
                    rastreio: rastreio
                }
            });
        };

        /**
         * Logística reversa
         * @param rastreio
         */
        vm.logistica = function(rastreio) {
            ngDialog.open({
                template: 'views/atendimento/partials/logistica.html',
                className: 'ngdialog-theme-default ngdialog-big',
                controller: 'LogisticaController',
                controllerAs: 'Logistica',
                data: {
                    rastreio: rastreio
                }
            });
        };

        /**
         * Editar rastreio
         * @param rastreio
         */
        vm.editar = function(rastreio) {
            ngDialog.open({
                template: 'views/atendimento/partials/editar.html',
                className: 'ngdialog-theme-default',
                controller: 'EditarController',
                controllerAs: 'Editar',
                data: {
                    rastreio: rastreio
                }
            });
        };

        /**
         * Cancela nota
         * @param pedido_id
         */
        vm.cancelar = function(pedido_id) {
            Restangular.one('pedidos', pedido_id).remove().then(function() {
                $rootScope.$broadcast('upload');
                vm.loadMeta();
                toaster.pop('success', 'Sucesso!', 'Pedido deletado com sucesso!');
            });
        };

        /**
         * Observação
         * @param rastreio
         */
        vm.observacao = function(rastreio) {
            ngDialog.open({
                template: 'views/atendimento/partials/observacao.html',
                className: 'ngdialog-theme-default',
                controller: 'ObservacaoController',
                controllerAs: 'Observacao',
                data: {
                    rastreio: rastreio
                }
            });
        };
    }

})();

(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('DashboardController', DashboardController);

    function DashboardController() {
        var vm = this;

    }

})();
(function() {
    'use strict';

    IcmsController.$inject = ["$rootScope", "Restangular", "envService", "$window", "$httpParamSerializer"];
    angular
        .module('MeuTucano')
        .controller('IcmsController', IcmsController);

    function IcmsController($rootScope, Restangular, envService, $window, $httpParamSerializer) {
        var vm = this;

        /**
         * Gera relatório
         */
        vm.generateRelatorio = function() {
            var auth = {
                token: localStorage.getItem("satellizer_token")
            };

            $window.open(envService.read('apiUrl') + '/relatorios/icms?' + $httpParamSerializer(auth));
        };
    }

})();

(function() {
    'use strict';

    DevolucaoController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('DevolucaoController', DevolucaoController);

    function DevolucaoController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.rastreio = angular.copy($scope.ngDialogData.rastreio);
        vm.devolucao = {};

        vm.fullSend = false;

        if (vm.rastreio.devolucao) {
            vm.devolucao = vm.rastreio.devolucao;
            vm.fullSend = true;
        } else {
            vm.devolucao = {
                motivo_status: vm.rastreio.status,
                rastreio_ref: { valor: vm.rastreio.valor },
                pago_cliente: '0'
            };
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('devolucoes/edit', vm.rastreio.id).customPUT(vm.devolucao).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Devolução criada com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    DevolucaoListController.$inject = ["$rootScope", "Restangular", "ngDialog", "toaster"];
    angular
        .module('MeuTucano')
        .controller('DevolucaoListController', DevolucaoListController);

    function DevolucaoListController($rootScope, Restangular, ngDialog, toaster) {
        var vm = this;

        vm.rastreios = [];
        vm.loading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });

        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Load rastreios
         */
        vm.load = function() {
            vm.rastreios = [];
            vm.loading = true;

            Restangular.all('devolucoes').getList().then(function(rastreios) {
                vm.rastreios = rastreios;
                vm.loading = false;
            });
        };
        vm.load();
    }

})();

(function() {
    'use strict';

    EditarController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('EditarController', EditarController);

    function EditarController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.rastreio = angular.copy($scope.ngDialogData.rastreio);
        vm.cep      = angular.copy($scope.ngDialogData.rastreio.pedido.endereco.cep);

        /**
         * Save the observation
         */
        vm.save = function() {
            var infoEdit = {
                rastreio: vm.rastreio.rastreio,
                data_envio: vm.rastreio.data_envio_readable,
                prazo: vm.rastreio.prazo,
                cep: vm.cep,
                status: vm.rastreio.status
            };

            Restangular.one('rastreios/edit', vm.rastreio.id).customPUT(infoEdit).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Pedido editado com sucesso!');
            });
        };
    }

})();

(function() {
    'use strict';

    EmailController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('EmailController', EmailController);

    function EmailController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.pedido_id = angular.copy($scope.ngDialogData.pedido_id);
        vm.email     = angular.copy($scope.ngDialogData.email);
 
        /**
         * Send e-mail
         */
        vm.save = function() {
            var infoEmail = {
                email: vm.email
            };

            Restangular.one('notas/email', vm.pedido_id).customPOST(infoEmail).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'E-mail enviado com sucesso ao cliente!');
            });
        };
    }

})();

(function() {
    'use strict';

    LogisticaController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('LogisticaController', LogisticaController);

    function LogisticaController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.rastreio = angular.copy($scope.ngDialogData.rastreio);
        vm.logistica = {};
        vm.fullSend = false;
        vm.preSend  = false;

        if (vm.rastreio.logistica) {
            vm.logistica = vm.rastreio.logistica;

            if (vm.logistica.acao) { // Foi cadastrado o código de rastreio
                vm.fullSend = true;
            } else { // Apenas foi cadastrada a PI
                vm.preSend                = true;
                vm.logistica.rastreio_ref = { valor: vm.rastreio.valor };
                console.log(vm.logistica);
            }
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('logisticas/edit', vm.rastreio.id).customPUT(vm.logistica).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Logística reversa criada com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    ObservacaoController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('ObservacaoController', ObservacaoController);

    function ObservacaoController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.observacao = $scope.ngDialogData.rastreio.observacao;

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('rastreios', $scope.ngDialogData.rastreio.id).customPUT({observacao: vm.observacao}).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Observação salva com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    PiController.$inject = ["Restangular", "$rootScope", "$scope", "toaster", "$window", "$httpParamSerializer"];
    angular
        .module('MeuTucano')
        .controller('PiController', PiController);

    function PiController(Restangular, $rootScope, $scope, toaster, $window, $httpParamSerializer) {
        var vm = this;

        vm.rastreio = angular.copy($scope.ngDialogData.rastreio);
        vm.fullSend = false;
        vm.preSend  = false;

        if (vm.rastreio.pi) {
            vm.pi = vm.rastreio.pi;

            if (vm.pi.status) { // Foi enviado a resposta dos correios
                vm.fullSend = true;
            } else { // Apenas foi cadastrada a PI
                vm.preSend         = true;
                vm.pi.rastreio_ref = { valor: vm.rastreio.valor };
                vm.pi.pago_cliente = '0';
            }
        } else {
            vm.pi = {
                motivo_status: vm.rastreio.status
            };
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('pis/edit', vm.rastreio.id).customPUT(vm.pi).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Pedido de informação alterado com sucesso!');
            });
        };

        /**
         * Open PI
         */
        vm.openPi = function() {
            var infoPi = {
                rastreio: vm.rastreio.rastreio,
                nome: vm.rastreio.pedido.cliente.nome,
                cep: vm.rastreio.pedido.endereco.cep,
                endereco: vm.rastreio.pedido.endereco.rua,
                numero: vm.rastreio.pedido.endereco.numero,
                complemento: vm.rastreio.pedido.endereco.complemento,
                bairro: vm.rastreio.pedido.endereco.bairro,
                data: vm.rastreio.data_envio_readable,
                tipo: vm.rastreio.servico,
                status: (vm.rastreio.status == 3) ? 'e' : 'a'
            };

            $window.open('http://www2.correios.com.br/sistemas/falecomoscorreios/?' + $httpParamSerializer(infoPi));
        };
    }

})();
(function() {
    'use strict';

    PiListController.$inject = ["$rootScope", "Restangular", "ngDialog", "toaster"];
    angular
        .module('MeuTucano')
        .controller('PiListController', PiListController);

    function PiListController($rootScope, Restangular, ngDialog, toaster) {
        var vm = this;

        vm.rastreios = [];
        vm.loading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });

        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Load rastreios
         */
        vm.load = function() {
            vm.rastreios = [];
            vm.loading = true;

            Restangular.all('pis').getList().then(function(rastreios) {
                vm.rastreios = rastreios;
                vm.loading = false;
            });
        };
        vm.load();
    }

})();

(function() {
    'use strict';

    RastreioController.$inject = ["$rootScope", "Restangular", "ngDialog", "toaster"];
    angular
        .module('MeuTucano')
        .controller('RastreioController', RastreioController);

    function RastreioController($rootScope, Restangular, ngDialog, toaster) {
        var vm = this;

        vm.rastreios = [];
        vm.loading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });

        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Load rastreios
         */
        vm.load = function() {
            vm.rastreios = [];
            vm.loading = true;

            Restangular.all('rastreios').getList().then(function(rastreios) {
                vm.rastreios = rastreios;
                vm.loading = false;
            });
        };
        vm.load();

        /**
         * Refresh all rastreios
         */
        vm.refreshAll = function() {
            vm.rastreios = [];
            vm.loading = true;

            Restangular.one('rastreios/refresh_all').customPUT().then(function(rastreios) {
                vm.rastreios = rastreios;
                vm.loading = false;

                toaster.pop('success', 'Sucesso!', 'Rastreios atualizados com sucesso!');
            });
        };
    }

})();

(function() {
    'use strict';

    AuthController.$inject = ["$auth", "$http", "$state", "$rootScope", "focus", "envService"];
    angular
        .module('MeuTucano')
        .controller('AuthController', AuthController);

    function AuthController($auth, $http, $state, $rootScope, focus, envService) {
        var vm = this;

        vm.username = localStorage.getItem('lastUser');
        if (vm.username) {
            focus('password');
        } else {
            focus('username');
        }

        /**
         * Login
         */
        vm.login = function() {
            vm.loading = true;

            localStorage.setItem('lastUser', vm.username);
            var credentials = {
                username: vm.username,
                password: vm.password
            };

            $auth.login(credentials).then(function() {
                return $http.get(envService.read('apiUrl') + '/authenticate/user');
            }).then(function(response) {
                vm.loading = false;
                var user = JSON.stringify(response.data.user);

                localStorage.setItem('user', user);
                $rootScope.authenticated = true;

                $rootScope.currentUser = response.data.user;
                $state.go('app.dashboard');
            });
        };
    }

})();
(function() {
    'use strict';

    ClienteListController.$inject = ["Cliente", "Filter", "TableHeader"];
    angular
        .module('MeuTucano')
        .controller('ClienteListController', ClienteListController);

    function ClienteListController(Cliente, Filter, TableHeader) {
        var vm = this; 

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('clientes', vm, {
            'clientes.nome':       'LIKE',
            'clientes.taxvat':     'LIKE'
        });
 
        /**
         * Cabeçalho da tabela
         * @type {TableHeader} 
         */
        vm.tableHeader = TableHeader.init('clientes', vm);

        vm.load = function() {
            vm.loading = true; 
 
            Cliente.getList({
                fields:   ['clientes.*'],
                orderBy:  'clientes.created_at',
                order:    'DESC',
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false; 
            });
        };
        vm.load();
    }

})();
(function() {
    'use strict';

    FaturamentoController.$inject = ["$rootScope", "Restangular", "toaster"];
    angular
        .module('MeuTucano')
        .controller('FaturamentoController', FaturamentoController);

    function FaturamentoController($rootScope, Restangular, toaster) {
        var vm = this;

        vm.notas = [];
        vm.codigo = {
            servico: '0'
        };
        vm.loading = false;
        vm.generating = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });

        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Load notas
         */
        vm.load = function() {
            vm.notas = [];
            vm.loading = true;

            Restangular.all('notas/faturamento').getList().then(function(notas) {
                vm.notas = notas;
                vm.loading = false;
            });
        };
        vm.load();

        /**
         * Generate rastreio
         */
        vm.generateCode = function() {
            vm.codigo.rastreio = 'Gerando...';

            Restangular.one("codigos/gerar", vm.codigo.servico).customGET().then(function(response) {
                vm.codigo.rastreio = response.codigo;

                if (response.hasOwnProperty('error')) {
                    vm.codigo.rastreio = 'Códigos esgotados!'; 
                    toaster.pop('error', 'Erro', response.error);
                }

                if (response.hasOwnProperty('msg')) {
                    toaster.pop('warning', 'Atenção', response.msg);
                }
                vm.codigo.mensagem = response.msg;
            });
        };

        /**
         * Faturar pedido
         */
        vm.faturar = function(pedido_id) {
            Restangular.one("notas/faturar", pedido_id).customGET().then(function(response) {
                toaster.pop('success', 'Sucesso!', 'Pedido faturado com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    TemplatemlController.$inject = ["Restangular"];
    angular
        .module('MeuTucano')
        .controller('TemplatemlController', TemplatemlController);

    function TemplatemlController(Restangular) {
        var vm = this;

        /**
         * Generate template
         */
        vm.generateTemplate = function() {
            console.log(vm.url);

            Restangular.one("templateml/gerar").customGET("", {
              url: vm.url
            }).then(function(response) {
                vm.template = response.template;
            });
        };
    }

})();
(function() {
    'use strict';

    MenuController.$inject = ["$state"];
    angular
        .module('MeuTucano')
        .controller('MenuController', MenuController);

    function MenuController($state) {
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
                    { title: 'Linhas', icon: 'fa-list-alt' },
                    { title: 'Marcas', icon: 'fa-list-alt' },
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
                        sref: $state.href('app.atendimento.rastreio')
                    },
                    {
                        title: 'PI\'s pendentes' ,
                        icon: 'fa-warning',
                        sref: $state.href('app.atendimento.pis')
                    },
                    {
                        title: 'Devoluções pendentes',
                        icon: 'fa-undo',
                        sref: $state.href('app.atendimento.devolucoes')
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
    }

})();

(function() {
    'use strict';

    SearchController.$inject = ["Restangular", "$rootScope"];
    angular
        .module('MeuTucano')
        .controller('SearchController', SearchController)
        .filter('highlight', ["$sce", function($sce) {
            return function(text, phrase) {
                if (phrase) text = String(text).replace(new RegExp('('+phrase+')', 'gi'),
                    '<span class="underline">$1</span>');

                return $sce.trustAsHtml(text);
            };
        }]);

    function SearchController(Restangular, $rootScope) {
        var vm = this;

        vm.search = '';
        vm.resultadoBusca = {};
        vm.buscaLoading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.buscaLoading = true;
        });

        $rootScope.$on('stop-loading', function() {
            vm.buscaLoading = false;
        });

        /**
         * Close search overlay
         */
        vm.close = function() {
            $rootScope.$broadcast("closeSearch");
        };

        /**
         * Load search results
         */
        vm.load = function() {
            if (vm.search.length <= 3) {
                vm.resultadoBusca = {};
            } else {
                vm.buscaLoading = true;

                Restangular.all("search").customGET("", {search: vm.search}).then(function(busca) {
                    vm.buscaLoading = false;
                    vm.resultadoBusca = busca;
                });
            }
        };
    }

})();
(function() {
    'use strict';

    UploadController.$inject = ["Upload", "toaster", "envService", "$rootScope"];
    angular
        .module('MeuTucano')
        .controller('UploadController', UploadController);

    function UploadController(Upload, toaster, envService, $rootScope) {
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
    }

})();
(function() {
    'use strict'; 

    PedidoComentarioController.$inject = ["$rootScope", "$stateParams", "Restangular", "toaster", "ngDialog"];
    angular
        .module('MeuTucano')
        .controller('PedidoComentarioController', PedidoComentarioController);

    function PedidoComentarioController($rootScope, $stateParams, Restangular, toaster, ngDialog) {
        var vm = this;
 
        vm.comentarios = [];
        vm.comentario = null;
        vm.pedido_id = $stateParams.id;
        vm.loading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });
 
        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Load comentario
         */
        vm.load = function() {
            vm.loading = true;

            Restangular.all('comentarios').customGET(vm.pedido_id).then(function(comentarios) {
                vm.loading = false;
                vm.comentarios = comentarios;
            });
        };

        vm.load();

        /**
         * Save comentario
         */
        vm.save = function(pedido) {
            vm.loading = true;

            Restangular.one('comentarios').customPOST({
                    'pedido_id': pedido,
                    'comentario': vm.comentario
                }).then(function() {

                vm.loading = false;
                vm.comentario = null;
                vm.formComentario.$setPristine();
                vm.load();
                toaster.pop('success', 'Sucesso!', 'Comentário cadastrado com sucesso!');
            });
        };

        /**
         * Destroy comentário
         */
        vm.destroy = function(comentario) {
            vm.loading = true;

            ngDialog.openConfirm({ 
                template: '' + 
                '<p><i class="fa fa-exclamation-triangle"></i>&nbsp; Tem certeza que deseja excluir o comentário?</p>' + 
                '<div class="ngdialog-buttons">' + 
                '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Não</button>' +
                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Sim</button>' +
                '</div>',
                plain: true
            }).then(function() {
                Restangular.one('comentarios', comentario).customDELETE().then(function() {
                    vm.loading = false;
                    vm.comentario = null;
                    vm.load();
                    toaster.pop('info', 'Sucesso!', 'Comentário excluído com sucesso!');
                });
            });
        };
    }
})();
(function() {
    'use strict';

    PedidoDetalheController.$inject = ["$rootScope", "$stateParams", "Restangular", "Pedido"];
    angular
        .module('MeuTucano')
        .controller('PedidoDetalheController', PedidoDetalheController);

    function PedidoDetalheController($rootScope, $stateParams, Restangular, Pedido) {
        var vm = this;
  
        vm.pedido_id = $stateParams.id;
        vm.pedido    = {}; 
        vm.loading   = false;


        vm.load = function() {
            vm.pedido  = {}; 
            vm.loading = true;

            Pedido.get(vm.pedido_id).then(function(pedido) {
                vm.pedido  = pedido;
                vm.loading = false;
            });
        };
        vm.load();

        /**
         * Alterar status pedido
         */
        vm.changeStatus = function(status) {
            vm.loading = true;

            Restangular.one('pedidos/status', vm.pedido.id).customPUT({
                'status': status
            }).then(function(pedido) {
                vm.pedido = pedido;
                vm.loading = false; 
                toaster.pop('success', 'Sucesso!', 'Status do pedido alterado com sucesso!');
            });
        };

        /**
         * Priorizar pedido
         */
        vm.prioritize = function() {
            vm.loading = true;

            Restangular.one('pedidos/prioridade', vm.pedido.id).customPUT({
                'priorizado': true
            }).then(function(pedido) {
                vm.pedido = pedido;
                vm.loading = false; 
                toaster.pop('success', 'Sucesso!', 'Pedido priorizado com sucesso!');
            });
        };

        /**
         * Remover prioridade pedido
         */
        vm.unprioritize = function() {
            vm.loading = true;

            Restangular.one('pedidos/prioridade', vm.pedido.id).customPUT({
                'priorizado': false
            }).then(function(pedido) {
                vm.pedido = pedido;
                vm.loading = false; 
                toaster.pop('info', 'Sucesso!', 'Prioridade removida com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    PedidoListController.$inject = ["Pedido", "Filter", "TableHeader"];
    angular
        .module('MeuTucano')
        .controller('PedidoListController', PedidoListController);

    function PedidoListController(Pedido, Filter, TableHeader) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('pedidos', vm, {
            'pedidos.codigo_marketplace': 'LIKE',
            'clientes.nome':              'LIKE'
        });
 
        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('pedidos', vm);

        vm.load = function() {
            vm.loading = true; 
 
            Pedido.getList({
                fields:   ['pedidos.*'],
                orderBy:  'pedidos.created_at',
                order:    'DESC',
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page, 
                join: [
                    {
                        table:       'clientes',
                        onTable:     'clientes.id',
                        operator:    '=',
                        targetTable: 'pedidos.cliente_id'
                    },
                    {
                        table:       'pedido_notas',
                        onTable:     'pedido_notas.pedido_id',
                        operator:    '=',
                        targetTable: 'pedidos.id'
                    }
                ]
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false; 
            });
        };
        vm.load();

        /**
         * Retorna a classe de status do pedido 
         * 
         * @param  {Pedido} pedido 
         * @return {string}        
         */
        vm.parseStatusClass = function(pedido) {
            switch (pedido.status) {
                case 1:
                    return 'info';
                case 2:
                    return 'warning';
                case 3:
                    return 'success';
                case 4:
                case 5:
                    return 'danger';
            }
        };
    }

})();
(function() {
    'use strict';

    SenhaFormController.$inject = ["Senha", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('SenhaFormController', SenhaFormController);

    function SenhaFormController(Senha, $scope, toaster) {
        var vm = this;

        vm.senha = angular.copy($scope.ngDialogData.senha);

        /**
         * Save the observation
         */
        vm.save = function() {
            Senha.save(vm.senha, vm.senha.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Senha salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();
(function() {
    'use strict';

    SenhaListController.$inject = ["Senha", "TableHeader", "$stateParams", "Restangular", "ngDialog", "toaster"];
    angular
        .module('MeuTucano')
        .controller('SenhaListController', SenhaListController);

    function SenhaListController(Senha, TableHeader, $stateParams, Restangular, ngDialog, toaster) {
        var vm = this;

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('senhas', vm);

        vm.load = function() {
            vm.loading = true;
 
            Senha.fromUser($stateParams.id, {
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page, 
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false; 
            });
        };
        vm.load();

        /**
         * Abre o formulário de senha
         * 
         * @return {void} 
         */
        vm.openForm = function(senha) {
            ngDialog.open({
                template: 'views/senha/form.html',
                controller: 'SenhaFormController',
                controllerAs: 'SenhaForm', 
                data: {
                    senha: senha || { usuario_id: $stateParams.id }
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };

        /**
         * Remove a senha
         * 
         * @param  {int} senha 
         * @return {void}       
         */
        vm.destroy = function(id) {
            Senha.delete(id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Senha deletada com sucesso!');
                vm.load();
            });
        };
    }

})();
(function() {
    'use strict';

    UsuarioFormController.$inject = ["Usuario", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('UsuarioFormController', UsuarioFormController);

    function UsuarioFormController(Usuario, $rootScope, $scope, toaster) {
        var vm = this;

        vm.usuario = angular.copy($scope.ngDialogData.usuario);

        // Apenas para edição
        vm.usuario.novasRoles = [];
        if (vm.usuario.hasOwnProperty('roles')) {
            angular.forEach(vm.usuario.roles, function(role) {
                vm.usuario.novasRoles[role.id] = role.id;
            });
        }

        /**
         * Salva o usuário
         * 
         * @return {void} 
         */
        vm.save = function() {
            Usuario.save(vm.usuario, vm.usuario.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Usuário salvo com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();
(function() {
    'use strict';

    UsuarioListController.$inject = ["Usuario", "TableHeader", "ngDialog", "toaster"];
    angular 
        .module('MeuTucano')
        .controller('UsuarioListController', UsuarioListController);

    function UsuarioListController(Usuario, TableHeader, ngDialog, toaster) {
        var vm = this;

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('usuarios', vm);

        vm.load = function() {
            vm.loading = true;

            Usuario.getList({
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
            });
        };
        vm.load();

        /**
         * Abre o formulário do usuário
         * 
         * @return {void} 
         */
        vm.openForm = function(usuario) {
            ngDialog.open({
                template: 'views/usuario/form.html',
                controller: 'UsuarioFormController',
                controllerAs: 'UsuarioForm',
                data: {
                    usuario: usuario || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };

        /**
         * Remove o usuário
         * 
         * @param  {int}  id 
         * @return {void}    
         */
        vm.destroy = function(id) {
            Usuario.delete(id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Usuário deletado com sucesso!');
                vm.load();
            });
        };
    }

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9EZXZvbHVjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9FZGl0YXJDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRW1haWxDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vTG9naXN0aWNhQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL09ic2VydmFjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlMaXN0Q29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL1Jhc3RyZWlvQ29udHJvbGxlci5qcyIsIkF1dGgvQXV0aENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0NsaWVudGVMaXN0Q29udHJvbGxlci5qcyIsIkZhdHVyYW1lbnRvL0ZhdHVyYW1lbnRvQ29udHJvbGxlci5qcyIsIk1hcmtldGluZy9UZW1wbGF0ZW1sQ29udHJvbGxlci5qcyIsIlBhcnRpYWxzL01lbnVDb250cm9sbGVyLmpzIiwiUGFydGlhbHMvU2VhcmNoQ29udHJvbGxlci5qcyIsIlBhcnRpYWxzL1VwbG9hZENvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvTGlzdENvbnRyb2xsZXIuanMiLCJTZW5oYS9TZW5oYUZvcm1Db250cm9sbGVyLmpzIiwiU2VuaGEvU2VuaGFMaXN0Q29udHJvbGxlci5qcyIsIlVzdWFyaW8vVXN1YXJpb0Zvcm1Db250cm9sbGVyLmpzIiwiVXN1YXJpby9Vc3VhcmlvTGlzdENvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsaUJBQUE7O0lBRUEsU0FBQSxjQUFBLE9BQUEsUUFBQSxZQUFBLE9BQUEsWUFBQSxTQUFBLHNCQUFBLFVBQUEsYUFBQSxXQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxhQUFBO1FBQ0EsR0FBQSxPQUFBLFdBQUE7UUFDQSxHQUFBLFFBQUE7UUFDQSxHQUFBLGVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxlQUFBOzs7UUFHQSxHQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsZUFBQTs7WUFFQSxZQUFBLElBQUEsZUFBQSxZQUFBLEtBQUEsU0FBQSxPQUFBO2dCQUNBLEdBQUEsUUFBQTtnQkFDQSxHQUFBLGVBQUE7OztRQUdBLEdBQUE7Ozs7O1FBS0EsVUFBQSxXQUFBO1lBQ0EsR0FBQTtXQUNBOzs7OztRQUtBLEdBQUEsYUFBQSxXQUFBO1lBQ0EsR0FBQSxhQUFBO1lBQ0EsTUFBQTs7Ozs7O1FBTUEsV0FBQSxJQUFBLGVBQUEsVUFBQTtZQUNBLEdBQUEsYUFBQTs7Ozs7O1FBTUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxNQUFBLFNBQUEsS0FBQSxXQUFBO2dCQUNBLGFBQUEsV0FBQTtnQkFDQSxXQUFBLGdCQUFBO2dCQUNBLFdBQUEsY0FBQTs7Z0JBRUEsT0FBQSxHQUFBOzs7Ozs7OztRQVFBLEdBQUEsV0FBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLE9BQUE7Z0JBQ0EsT0FBQSxhQUFBLFFBQUE7OztZQUdBLFFBQUEsS0FBQSxXQUFBLEtBQUEsWUFBQSxnQkFBQSxZQUFBLE1BQUEscUJBQUEsT0FBQTs7Ozs7OztRQU9BLEdBQUEsYUFBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLE9BQUE7Z0JBQ0EsT0FBQSxhQUFBLFFBQUE7OztZQUdBLFFBQUEsS0FBQSxXQUFBLEtBQUEsWUFBQSxrQkFBQSxZQUFBLE1BQUEscUJBQUEsT0FBQTs7Ozs7Ozs7UUFRQSxHQUFBLGdCQUFBLFNBQUEsYUFBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLHlCQUFBLGNBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7O1FBT0EsR0FBQSxRQUFBLFNBQUEsV0FBQSxPQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxXQUFBO29CQUNBLE9BQUE7Ozs7Ozs7OztRQVNBLEdBQUEsS0FBQSxTQUFBLFVBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFVBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsWUFBQSxTQUFBLFVBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFVBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsWUFBQSxTQUFBLFVBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFVBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsU0FBQSxTQUFBLFVBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFVBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsV0FBQSxTQUFBLFdBQUE7WUFDQSxZQUFBLElBQUEsV0FBQSxXQUFBLFNBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxHQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7O1FBUUEs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QkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsWUFBQSxRQUFBLEtBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxJQUFBLFlBQUE7Z0JBQ0EsT0FBQSxHQUFBOzs7WUFHQSxZQUFBLElBQUEsZUFBQSxHQUFBLFdBQUEsV0FBQSxXQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7O0FDeEJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsYUFBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTs7UUFFQSxJQUFBLEdBQUEsU0FBQSxXQUFBO1lBQ0EsR0FBQSxZQUFBLEdBQUEsU0FBQTs7WUFFQSxJQUFBLEdBQUEsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTttQkFDQTtnQkFDQSxHQUFBLHlCQUFBO2dCQUNBLEdBQUEsVUFBQSxlQUFBLEVBQUEsT0FBQSxHQUFBLFNBQUE7Z0JBQ0EsUUFBQSxJQUFBLEdBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxtQkFBQSxHQUFBLFNBQUEsSUFBQSxVQUFBLEdBQUEsV0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDbENBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHdCQUFBOztJQUVBLFNBQUEscUJBQUEsYUFBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGFBQUEsT0FBQSxhQUFBLFNBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxZQUFBLElBQUEsYUFBQSxPQUFBLGFBQUEsU0FBQSxJQUFBLFVBQUEsQ0FBQSxZQUFBLEdBQUEsYUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDbkJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGdCQUFBOztJQUVBLFNBQUEsYUFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBLFNBQUEsc0JBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFdBQUE7O1FBRUEsSUFBQSxHQUFBLFNBQUEsSUFBQTtZQUNBLEdBQUEsS0FBQSxHQUFBLFNBQUE7O1lBRUEsSUFBQSxHQUFBLEdBQUEsUUFBQTtnQkFDQSxHQUFBLFdBQUE7bUJBQ0E7Z0JBQ0EsR0FBQSxrQkFBQTtnQkFDQSxHQUFBLEdBQUEsZUFBQSxFQUFBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLEdBQUEsR0FBQSxlQUFBOztlQUVBO1lBQ0EsR0FBQSxLQUFBO2dCQUNBLGVBQUEsR0FBQSxTQUFBOzs7Ozs7O1FBT0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxZQUFBLElBQUEsWUFBQSxHQUFBLFNBQUEsSUFBQSxVQUFBLEdBQUEsSUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztRQU9BLEdBQUEsU0FBQSxXQUFBO1lBQ0EsSUFBQSxTQUFBO2dCQUNBLFVBQUEsR0FBQSxTQUFBO2dCQUNBLE1BQUEsR0FBQSxTQUFBLE9BQUEsUUFBQTtnQkFDQSxLQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsVUFBQSxHQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBLFFBQUEsR0FBQSxTQUFBLE9B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QSxPQUFBLFdBQUE7b0JBQ0EsUUFBQSxJQUFBLFNBQUEsUUFBQSxTQUFBOzs7Z0JBR0EsSUFBQSxTQUFBLGVBQUEsUUFBQTtvQkFDQSxRQUFBLElBQUEsV0FBQSxXQUFBLFNBQUE7O2dCQUVBLEdBQUEsT0FBQSxXQUFBLFNBQUE7Ozs7Ozs7UUFPQSxHQUFBLFVBQUEsU0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLGlCQUFBLFdBQUEsWUFBQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNyRUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxhQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztRQUtBLEdBQUEsbUJBQUEsV0FBQTtZQUNBLFFBQUEsSUFBQSxHQUFBOztZQUVBLFlBQUEsSUFBQSxvQkFBQSxVQUFBLElBQUE7Y0FDQSxLQUFBLEdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFdBQUEsU0FBQTs7Ozs7O0FDbkJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGtCQUFBOztJQUVBLFNBQUEsZUFBQSxRQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7O1FBT0EsR0FBQSxVQUFBLFNBQUEsTUFBQTtZQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsUUFBQTtvQkFDQSxLQUFBLFVBQUE7OztZQUdBLEtBQUEsVUFBQSxDQUFBLEtBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtZQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsUUFBQTtvQkFDQSxLQUFBLFVBQUE7OztZQUdBLElBQUEsVUFBQSxDQUFBLElBQUE7Ozs7Ozs7UUFPQSxHQUFBLFFBQUE7WUFDQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUEsT0FBQSxLQUFBO2dCQUNBLE1BQUE7O1lBRUE7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBLE9BQUEsS0FBQTtnQkFDQSxNQUFBOztZQUVBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQSxPQUFBLEtBQUE7Z0JBQ0EsTUFBQTs7WUFFQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxFQUFBLE9BQUEsWUFBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLFVBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsZUFBQSxNQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxFQUFBLE9BQUEsV0FBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxTQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLFdBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsZ0JBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsdUJBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTs7O1lBR0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLDBCQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7OztZQUdBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLENBQUEsU0FBQTtnQkFDQSxLQUFBO29CQUNBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7Ozs7WUFJQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxDQUFBLE9BQUEsZ0JBQUEsTUFBQTtvQkFDQSxDQUFBLE9BQUEsZUFBQSxNQUFBLGlCQUFBLE1BQUEsT0FBQSxLQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JB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QUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLFVBQUEsTUFBQSxHQUFBOzs7Ozs7Ozs7O1FBVUEsR0FBQSxVQUFBLFNBQUEsSUFBQTtZQUNBLFFBQUEsT0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLEdBQUE7Ozs7O0tBS0EiLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuIFxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgQXBwQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRyb290U2NvcGUsIGZvY3VzLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplciwgbmdEaWFsb2csIFJlc3Rhbmd1bGFyLCAkaW50ZXJ2YWwsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZWFyY2hPcGVuID0gZmFsc2U7XG4gICAgICAgIHZtLnVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xuICAgICAgICB2bS5tZXRhcyA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkTWV0YSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZtLmxvYWRNZXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21ldGFzL2F0dWFsJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihtZXRhcykge1xuICAgICAgICAgICAgICAgIHZtLm1ldGFzID0gbWV0YXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZE1ldGEoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGltZW91dCBtZXRhc1xuICAgICAgICAgKi9cbiAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgfSwgNjAwMDApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5zZWFyY2hPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvY3VzKCdzZWFyY2hJbnB1dCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbG9zZSBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgJHJvb3RTY29wZS4kb24oXCJjbG9zZVNlYXJjaFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nb3V0XG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBYTUxcbiAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucHJpbnRYTUwgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy94bWwvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAneG1sJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIERBTkZFXG4gICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RGFuZmUgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy9kYW5mZS8nICsgcGVkaWRvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdkYW5mZScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBEQU5GRVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RXRpcXVldGEgPSBmdW5jdGlvbihyYXN0cmVpb19pZCkge1xuICAgICAgICAgICAgdmFyIGF1dGggPSB7XG4gICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3Jhc3RyZWlvcy9ldGlxdWV0YS8nICsgcmFzdHJlaW9faWQgKyAnPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSwgJ2V0aXF1ZXRhJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudmlhciBub3RhIHBvciBlLW1haWxcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5lbWFpbCA9IGZ1bmN0aW9uKHBlZGlkb19pZCwgZW1haWwpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZW1haWwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFbWFpbENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0VtYWlsJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlZGlkb19pZDogcGVkaWRvX2lkLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyaXIgUElcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5waSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL3BpLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGlDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdQaScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV2b2x1w6fDo29cbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9kZXZvbHVjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZXZvbHVjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdEZXZvbHVjYW8nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ8Otc3RpY2EgcmV2ZXJzYVxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2lzdGljYSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2xvZ2lzdGljYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2lzdGljYUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0xvZ2lzdGljYScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdGFyIHJhc3RyZWlvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZWRpdGFyID0gZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZWRpdGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFZGl0YXInLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbmNlbGEgbm90YVxuICAgICAgICAgKiBAcGFyYW0gcGVkaWRvX2lkXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jYW5jZWxhciA9IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zJywgcGVkaWRvX2lkKS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZGVsZXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT2JzZXJ2YcOnw6NvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL29ic2VydmFjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ09ic2VydmFjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdPYnNlcnZhY2FvJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdJY21zQ29udHJvbGxlcicsIEljbXNDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEljbXNDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXJhIHJlbGF0w7NyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlUmVsYXRvcmlvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvcmVsYXRvcmlvcy9pY21zPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rldm9sdWNhb0NvbnRyb2xsZXInLCBEZXZvbHVjYW9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIERldm9sdWNhb0NvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSB7fTtcblxuICAgICAgICB2bS5mdWxsU2VuZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh2bS5yYXN0cmVpby5kZXZvbHVjYW8pIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHZtLnJhc3RyZWlvLmRldm9sdWNhbztcbiAgICAgICAgICAgIHZtLmZ1bGxTZW5kID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXMsXG4gICAgICAgICAgICAgICAgcmFzdHJlaW9fcmVmOiB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9LFxuICAgICAgICAgICAgICAgIHBhZ29fY2xpZW50ZTogJzAnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2Rldm9sdWNvZXMvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQodm0uZGV2b2x1Y2FvKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0Rldm9sdcOnw6NvIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXInLCBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpb3MgPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdkZXZvbHVjb2VzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRhckNvbnRyb2xsZXInLCBFZGl0YXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVkaXRhckNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5jZXAgICAgICA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jZXApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZm9FZGl0ID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBkYXRhX2VudmlvOiB2bS5yYXN0cmVpby5kYXRhX2VudmlvX3JlYWRhYmxlLFxuICAgICAgICAgICAgICAgIHByYXpvOiB2bS5yYXN0cmVpby5wcmF6byxcbiAgICAgICAgICAgICAgICBjZXA6IHZtLmNlcCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHZtLnJhc3RyZWlvLnN0YXR1c1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyYXN0cmVpb3MvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQoaW5mb0VkaXQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGVkaXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRW1haWxDb250cm9sbGVyJywgRW1haWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVtYWlsQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucGVkaWRvX2lkID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucGVkaWRvX2lkKTtcbiAgICAgICAgdm0uZW1haWwgICAgID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuZW1haWwpO1xuIFxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZCBlLW1haWxcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmZvRW1haWwgPSB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ25vdGFzL2VtYWlsJywgdm0ucGVkaWRvX2lkKS5jdXN0b21QT1NUKGluZm9FbWFpbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdFLW1haWwgZW52aWFkbyBjb20gc3VjZXNzbyBhbyBjbGllbnRlIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2lzdGljYUNvbnRyb2xsZXInLCBMb2dpc3RpY2FDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExvZ2lzdGljYUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5sb2dpc3RpY2EgPSB7fTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ubG9naXN0aWNhKSB7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSB2bS5yYXN0cmVpby5sb2dpc3RpY2E7XG5cbiAgICAgICAgICAgIGlmICh2bS5sb2dpc3RpY2EuYWNhbykgeyAvLyBGb2kgY2FkYXN0cmFkbyBvIGPDs2RpZ28gZGUgcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICAgICAgICAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLmxvZ2lzdGljYS5yYXN0cmVpb19yZWYgPSB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmxvZ2lzdGljYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbG9naXN0aWNhcy9lZGl0Jywgdm0ucmFzdHJlaW8uaWQpLmN1c3RvbVBVVCh2bS5sb2dpc3RpY2EpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTG9nw61zdGljYSByZXZlcnNhIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignT2JzZXJ2YWNhb0NvbnRyb2xsZXInLCBPYnNlcnZhY2FvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBPYnNlcnZhY2FvQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8ub2JzZXJ2YWNhbztcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmFzdHJlaW9zJywgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHtvYnNlcnZhY2FvOiB2bS5vYnNlcnZhY2FvfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdPYnNlcnZhw6fDo28gc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpQ29udHJvbGxlcicsIFBpQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ucGkpIHtcbiAgICAgICAgICAgIHZtLnBpID0gdm0ucmFzdHJlaW8ucGk7XG5cbiAgICAgICAgICAgIGlmICh2bS5waS5zdGF0dXMpIHsgLy8gRm9pIGVudmlhZG8gYSByZXNwb3N0YSBkb3MgY29ycmVpb3NcbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICA9IHRydWU7XG4gICAgICAgICAgICAgICAgdm0ucGkucmFzdHJlaW9fcmVmID0geyB2YWxvcjogdm0ucmFzdHJlaW8udmFsb3IgfTtcbiAgICAgICAgICAgICAgICB2bS5waS5wYWdvX2NsaWVudGUgPSAnMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5waSA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGlzL2VkaXQnLCB2bS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHZtLnBpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBkZSBpbmZvcm1hw6fDo28gYWx0ZXJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBQSVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblBpID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5mb1BpID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBub21lOiB2bS5yYXN0cmVpby5wZWRpZG8uY2xpZW50ZS5ub21lLFxuICAgICAgICAgICAgICAgIGNlcDogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmNlcCxcbiAgICAgICAgICAgICAgICBlbmRlcmVjbzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLnJ1YSxcbiAgICAgICAgICAgICAgICBudW1lcm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5udW1lcm8sXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudG86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jb21wbGVtZW50byxcbiAgICAgICAgICAgICAgICBiYWlycm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5iYWlycm8sXG4gICAgICAgICAgICAgICAgZGF0YTogdm0ucmFzdHJlaW8uZGF0YV9lbnZpb19yZWFkYWJsZSxcbiAgICAgICAgICAgICAgICB0aXBvOiB2bS5yYXN0cmVpby5zZXJ2aWNvLFxuICAgICAgICAgICAgICAgIHN0YXR1czogKHZtLnJhc3RyZWlvLnN0YXR1cyA9PSAzKSA/ICdlJyA6ICdhJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Mi5jb3JyZWlvcy5jb20uYnIvc2lzdGVtYXMvZmFsZWNvbW9zY29ycmVpb3MvPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihpbmZvUGkpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpTGlzdENvbnRyb2xsZXInLCBQaUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBpTGlzdENvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncGlzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Jhc3RyZWlvQ29udHJvbGxlcicsIFJhc3RyZWlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBSYXN0cmVpb0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmFzdHJlaW9zJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZnJlc2ggYWxsIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmVmcmVzaEFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyYXN0cmVpb3MvcmVmcmVzaF9hbGwnKS5jdXN0b21QVVQoKS50aGVuKGZ1bmN0aW9uKHJhc3RyZWlvcykge1xuICAgICAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IHJhc3RyZWlvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdSYXN0cmVpb3MgYXR1YWxpemFkb3MgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBBdXRoQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBdXRoQ29udHJvbGxlcigkYXV0aCwgJGh0dHAsICRzdGF0ZSwgJHJvb3RTY29wZSwgZm9jdXMsIGVudlNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYXN0VXNlcicpO1xuICAgICAgICBpZiAodm0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIGZvY3VzKCdwYXNzd29yZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9jdXMoJ3VzZXJuYW1lJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9naW5cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RVc2VyJywgdm0udXNlcm5hbWUpO1xuICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB2bS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvYXV0aGVudGljYXRlL3VzZXInKTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnVzZXIpO1xuXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlcjtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQ2xpZW50ZUxpc3RDb250cm9sbGVyJywgQ2xpZW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIENsaWVudGVMaXN0Q29udHJvbGxlcihDbGllbnRlLCBGaWx0ZXIsIFRhYmxlSGVhZGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7IFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ2NsaWVudGVzJywgdm0sIHtcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLnRheHZhdCc6ICAgICAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdjbGllbnRlcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTsgXG4gXG4gICAgICAgICAgICBDbGllbnRlLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ2NsaWVudGVzLionXSxcbiAgICAgICAgICAgICAgICBvcmRlckJ5OiAgJ2NsaWVudGVzLmNyZWF0ZWRfYXQnLFxuICAgICAgICAgICAgICAgIG9yZGVyOiAgICAnREVTQycsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZhdHVyYW1lbnRvQ29udHJvbGxlcicsIEZhdHVyYW1lbnRvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBGYXR1cmFtZW50b0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5ub3RhcyA9IFtdO1xuICAgICAgICB2bS5jb2RpZ28gPSB7XG4gICAgICAgICAgICBzZXJ2aWNvOiAnMCdcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB2bS5nZW5lcmF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgbm90YXNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLm5vdGFzID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdub3Rhcy9mYXR1cmFtZW50bycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKG5vdGFzKSB7XG4gICAgICAgICAgICAgICAgdm0ubm90YXMgPSBub3RhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZ2VuZXJhdGVDb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSAnR2VyYW5kby4uLic7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcImNvZGlnb3MvZ2VyYXJcIiwgdm0uY29kaWdvLnNlcnZpY28pLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSByZXNwb25zZS5jb2RpZ287XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ2Vycm9yJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gJ0PDs2RpZ29zIGVzZ290YWRvcyEnOyBcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ0Vycm8nLCByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KCdtc2cnKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnd2FybmluZycsICdBdGVuw6fDo28nLCByZXNwb25zZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ubWVuc2FnZW0gPSByZXNwb25zZS5tc2c7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmF0dXJhciBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZhdHVyYXIgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcIm5vdGFzL2ZhdHVyYXJcIiwgcGVkaWRvX2lkKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGZhdHVyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdUZW1wbGF0ZW1sQ29udHJvbGxlcicsIFRlbXBsYXRlbWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFRlbXBsYXRlbWxDb250cm9sbGVyKFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIHRlbXBsYXRlXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZVRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS51cmwpO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJ0ZW1wbGF0ZW1sL2dlcmFyXCIpLmN1c3RvbUdFVChcIlwiLCB7XG4gICAgICAgICAgICAgIHVybDogdm0udXJsXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGVtcGxhdGUgPSByZXNwb25zZS50ZW1wbGF0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLCBNZW51Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNZW51Q29udHJvbGxlcigkc3RhdGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBzdWJtZW51XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU3ViID0gZnVuY3Rpb24obWVudSkge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gbWVudSlcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWVudS5zdWJPcGVuID0gIW1lbnUuc3ViT3BlbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBpbmZlcmlvciBtZW51XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAqIEBwYXJhbSBzdWJcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5JbmYgPSBmdW5jdGlvbihtZW51LCBzdWIpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZW51LnN1YiwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtICE9IHN1YilcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3ViLnN1Yk9wZW4gPSAhc3ViLnN1Yk9wZW47XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlIG1lbnUgaXRlbnNcbiAgICAgICAgICogQHR5cGUgeypbXX1cbiAgICAgICAgICovXG4gICAgICAgIHZtLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGFpbmVsJyxcbiAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmRhc2hib2FyZCcpLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1kYXNoYm9hcmQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGVkaWRvcycsXG4gICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wZWRpZG9zLmluZGV4JyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWN1YmVzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NsaWVudGVzJyxcbiAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmNsaWVudGVzLmluZGV4JyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVzZXJzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1dG9zJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtZHJvcGJveCcsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdQcm9kdXRvcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTGluaGFzJywgaWNvbjogJ2ZhLWxpc3QtYWx0JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTWFyY2FzJywgaWNvbjogJ2ZhLWxpc3QtYWx0JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnQXNzaXN0w6puY2lhJywgaWNvbjogJ2ZhLXdyZW5jaCcgfSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92aW1lbnRhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtZXhjaGFuZ2UnLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRW50cmFkYScsIGljb246ICdmYS1tYWlsLXJlcGx5JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnU2HDrWRhJywgaWNvbjogJ2ZhLW1haWwtZm9yd2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0RlZmVpdG8nLCBpY29uOiAnZmEtY2hhaW4tYnJva2VuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnVHJhbnNwb3J0YWRvcmFzJywgaWNvbjogJ2ZhLXRydWNrJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRm9ybmVjZWRvcmVzJywgaWNvbjogJ2ZhLWJ1aWxkaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRm9ybWFzIGRlIHBhZ2FtZW50bycsIGljb246ICdmYS1tb25leScgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ09wZXJhw6fDo28gZmlzY2FsJywgaWNvbjogJ2ZhLXBlcmNlbnQnIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRmluYW5jZWlybycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLW1vbmV5JyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0NvbnRhcyBhIHBhZ2FyL3JlY2ViZXInLCBpY29uOiAnZmEtY3JlZGl0LWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdQbGFubyBkZSBjb250YXMnLCBpY29uOiAnZmEtbGlzdCcgfSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmFzdHJlaW9zJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJywgJ2F0ZW5kaW1lbnRvJ10sXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmFzdHJlaW9zIGltcG9ydGFudGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS10cnVjaycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmF0ZW5kaW1lbnRvLnJhc3RyZWlvJylcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQSVxcJ3MgcGVuZGVudGVzJyAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmF0ZW5kaW1lbnRvLnBpcycpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGV2b2x1w6fDtWVzIHBlbmRlbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdW5kbycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmF0ZW5kaW1lbnRvLmRldm9sdWNvZXMnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbGF0w7NyaW9zJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtcGllLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnQ2FpeGEgZGnDoXJpbycsIGljb246ICdmYS1tb25leSd9LFxuICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdJQ01TIG1lbnNhbCcsIGljb246ICdmYS1maWxlLXBkZi1vJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hZG1pbi5pY21zJyl9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdDb25maWd1cmHDp8O1ZXMnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1jb2cnLFxuICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnTWFya2V0aW5nJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtYnVsbGhvcm4nLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdUZW1wbGF0ZSBNTCcsIGljb246ICdmYS1jbGlwYm9hcmQnLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLm1hcmtldGluZy50ZW1wbGF0ZW1sJyl9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0ludGVybm8nLCBcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtZGVza3RvcCcsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGFkb3MgZGEgZW1wcmVzYScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtaW5mbydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbXBvc3RvcyBkYSBub3RhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1wZXJjZW50J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1VzdcOhcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5pbnRlcm5vLnVzdWFyaW9zLmluZGV4JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBTZWFyY2hDb250cm9sbGVyKVxuICAgICAgICAuZmlsdGVyKCdoaWdobGlnaHQnLCBmdW5jdGlvbigkc2NlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odGV4dCwgcGhyYXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBocmFzZSkgdGV4dCA9IFN0cmluZyh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoJygnK3BocmFzZSsnKScsICdnaScpLFxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ1bmRlcmxpbmVcIj4kMTwvc3Bhbj4nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBTZWFyY2hDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VhcmNoID0gJyc7XG4gICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xvc2Ugc2VhcmNoIG92ZXJsYXlcbiAgICAgICAgICovXG4gICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJjbG9zZVNlYXJjaFwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBzZWFyY2ggcmVzdWx0c1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLnNlYXJjaC5sZW5ndGggPD0gMykge1xuICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoXCJzZWFyY2hcIikuY3VzdG9tR0VUKFwiXCIsIHtzZWFyY2g6IHZtLnNlYXJjaH0pLnRoZW4oZnVuY3Rpb24oYnVzY2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0gYnVzY2E7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVcGxvYWRDb250cm9sbGVyJywgVXBsb2FkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVcGxvYWRDb250cm9sbGVyKFVwbG9hZCwgdG9hc3RlciwgZW52U2VydmljZSwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgbm90YXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGZpbGVzXG4gICAgICAgICAqL1xuICAgICAgICB2bS51cGxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIil9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnF1aXZvczogZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnc3RvcC1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1VwbG9hZCBjb25jbHXDrWRvJywgcmVzcG9uc2UuZGF0YS5tc2cpO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgXCJFcnJvIG5vIHVwbG9hZCFcIiwgXCJFcnJvIGFvIGVudmlhciBhcnF1aXZvcywgdGVudGUgbm92YW1lbnRlIVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JzsgXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcicsIFBlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIHRvYXN0ZXIsIG5nRGlhbG9nKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gXG4gICAgICAgIHZtLmNvbWVudGFyaW9zID0gW107XG4gICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICB2bS5wZWRpZG9faWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgY29tZW50YXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY29tZW50YXJpb3MnKS5jdXN0b21HRVQodm0ucGVkaWRvX2lkKS50aGVuKGZ1bmN0aW9uKGNvbWVudGFyaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW9zID0gY29tZW50YXJpb3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgY29tZW50YXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnY29tZW50YXJpb3MnKS5jdXN0b21QT1NUKHtcbiAgICAgICAgICAgICAgICAgICAgJ3BlZGlkb19pZCc6IHBlZGlkbyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvbWVudGFyaW8nOiB2bS5jb21lbnRhcmlvXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2bS5mb3JtQ29tZW50YXJpby4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnQ29tZW50w6FyaW8gY2FkYXN0cmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXN0cm95IGNvbWVudMOhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oY29tZW50YXJpbykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW5Db25maXJtKHsgXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICcnICsgXG4gICAgICAgICAgICAgICAgJzxwPjxpIGNsYXNzPVwiZmEgZmEtZXhjbGFtYXRpb24tdHJpYW5nbGVcIj48L2k+Jm5ic3A7IFRlbSBjZXJ0ZXphIHF1ZSBkZXNlamEgZXhjbHVpciBvIGNvbWVudMOhcmlvPzwvcD4nICsgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJuZ2RpYWxvZy1idXR0b25zXCI+JyArIFxuICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5nZGlhbG9nLWJ1dHRvbiBuZ2RpYWxvZy1idXR0b24tc2Vjb25kYXJ5XCIgbmctY2xpY2s9XCJjbG9zZVRoaXNEaWFsb2coMClcIj5Ow6NvPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmdkaWFsb2ctYnV0dG9uIG5nZGlhbG9nLWJ1dHRvbi1wcmltYXJ5XCIgbmctY2xpY2s9XCJjb25maXJtKDEpXCI+U2ltPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgcGxhaW46IHRydWVcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdjb21lbnRhcmlvcycsIGNvbWVudGFyaW8pLmN1c3RvbURFTEVURSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdm0uY29tZW50YXJpbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2luZm8nLCAnU3VjZXNzbyEnLCAnQ29tZW50w6FyaW8gZXhjbHXDrWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXInLCBQZWRpZG9EZXRhbGhlQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9EZXRhbGhlQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBQZWRpZG8pIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgXG4gICAgICAgIHZtLnBlZGlkb19pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0ucGVkaWRvICAgID0ge307IFxuICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcblxuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnBlZGlkbyAgPSB7fTsgXG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUGVkaWRvLmdldCh2bS5wZWRpZG9faWQpLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvICA9IHBlZGlkbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbHRlcmFyIHN0YXR1cyBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmNoYW5nZVN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9zdGF0dXMnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHN0YXR1c1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlOyBcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTdGF0dXMgZG8gcGVkaWRvIGFsdGVyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByaW9yaXphciBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW9yaXRpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3MvcHJpb3JpZGFkZScsIHZtLnBlZGlkby5pZCkuY3VzdG9tUFVUKHtcbiAgICAgICAgICAgICAgICAncHJpb3JpemFkbyc6IHRydWVcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTsgXG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIHByaW9yaXphZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlciBwcmlvcmlkYWRlIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0udW5wcmlvcml0aXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zL3ByaW9yaWRhZGUnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3ByaW9yaXphZG8nOiBmYWxzZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlOyBcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnaW5mbycsICdTdWNlc3NvIScsICdQcmlvcmlkYWRlIHJlbW92aWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9MaXN0Q29udHJvbGxlcicsIFBlZGlkb0xpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0xpc3RDb250cm9sbGVyKFBlZGlkbywgRmlsdGVyLCBUYWJsZUhlYWRlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3BlZGlkb3MnLCB2bSwge1xuICAgICAgICAgICAgJ3BlZGlkb3MuY29kaWdvX21hcmtldHBsYWNlJzogJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAgICAgICAgJ0xJS0UnXG4gICAgICAgIH0pO1xuIFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdwZWRpZG9zJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlOyBcbiBcbiAgICAgICAgICAgIFBlZGlkby5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9zLionXSxcbiAgICAgICAgICAgICAgICBvcmRlckJ5OiAgJ3BlZGlkb3MuY3JlYXRlZF9hdCcsXG4gICAgICAgICAgICAgICAgb3JkZXI6ICAgICdERVNDJyxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2UsIFxuICAgICAgICAgICAgICAgIGpvaW46IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGU6ICAgICAgICdjbGllbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBvblRhYmxlOiAgICAgJ2NsaWVudGVzLmlkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yOiAgICAnPScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRUYWJsZTogJ3BlZGlkb3MuY2xpZW50ZV9pZCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGU6ICAgICAgICdwZWRpZG9fbm90YXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25UYWJsZTogICAgICdwZWRpZG9fbm90YXMucGVkaWRvX2lkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yOiAgICAnPScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRUYWJsZTogJ3BlZGlkb3MuaWQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0b3JuYSBhIGNsYXNzZSBkZSBzdGF0dXMgZG8gcGVkaWRvIFxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtICB7UGVkaWRvfSBwZWRpZG8gXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgIFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucGFyc2VTdGF0dXNDbGFzcyA9IGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgc3dpdGNoIChwZWRpZG8uc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2luZm8nO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd3YXJuaW5nJztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnc3VjY2Vzcyc7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkYW5nZXInO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignU2VuaGFGb3JtQ29udHJvbGxlcicsIFNlbmhhRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gU2VuaGFGb3JtQ29udHJvbGxlcihTZW5oYSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VuaGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5nRGlhbG9nRGF0YS5zZW5oYSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBTZW5oYS5zYXZlKHZtLnNlbmhhLCB2bS5zZW5oYS5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlbmhhTGlzdENvbnRyb2xsZXInLCBTZW5oYUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFNlbmhhTGlzdENvbnRyb2xsZXIoU2VuaGEsIFRhYmxlSGVhZGVyLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3NlbmhhcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiBcbiAgICAgICAgICAgIFNlbmhhLmZyb21Vc2VyKCRzdGF0ZVBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2UsIFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkZSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuRm9ybSA9IGZ1bmN0aW9uKHNlbmhhKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL3NlbmhhL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlbmhhRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1NlbmhhRm9ybScsIFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VuaGE6IHNlbmhhIHx8IHsgdXN1YXJpb19pZDogJHN0YXRlUGFyYW1zLmlkIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtICB7aW50fSBzZW5oYSBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gICAgICAgXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIFNlbmhhLmRlbGV0ZShpZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTZW5oYSBkZWxldGFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9Gb3JtQ29udHJvbGxlcicsIFVzdWFyaW9Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvRm9ybUNvbnRyb2xsZXIoVXN1YXJpbywgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXN1YXJpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnVzdWFyaW8pO1xuXG4gICAgICAgIC8vIEFwZW5hcyBwYXJhIGVkacOnw6NvXG4gICAgICAgIHZtLnVzdWFyaW8ubm92YXNSb2xlcyA9IFtdO1xuICAgICAgICBpZiAodm0udXN1YXJpby5oYXNPd25Qcm9wZXJ0eSgncm9sZXMnKSkge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnVzdWFyaW8ucm9sZXMsIGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgICAgICAgICB2bS51c3VhcmlvLm5vdmFzUm9sZXNbcm9sZS5pZF0gPSByb2xlLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBVc3VhcmlvLnNhdmUodm0udXN1YXJpbywgdm0udXN1YXJpby5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1VzdcOhcmlvIHNhbHZvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVc3VhcmlvTGlzdENvbnRyb2xsZXInLCBVc3VhcmlvTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXN1YXJpb0xpc3RDb250cm9sbGVyKFVzdWFyaW8sIFRhYmxlSGVhZGVyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3VzdWFyaW9zJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBVc3VhcmlvLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuRm9ybSA9IGZ1bmN0aW9uKHVzdWFyaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvdXN1YXJpby9mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc3VhcmlvRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1VzdWFyaW9Gb3JtJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzdWFyaW86IHVzdWFyaW8gfHwge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtICB7aW50fSAgaWQgXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9ICAgIFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBVc3VhcmlvLmRlbGV0ZShpZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdVc3XDoXJpbyBkZWxldGFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
