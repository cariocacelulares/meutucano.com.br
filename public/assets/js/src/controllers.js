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

    LinhaFormController.$inject = ["$rootScope", "$stateParams", "Restangular", "Linha", "toaster"];
    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $stateParams, Restangular, Linha, toaster) {
        var vm = this;
  
        vm.linha           = {
            id: $stateParams.id || null,
            atributos: {}
        };

        vm.load = function() {
            vm.loading = true;
 
            Linha.get(vm.linha.id).then(function(linha) {
                vm.linha   = linha;
                vm.loading = false;
            });
        };

        if (vm.linha.id) {
            vm.load();
        }

        /**
         * Adiciona um atributo
         * 
         * @return {void} 
         */
        vm.addAttribute = function() { 
            vm.linha.atributos.push(vm.novoAtributo);
            vm.novoAtributo = {};
        };

        /**
         * Remove um atributo
         * 
         * @return {void} 
         */
        vm.removeAttribute = function(index) { 
            vm.linha.atributos.splice(index, 1);
        };

        /**
         * Salva a linha
         * 
         * @return {void} 
         */
        vm.save = function() {
            Linha.save(vm.linha, vm.linha.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Linha salva com sucesso!');
            });
        };
    }
})();
(function() {
    'use strict';

    LinhaListController.$inject = ["Linha", "Filter", "TableHeader", "ngDialog"];
    angular
        .module('MeuTucano')
        .controller('LinhaListController', LinhaListController);

    function LinhaListController(Linha, Filter, TableHeader, ngDialog) {
        var vm = this;  

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('linhas', vm, {
            'linhas.titulo': 'LIKE'
        });
 
        /**
         * Cabeçalho da tabela
         * @type {TableHeader} 
         */
        vm.tableHeader = TableHeader.init('linhas', vm);

        vm.load = function() {
            vm.loading = true; 
 
            Linha.getList({
                fields:   ['linhas.*'],
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
                    { title: 'Linhas', icon: 'fa-list-alt', sref: $state.href('app.produtos.linhas.index') },
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
                        sref: $state.href('app.rastreios.importantes')
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

        vm.load = function(teste) {
            vm.loading = true; 
 
            Pedido.getList({
                fields:   ['pedidos.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
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

    RastreioImportanteListController.$inject = ["Rastreio", "Filter", "TableHeader", "ngDialog", "toaster"];
    angular
        .module('MeuTucano')
        .controller('RastreioImportanteListController', RastreioImportanteListController);

    function RastreioImportanteListController(Rastreio, Filter, TableHeader, ngDialog, toaster) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('rastreios', vm, {
            'pedidos.codigo_marketplace': 'LIKE',
            'clientes.nome':              'LIKE',
            'pedido_rastreios.rastreio':  'LIKE'
        });
 
        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('rastreios', vm);

        vm.load = function() {
            vm.loading = true;
        
            Rastreio.important({
                fields:   ['pedido_rastreios.*'],
                filter:   vm.filterList.parse(),
                page:     vm.tableHeader.pagination.page,
                per_page: vm.tableHeader.pagination.per_page
            }).then(function(response) {
                vm.tableData = response;
                vm.loading   = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdXRoL0F1dGhDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRGV2b2x1Y2FvQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL0Rldm9sdWNhb0xpc3RDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRWRpdGFyQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL0VtYWlsQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL0xvZ2lzdGljYUNvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9PYnNlcnZhY2FvQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL1BpQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL1BpTGlzdENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0NsaWVudGVMaXN0Q29udHJvbGxlci5qcyIsIkZhdHVyYW1lbnRvL0ZhdHVyYW1lbnRvQ29udHJvbGxlci5qcyIsIkxpbmhhL0xpbmhhRm9ybUNvbnRyb2xsZXIuanMiLCJMaW5oYS9MaW5oYUxpc3RDb250cm9sbGVyLmpzIiwiTWFya2V0aW5nL1RlbXBsYXRlbWxDb250cm9sbGVyLmpzIiwiUGFydGlhbHMvTWVudUNvbnRyb2xsZXIuanMiLCJQYXJ0aWFscy9TZWFyY2hDb250cm9sbGVyLmpzIiwiUGFydGlhbHMvVXBsb2FkQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9EZXRhbGhlQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9MaXN0Q29udHJvbGxlci5qcyIsIlJhc3RyZWlvL1Jhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyLmpzIiwiU2VuaGEvU2VuaGFGb3JtQ29udHJvbGxlci5qcyIsIlNlbmhhL1NlbmhhTGlzdENvbnRyb2xsZXIuanMiLCJVc3VhcmlvL1VzdWFyaW9Gb3JtQ29udHJvbGxlci5qcyIsIlVzdWFyaW8vVXN1YXJpb0xpc3RDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGlCQUFBOztJQUVBLFNBQUEsY0FBQSxPQUFBLFFBQUEsWUFBQSxPQUFBLFlBQUEsU0FBQSxzQkFBQSxVQUFBLGFBQUEsV0FBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsYUFBQTtRQUNBLEdBQUEsT0FBQSxXQUFBO1FBQ0EsR0FBQSxRQUFBO1FBQ0EsR0FBQSxlQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxlQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsZUFBQTs7O1FBR0EsR0FBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7O1lBRUEsWUFBQSxJQUFBLGVBQUEsWUFBQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFFBQUE7Z0JBQ0EsR0FBQSxlQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLFVBQUEsV0FBQTtZQUNBLEdBQUE7V0FDQTs7Ozs7UUFLQSxHQUFBLGFBQUEsV0FBQTtZQUNBLEdBQUEsYUFBQTtZQUNBLE1BQUE7Ozs7OztRQU1BLFdBQUEsSUFBQSxlQUFBLFVBQUE7WUFDQSxHQUFBLGFBQUE7Ozs7OztRQU1BLEdBQUEsU0FBQSxXQUFBO1lBQ0EsTUFBQSxTQUFBLEtBQUEsV0FBQTtnQkFDQSxhQUFBLFdBQUE7Z0JBQ0EsV0FBQSxnQkFBQTtnQkFDQSxXQUFBLGNBQUE7O2dCQUVBLE9BQUEsR0FBQTs7Ozs7Ozs7UUFRQSxHQUFBLFdBQUEsU0FBQSxXQUFBO1lBQ0EsSUFBQSxPQUFBO2dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7WUFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEsZ0JBQUEsWUFBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7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QUFBLE9BQUEsS0FBQSxVQUFBLFNBQUEsS0FBQTs7Z0JBRUEsYUFBQSxRQUFBLFFBQUE7Z0JBQ0EsV0FBQSxnQkFBQTs7Z0JBRUEsV0FBQSxjQUFBLFNBQUEsS0FBQTtnQkFDQSxPQUFBLEdBQUE7Ozs7OztBQ3ZDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBO1lBQ0EsR0FBQSxXQUFBO2VBQ0E7WUFDQSxHQUFBLFlBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Z0JBQ0EsY0FBQSxFQUFBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLGNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxtQkFBQSxHQUFBLFNBQUEsSUFBQSxVQUFBLEdBQUEsV0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDakNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDJCQUFBOztJQUVBLFNBQUEsd0JBQUEsWUFBQSxhQUFBLFVBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFlBQUE7UUFDQSxHQUFBLFVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsY0FBQSxVQUFBLEtBQUEsU0FBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7O0FDckNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLG9CQUFBOztJQUVBLFNBQUEsaUJBQUEsYUFBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBLFNBQUEsT0FBQSxTQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsSUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxTQUFBO2dCQUNBLFlBQUEsR0FBQSxTQUFBO2dCQUNBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLEtBQUEsR0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQTs7O1lBR0EsWUFBQSxJQUFBLGtCQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztBQzVCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxtQkFBQTs7SUFFQSxTQUFBLGdCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLElBQUEsWUFBQTtnQkFDQSxPQUFBLEdBQUE7OztZQUdBLFlBQUEsSUFBQSxlQUFBLEdBQUEsV0FBQSxXQUFBLFdBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBOztZQUVBLElBQUEsR0FBQSxVQUFBLE1BQUE7Z0JBQ0EsR0FBQSxXQUFBO21CQUNBO2dCQUNBLEdBQUEseUJBQUE7Z0JBQ0EsR0FBQSxVQUFBLGVBQUEsRUFBQSxPQUFBLEdBQUEsU0FBQTtnQkFDQSxRQUFBLElBQUEsR0FBQTs7Ozs7OztRQU9BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLG1CQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxXQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsYUFBQSxPQUFBLGFBQUEsU0FBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxhQUFBLE9BQUEsYUFBQSxTQUFBLElBQUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxhQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsZ0JBQUE7O0lBRUEsU0FBQSxhQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUEsU0FBQSxzQkFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTs7UUFFQSxJQUFBLEdBQUEsU0FBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLEdBQUEsU0FBQTs7WUFFQSxJQUFBLEdBQUEsR0FBQSxRQUFBO2dCQUNBLEdBQUEsV0FBQTttQkFDQTtnQkFDQSxHQUFBLGtCQUFBO2dCQUNBLEdBQUEsR0FBQSxlQUFBLEVBQUEsT0FBQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxHQUFBLGVBQUE7O2VBRUE7WUFDQSxHQUFBLEtBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxZQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7O1FBT0EsR0FBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFNBQUE7Z0JBQ0EsVUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUEsT0FBQSxRQUFBO2dCQUNBLEtBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxVQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsUUFBQSxHQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBLGFBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsUUFBQSxDQUFBLEdBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsUUFBQSxLQUFBLDZEQUFBLHFCQUFBOzs7OztBQzFEQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTs7SUFFQSxTQUFBLGlCQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7Ozs7QUNyQ0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxTQUFBLFFBQUEsYUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxhQUFBLE9BQUEsS0FBQSxZQUFBLElBQUE7WUFDQSx1QkFBQTtZQUNBLHVCQUFBOzs7Ozs7O1FBT0EsR0FBQSxjQUFBLFlBQUEsS0FBQSxZQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFFBQUEsUUFBQTtnQkFDQSxVQUFBLENBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxVQUFBO2dCQUNBLFVBQUEsR0FBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7QUN4Q0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxZQUFBLGFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFFBQUE7UUFDQSxHQUFBLFNBQUE7WUFDQSxTQUFBOztRQUVBLEdBQUEsVUFBQTtRQUNBLEdBQUEsYUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxRQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxxQkFBQSxVQUFBLEtBQUEsU0FBQSxPQUFBO2dCQUNBLEdBQUEsUUFBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7O1FBS0EsR0FBQSxlQUFBLFdBQUE7WUFDQSxHQUFBLE9BQUEsV0FBQTs7WUFFQSxZQUFBLElBQUEsaUJBQUEsR0FBQSxPQUFBLFNBQUEsWUFBQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLE9BQUEsV0FBQSxTQUFBOztnQkFFQSxJQUFBLFNBQUEsZUFBQSxVQUFBO29CQUNBLEdBQUEsT0FBQSxXQUFBO29CQUNBLFFBQUEsSUFBQSxTQUFBLFFBQUEsU0FBQTs7O2dCQUdBLElBQUEsU0FBQSxlQUFBLFFBQUE7b0JBQ0EsUUFBQSxJQUFBLFdBQUEsV0FBQSxTQUFBOztnQkFFQSxHQUFBLE9BQUEsV0FBQSxTQUFBOzs7Ozs7O1FBT0EsR0FBQSxVQUFBLFNBQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxpQkFBQSxXQUFBLFlBQUEsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDckVBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsWUFBQSxjQUFBLGFBQUEsT0FBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsa0JBQUE7WUFDQSxJQUFBLGFBQUEsTUFBQTtZQUNBLFdBQUE7OztRQUdBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE1BQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7O1FBSUEsSUFBQSxHQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxlQUFBLFdBQUE7WUFDQSxHQUFBLE1BQUEsVUFBQSxLQUFBLEdBQUE7WUFDQSxHQUFBLGVBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxrQkFBQSxTQUFBLE9BQUE7WUFDQSxHQUFBLE1BQUEsVUFBQSxPQUFBLE9BQUE7Ozs7Ozs7O1FBUUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxNQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7O0FDdERBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsT0FBQSxRQUFBLGFBQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxhQUFBLE9BQUEsS0FBQSxVQUFBLElBQUE7WUFDQSxpQkFBQTs7Ozs7OztRQU9BLEdBQUEsY0FBQSxZQUFBLEtBQUEsVUFBQTs7UUFFQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLFFBQUE7Z0JBQ0EsVUFBQSxDQUFBO2dCQUNBLFVBQUEsR0FBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7OztBQ3JDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx3QkFBQTs7SUFFQSxTQUFBLHFCQUFBLGFBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O1FBS0EsR0FBQSxtQkFBQSxXQUFBO1lBQ0EsUUFBQSxJQUFBLEdBQUE7O1lBRUEsWUFBQSxJQUFBLG9CQUFBLFVBQUEsSUFBQTtjQUNBLEtBQUEsR0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsV0FBQSxTQUFBOzs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLFFBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7Ozs7UUFPQSxHQUFBLFVBQUEsU0FBQSxNQUFBO1lBQ0EsUUFBQSxRQUFBLEdBQUEsT0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxRQUFBO29CQUNBLEtBQUEsVUFBQTs7O1lBR0EsS0FBQSxVQUFBLENBQUEsS0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxVQUFBLFNBQUEsTUFBQSxLQUFBO1lBQ0EsUUFBQSxRQUFBLEtBQUEsS0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxRQUFBO29CQUNBLEtBQUEsVUFBQTs7O1lBR0EsSUFBQSxVQUFBLENBQUEsSUFBQTs7Ozs7OztRQU9BLEdBQUEsUUFBQTtZQUNBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQSxPQUFBLEtBQUE7Z0JBQ0EsTUFBQTs7WUFFQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUEsT0FBQSxLQUFBO2dCQUNBLE1BQUE7O1lBRUE7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBLE9BQUEsS0FBQTtnQkFDQSxNQUFBOztZQUVBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxLQUFBO29CQUNBLEVBQUEsT0FBQSxZQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLFVBQUEsTUFBQSxlQUFBLE1BQUEsT0FBQSxLQUFBO29CQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLGVBQUEsTUFBQTs7O1lBR0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLFdBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsU0FBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxXQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLGdCQUFBLE1BQUE7b0JBQ0EsRUFBQSxP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QUFBLEtBQUEsVUFBQSxNQUFBLEdBQUE7Ozs7Ozs7Ozs7UUFVQSxHQUFBLFVBQUEsU0FBQSxJQUFBO1lBQ0EsTUFBQSxPQUFBLElBQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsR0FBQTs7Ozs7O0FDeERBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsU0FBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFVBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTs7O1FBR0EsR0FBQSxRQUFBLGFBQUE7UUFDQSxJQUFBLEdBQUEsUUFBQSxlQUFBLFVBQUE7WUFDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLE9BQUEsU0FBQSxNQUFBO2dCQUNBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxLQUFBOzs7Ozs7Ozs7UUFTQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFFBQUEsS0FBQSxHQUFBLFNBQUEsR0FBQSxRQUFBLE1BQUEsTUFBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTtnQkFDQSxPQUFBLGdCQUFBOzs7Ozs7QUM1QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxTQUFBLGFBQUEsVUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFlBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsUUFBQSxRQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7Ozs7UUFPQSxHQUFBLFdBQUEsU0FBQSxTQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsU0FBQSxXQUFBOztlQUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLFVBQUEsTUFBQSxHQUFBOzs7Ozs7Ozs7O1FBVUEsR0FBQSxVQUFBLFNBQUEsSUFBQTtZQUNBLFFBQUEsT0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLEdBQUE7Ozs7O0tBS0EiLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuIFxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgQXBwQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRyb290U2NvcGUsIGZvY3VzLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplciwgbmdEaWFsb2csIFJlc3Rhbmd1bGFyLCAkaW50ZXJ2YWwsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZWFyY2hPcGVuID0gZmFsc2U7XG4gICAgICAgIHZtLnVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xuICAgICAgICB2bS5tZXRhcyA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkTWV0YSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZtLmxvYWRNZXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21ldGFzL2F0dWFsJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihtZXRhcykge1xuICAgICAgICAgICAgICAgIHZtLm1ldGFzID0gbWV0YXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZE1ldGEoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGltZW91dCBtZXRhc1xuICAgICAgICAgKi9cbiAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgfSwgNjAwMDApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5zZWFyY2hPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvY3VzKCdzZWFyY2hJbnB1dCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbG9zZSBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgJHJvb3RTY29wZS4kb24oXCJjbG9zZVNlYXJjaFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nb3V0XG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBYTUxcbiAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucHJpbnRYTUwgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy94bWwvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAneG1sJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIERBTkZFXG4gICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RGFuZmUgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy9kYW5mZS8nICsgcGVkaWRvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdkYW5mZScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBEQU5GRVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RXRpcXVldGEgPSBmdW5jdGlvbihyYXN0cmVpb19pZCkge1xuICAgICAgICAgICAgdmFyIGF1dGggPSB7XG4gICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3Jhc3RyZWlvcy9ldGlxdWV0YS8nICsgcmFzdHJlaW9faWQgKyAnPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSwgJ2V0aXF1ZXRhJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudmlhciBub3RhIHBvciBlLW1haWxcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5lbWFpbCA9IGZ1bmN0aW9uKHBlZGlkb19pZCwgZW1haWwpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZW1haWwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFbWFpbENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0VtYWlsJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlZGlkb19pZDogcGVkaWRvX2lkLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyaXIgUElcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5waSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL3BpLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGlDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdQaScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV2b2x1w6fDo29cbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9kZXZvbHVjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZXZvbHVjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdEZXZvbHVjYW8nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ8Otc3RpY2EgcmV2ZXJzYVxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2lzdGljYSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2xvZ2lzdGljYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2lzdGljYUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0xvZ2lzdGljYScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdGFyIHJhc3RyZWlvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZWRpdGFyID0gZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZWRpdGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFZGl0YXInLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbmNlbGEgbm90YVxuICAgICAgICAgKiBAcGFyYW0gcGVkaWRvX2lkXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jYW5jZWxhciA9IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zJywgcGVkaWRvX2lkKS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZGVsZXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT2JzZXJ2YcOnw6NvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL29ic2VydmFjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ09ic2VydmFjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdPYnNlcnZhY2FvJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdJY21zQ29udHJvbGxlcicsIEljbXNDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEljbXNDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXJhIHJlbGF0w7NyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlUmVsYXRvcmlvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvcmVsYXRvcmlvcy9pY21zPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhDb250cm9sbGVyJywgQXV0aENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXV0aENvbnRyb2xsZXIoJGF1dGgsICRodHRwLCAkc3RhdGUsICRyb290U2NvcGUsIGZvY3VzLCBlbnZTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdFVzZXInKTtcbiAgICAgICAgaWYgKHZtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICBmb2N1cygncGFzc3dvcmQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvY3VzKCd1c2VybmFtZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ2luXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dpbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0VXNlcicsIHZtLnVzZXJuYW1lKTtcbiAgICAgICAgICAgIHZhciBjcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdm0udXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL2F1dGhlbnRpY2F0ZS91c2VyJyk7XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciB1c2VyID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZGF0YS51c2VyKTtcblxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgdXNlcik7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXI7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rldm9sdWNhb0NvbnRyb2xsZXInLCBEZXZvbHVjYW9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIERldm9sdWNhb0NvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSB7fTtcblxuICAgICAgICB2bS5mdWxsU2VuZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh2bS5yYXN0cmVpby5kZXZvbHVjYW8pIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHZtLnJhc3RyZWlvLmRldm9sdWNhbztcbiAgICAgICAgICAgIHZtLmZ1bGxTZW5kID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXMsXG4gICAgICAgICAgICAgICAgcmFzdHJlaW9fcmVmOiB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9LFxuICAgICAgICAgICAgICAgIHBhZ29fY2xpZW50ZTogJzAnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2Rldm9sdWNvZXMvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQodm0uZGV2b2x1Y2FvKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0Rldm9sdcOnw6NvIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXInLCBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpb3MgPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdkZXZvbHVjb2VzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRhckNvbnRyb2xsZXInLCBFZGl0YXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVkaXRhckNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5jZXAgICAgICA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jZXApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZm9FZGl0ID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBkYXRhX2VudmlvOiB2bS5yYXN0cmVpby5kYXRhX2VudmlvX3JlYWRhYmxlLFxuICAgICAgICAgICAgICAgIHByYXpvOiB2bS5yYXN0cmVpby5wcmF6byxcbiAgICAgICAgICAgICAgICBjZXA6IHZtLmNlcCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHZtLnJhc3RyZWlvLnN0YXR1c1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyYXN0cmVpb3MvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQoaW5mb0VkaXQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGVkaXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRW1haWxDb250cm9sbGVyJywgRW1haWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVtYWlsQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucGVkaWRvX2lkID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucGVkaWRvX2lkKTtcbiAgICAgICAgdm0uZW1haWwgICAgID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuZW1haWwpO1xuIFxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZCBlLW1haWxcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmZvRW1haWwgPSB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ25vdGFzL2VtYWlsJywgdm0ucGVkaWRvX2lkKS5jdXN0b21QT1NUKGluZm9FbWFpbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdFLW1haWwgZW52aWFkbyBjb20gc3VjZXNzbyBhbyBjbGllbnRlIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2lzdGljYUNvbnRyb2xsZXInLCBMb2dpc3RpY2FDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExvZ2lzdGljYUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5sb2dpc3RpY2EgPSB7fTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ubG9naXN0aWNhKSB7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSB2bS5yYXN0cmVpby5sb2dpc3RpY2E7XG5cbiAgICAgICAgICAgIGlmICh2bS5sb2dpc3RpY2EuYWNhbykgeyAvLyBGb2kgY2FkYXN0cmFkbyBvIGPDs2RpZ28gZGUgcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICAgICAgICAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLmxvZ2lzdGljYS5yYXN0cmVpb19yZWYgPSB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmxvZ2lzdGljYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbG9naXN0aWNhcy9lZGl0Jywgdm0ucmFzdHJlaW8uaWQpLmN1c3RvbVBVVCh2bS5sb2dpc3RpY2EpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTG9nw61zdGljYSByZXZlcnNhIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignT2JzZXJ2YWNhb0NvbnRyb2xsZXInLCBPYnNlcnZhY2FvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBPYnNlcnZhY2FvQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8ub2JzZXJ2YWNhbztcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmFzdHJlaW9zJywgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHtvYnNlcnZhY2FvOiB2bS5vYnNlcnZhY2FvfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdPYnNlcnZhw6fDo28gc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpQ29udHJvbGxlcicsIFBpQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ucGkpIHtcbiAgICAgICAgICAgIHZtLnBpID0gdm0ucmFzdHJlaW8ucGk7XG5cbiAgICAgICAgICAgIGlmICh2bS5waS5zdGF0dXMpIHsgLy8gRm9pIGVudmlhZG8gYSByZXNwb3N0YSBkb3MgY29ycmVpb3NcbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICA9IHRydWU7XG4gICAgICAgICAgICAgICAgdm0ucGkucmFzdHJlaW9fcmVmID0geyB2YWxvcjogdm0ucmFzdHJlaW8udmFsb3IgfTtcbiAgICAgICAgICAgICAgICB2bS5waS5wYWdvX2NsaWVudGUgPSAnMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5waSA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGlzL2VkaXQnLCB2bS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHZtLnBpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBkZSBpbmZvcm1hw6fDo28gYWx0ZXJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBQSVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblBpID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5mb1BpID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBub21lOiB2bS5yYXN0cmVpby5wZWRpZG8uY2xpZW50ZS5ub21lLFxuICAgICAgICAgICAgICAgIGNlcDogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmNlcCxcbiAgICAgICAgICAgICAgICBlbmRlcmVjbzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLnJ1YSxcbiAgICAgICAgICAgICAgICBudW1lcm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5udW1lcm8sXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudG86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jb21wbGVtZW50byxcbiAgICAgICAgICAgICAgICBiYWlycm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5iYWlycm8sXG4gICAgICAgICAgICAgICAgZGF0YTogdm0ucmFzdHJlaW8uZGF0YV9lbnZpb19yZWFkYWJsZSxcbiAgICAgICAgICAgICAgICB0aXBvOiB2bS5yYXN0cmVpby5zZXJ2aWNvLFxuICAgICAgICAgICAgICAgIHN0YXR1czogKHZtLnJhc3RyZWlvLnN0YXR1cyA9PSAzKSA/ICdlJyA6ICdhJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Mi5jb3JyZWlvcy5jb20uYnIvc2lzdGVtYXMvZmFsZWNvbW9zY29ycmVpb3MvPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihpbmZvUGkpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpTGlzdENvbnRyb2xsZXInLCBQaUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBpTGlzdENvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncGlzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NsaWVudGVMaXN0Q29udHJvbGxlcicsIENsaWVudGVMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBDbGllbnRlTGlzdENvbnRyb2xsZXIoQ2xpZW50ZSwgRmlsdGVyLCBUYWJsZUhlYWRlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzOyBcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdjbGllbnRlcycsIHZtLCB7XG4gICAgICAgICAgICAnY2xpZW50ZXMubm9tZSc6ICAgICAgICdMSUtFJyxcbiAgICAgICAgICAgICdjbGllbnRlcy50YXh2YXQnOiAgICAgJ0xJS0UnXG4gICAgICAgIH0pO1xuIFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgnY2xpZW50ZXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7IFxuIFxuICAgICAgICAgICAgQ2xpZW50ZS5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydjbGllbnRlcy4qJ10sXG4gICAgICAgICAgICAgICAgb3JkZXJCeTogICdjbGllbnRlcy5jcmVhdGVkX2F0JyxcbiAgICAgICAgICAgICAgICBvcmRlcjogICAgJ0RFU0MnLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGYXR1cmFtZW50b0NvbnRyb2xsZXInLCBGYXR1cmFtZW50b0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRmF0dXJhbWVudG9Db250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ubm90YXMgPSBbXTtcbiAgICAgICAgdm0uY29kaWdvID0ge1xuICAgICAgICAgICAgc2VydmljbzogJzAnXG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdm0uZ2VuZXJhdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIG5vdGFzXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5ub3RhcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbm90YXMvZmF0dXJhbWVudG8nKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihub3Rhcykge1xuICAgICAgICAgICAgICAgIHZtLm5vdGFzID0gbm90YXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlQ29kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gJ0dlcmFuZG8uLi4nO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJjb2RpZ29zL2dlcmFyXCIsIHZtLmNvZGlnby5zZXJ2aWNvKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gcmVzcG9uc2UuY29kaWdvO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KCdlcnJvcicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNvZGlnby5yYXN0cmVpbyA9ICdDw7NkaWdvcyBlc2dvdGFkb3MhJzsgXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICdFcnJvJywgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnbXNnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3dhcm5pbmcnLCAnQXRlbsOnw6NvJywgcmVzcG9uc2UubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uY29kaWdvLm1lbnNhZ2VtID0gcmVzcG9uc2UubXNnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZhdHVyYXIgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5mYXR1cmFyID0gZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJub3Rhcy9mYXR1cmFyXCIsIHBlZGlkb19pZCkuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBmYXR1cmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTGluaGFGb3JtQ29udHJvbGxlcicsIExpbmhhRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTGluaGFGb3JtQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBMaW5oYSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICBcbiAgICAgICAgdm0ubGluaGEgICAgICAgICAgID0ge1xuICAgICAgICAgICAgaWQ6ICRzdGF0ZVBhcmFtcy5pZCB8fCBudWxsLFxuICAgICAgICAgICAgYXRyaWJ1dG9zOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuIFxuICAgICAgICAgICAgTGluaGEuZ2V0KHZtLmxpbmhhLmlkKS50aGVuKGZ1bmN0aW9uKGxpbmhhKSB7XG4gICAgICAgICAgICAgICAgdm0ubGluaGEgICA9IGxpbmhhO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2bS5saW5oYS5pZCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkaWNpb25hIHVtIGF0cmlidXRvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgICAgIHZtLmxpbmhhLmF0cmlidXRvcy5wdXNoKHZtLm5vdm9BdHJpYnV0byk7XG4gICAgICAgICAgICB2bS5ub3ZvQXRyaWJ1dG8gPSB7fTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIHVtIGF0cmlidXRvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGluZGV4KSB7IFxuICAgICAgICAgICAgdm0ubGluaGEuYXRyaWJ1dG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGEgbGluaGFcbiAgICAgICAgICogXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTGluaGEuc2F2ZSh2bS5saW5oYSwgdm0ubGluaGEuaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdMaW5oYSBzYWx2YSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmhhTGlzdENvbnRyb2xsZXInLCBMaW5oYUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExpbmhhTGlzdENvbnRyb2xsZXIoTGluaGEsIEZpbHRlciwgVGFibGVIZWFkZXIsIG5nRGlhbG9nKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7ICBcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdsaW5oYXMnLCB2bSwge1xuICAgICAgICAgICAgJ2xpbmhhcy50aXR1bG8nOiAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdsaW5oYXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7IFxuIFxuICAgICAgICAgICAgTGluaGEuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnbGluaGFzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RlbXBsYXRlbWxDb250cm9sbGVyJywgVGVtcGxhdGVtbENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVGVtcGxhdGVtbENvbnRyb2xsZXIoUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgdGVtcGxhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnVybCk7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcInRlbXBsYXRlbWwvZ2VyYXJcIikuY3VzdG9tR0VUKFwiXCIsIHtcbiAgICAgICAgICAgICAgdXJsOiB2bS51cmxcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50ZW1wbGF0ZSA9IHJlc3BvbnNlLnRlbXBsYXRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdNZW51Q29udHJvbGxlcicsIE1lbnVDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCRzdGF0ZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHN1Ym1lbnVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lbnVcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5TdWIgPSBmdW5jdGlvbihtZW51KSB7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBtZW51KVxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN1Yk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtZW51LnN1Yk9wZW4gPSAhbWVudS5zdWJPcGVuO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIGluZmVyaW9yIG1lbnVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lbnVcbiAgICAgICAgICogQHBhcmFtIHN1YlxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlbkluZiA9IGZ1bmN0aW9uKG1lbnUsIHN1Yikge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1lbnUuc3ViLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gc3ViKVxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN1Yk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdWIuc3ViT3BlbiA9ICFzdWIuc3ViT3BlbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0cmlldmUgbWVudSBpdGVuc1xuICAgICAgICAgKiBAdHlwZSB7KltdfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uaXRlbXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdQYWluZWwnLFxuICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuZGFzaGJvYXJkJyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRhc2hib2FyZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdQZWRpZG9zJyxcbiAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnBlZGlkb3MuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtY3ViZXMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQ2xpZW50ZXMnLFxuICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuY2xpZW50ZXMuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHV0b3MnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1kcm9wYm94JyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1Byb2R1dG9zJywgaWNvbjogJ2ZhLWxpc3QnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdMaW5oYXMnLCBpY29uOiAnZmEtbGlzdC1hbHQnLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnByb2R1dG9zLmxpbmhhcy5pbmRleCcpIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdNYXJjYXMnLCBpY29uOiAnZmEtbGlzdC1hbHQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdBc3Npc3TDqm5jaWEnLCBpY29uOiAnZmEtd3JlbmNoJyB9LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdNb3ZpbWVudGHDp8O1ZXMnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1leGNoYW5nZScsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdFbnRyYWRhJywgaWNvbjogJ2ZhLW1haWwtcmVwbHknIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdTYcOtZGEnLCBpY29uOiAnZmEtbWFpbC1mb3J3YXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRGVmZWl0bycsIGljb246ICdmYS1jaGFpbi1icm9rZW4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdUcmFuc3BvcnRhZG9yYXMnLCBpY29uOiAnZmEtdHJ1Y2snIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdGb3JuZWNlZG9yZXMnLCBpY29uOiAnZmEtYnVpbGRpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdGb3JtYXMgZGUgcGFnYW1lbnRvJywgaWNvbjogJ2ZhLW1vbmV5JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnT3BlcmHDp8OjbyBmaXNjYWwnLCBpY29uOiAnZmEtcGVyY2VudCcgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdGaW5hbmNlaXJvJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtbW9uZXknLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnQ29udGFzIGEgcGFnYXIvcmVjZWJlcicsIGljb246ICdmYS1jcmVkaXQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1BsYW5vIGRlIGNvbnRhcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS10cnVjaycsXG4gICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnYXRlbmRpbWVudG8nXSxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MgaW1wb3J0YW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXRydWNrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAucmFzdHJlaW9zLmltcG9ydGFudGVzJylcbiAgICAgICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUElcXCdzIHBlbmRlbnRlcycgLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXdhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hdGVuZGltZW50by5waXMnKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Rldm9sdcOnw7VlcyBwZW5kZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVuZG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hdGVuZGltZW50by5kZXZvbHVjb2VzJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZWxhdMOzcmlvcycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXBpZS1jaGFydCcsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ0NhaXhhIGRpw6FyaW8nLCBpY29uOiAnZmEtbW9uZXknfSxcbiAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnSUNNUyBtZW5zYWwnLCBpY29uOiAnZmEtZmlsZS1wZGYtbycsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuYWRtaW4uaWNtcycpfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQ29uZmlndXJhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtY29nJyxcbiAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ01hcmtldGluZycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWJ1bGxob3JuJyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnVGVtcGxhdGUgTUwnLCBpY29uOiAnZmEtY2xpcGJvYXJkJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5tYXJrZXRpbmcudGVtcGxhdGVtbCcpfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdJbnRlcm5vJywgXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRlc2t0b3AnLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0RhZG9zIGRhIGVtcHJlc2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWluZm8nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSW1wb3N0b3MgZGEgbm90YScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtcGVyY2VudCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVc3XDoXJpb3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVzZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuaW50ZXJuby51c3Vhcmlvcy5pbmRleCcpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgU2VhcmNoQ29udHJvbGxlcilcbiAgICAgICAgLmZpbHRlcignaGlnaGxpZ2h0JywgZnVuY3Rpb24oJHNjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQsIHBocmFzZSkge1xuICAgICAgICAgICAgICAgIGlmIChwaHJhc2UpIHRleHQgPSBTdHJpbmcodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKCcoJytwaHJhc2UrJyknLCAnZ2knKSxcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidW5kZXJsaW5lXCI+JDE8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbCh0ZXh0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlYXJjaCA9ICcnO1xuICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsb3NlIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiY2xvc2VTZWFyY2hcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh2bS5zZWFyY2gubGVuZ3RoIDw9IDMpIHtcbiAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKFwic2VhcmNoXCIpLmN1c3RvbUdFVChcIlwiLCB7c2VhcmNoOiB2bS5zZWFyY2h9KS50aGVuKGZ1bmN0aW9uKGJ1c2NhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IGJ1c2NhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXBsb2FkQ29udHJvbGxlcicsIFVwbG9hZENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXBsb2FkQ29udHJvbGxlcihVcGxvYWQsIHRvYXN0ZXIsIGVudlNlcnZpY2UsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBsb2FkIG5vdGFzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBmaWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0udXBsb2FkID0gZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgICAgICAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvdXBsb2FkJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJysgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJxdWl2b3M6IGZpbGVzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3N0b3AtbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdVcGxvYWQgY29uY2x1w61kbycsIHJlc3BvbnNlLmRhdGEubXNnKTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiRXJybyBubyB1cGxvYWQhXCIsIFwiRXJybyBhbyBlbnZpYXIgYXJxdWl2b3MsIHRlbnRlIG5vdmFtZW50ZSFcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7IFxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXInLCBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyLCBuZ0RpYWxvZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuIFxuICAgICAgICB2bS5jb21lbnRhcmlvcyA9IFtdO1xuICAgICAgICB2bS5jb21lbnRhcmlvID0gbnVsbDtcbiAgICAgICAgdm0ucGVkaWRvX2lkID0gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuIFxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIGNvbWVudGFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2NvbWVudGFyaW9zJykuY3VzdG9tR0VUKHZtLnBlZGlkb19pZCkudGhlbihmdW5jdGlvbihjb21lbnRhcmlvcykge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvcyA9IGNvbWVudGFyaW9zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIGNvbWVudGFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2NvbWVudGFyaW9zJykuY3VzdG9tUE9TVCh7XG4gICAgICAgICAgICAgICAgICAgICdwZWRpZG9faWQnOiBwZWRpZG8sXG4gICAgICAgICAgICAgICAgICAgICdjb21lbnRhcmlvJzogdm0uY29tZW50YXJpb1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0uY29tZW50YXJpbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdm0uZm9ybUNvbWVudGFyaW8uJHNldFByaXN0aW5lKCk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0NvbWVudMOhcmlvIGNhZGFzdHJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVzdHJveSBjb21lbnTDoXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKGNvbWVudGFyaW8pIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuQ29uZmlybSh7IFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnJyArIFxuICAgICAgICAgICAgICAgICc8cD48aSBjbGFzcz1cImZhIGZhLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlXCI+PC9pPiZuYnNwOyBUZW0gY2VydGV6YSBxdWUgZGVzZWphIGV4Y2x1aXIgbyBjb21lbnTDoXJpbz88L3A+JyArIFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibmdkaWFsb2ctYnV0dG9uc1wiPicgKyBcbiAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuZ2RpYWxvZy1idXR0b24gbmdkaWFsb2ctYnV0dG9uLXNlY29uZGFyeVwiIG5nLWNsaWNrPVwiY2xvc2VUaGlzRGlhbG9nKDApXCI+TsOjbzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5nZGlhbG9nLWJ1dHRvbiBuZ2RpYWxvZy1idXR0b24tcHJpbWFyeVwiIG5nLWNsaWNrPVwiY29uZmlybSgxKVwiPlNpbTwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgIHBsYWluOiB0cnVlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnY29tZW50YXJpb3MnLCBjb21lbnRhcmlvKS5jdXN0b21ERUxFVEUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdpbmZvJywgJ1N1Y2Vzc28hJywgJ0NvbWVudMOhcmlvIGV4Y2x1w61kbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0RldGFsaGVDb250cm9sbGVyJywgUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgUGVkaWRvKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gIFxuICAgICAgICB2bS5wZWRpZG9faWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLnBlZGlkbyAgICA9IHt9OyBcbiAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG5cblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5wZWRpZG8gID0ge307IFxuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFBlZGlkby5nZXQodm0ucGVkaWRvX2lkKS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkbyAgPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWx0ZXJhciBzdGF0dXMgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jaGFuZ2VTdGF0dXMgPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3Mvc3RhdHVzJywgdm0ucGVkaWRvLmlkKS5jdXN0b21QVVQoe1xuICAgICAgICAgICAgICAgICdzdGF0dXMnOiBzdGF0dXNcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTsgXG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU3RhdHVzIGRvIHBlZGlkbyBhbHRlcmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcmlvcml6YXIgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5wcmlvcml0aXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zL3ByaW9yaWRhZGUnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3ByaW9yaXphZG8nOiB0cnVlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkbyA9IHBlZGlkbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7IFxuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBwcmlvcml6YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXIgcHJpb3JpZGFkZSBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnVucHJpb3JpdGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9wcmlvcmlkYWRlJywgdm0ucGVkaWRvLmlkKS5jdXN0b21QVVQoe1xuICAgICAgICAgICAgICAgICdwcmlvcml6YWRvJzogZmFsc2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTsgXG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2luZm8nLCAnU3VjZXNzbyEnLCAnUHJpb3JpZGFkZSByZW1vdmlkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvTGlzdENvbnRyb2xsZXInLCBQZWRpZG9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9MaXN0Q29udHJvbGxlcihQZWRpZG8sIEZpbHRlciwgVGFibGVIZWFkZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdwZWRpZG9zJywgdm0sIHtcbiAgICAgICAgICAgICdwZWRpZG9zLmNvZGlnb19tYXJrZXRwbGFjZSc6ICdMSUtFJyxcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICdMSUtFJ1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncGVkaWRvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24odGVzdGUpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlOyBcbiBcbiAgICAgICAgICAgIFBlZGlkby5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9zLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRvcm5hIGEgY2xhc3NlIGRlIHN0YXR1cyBkbyBwZWRpZG8gXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gIHtQZWRpZG99IHBlZGlkbyBcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgXG4gICAgICAgICAqL1xuICAgICAgICB2bS5wYXJzZVN0YXR1c0NsYXNzID0gZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBlZGlkby5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnaW5mbyc7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3dhcm5pbmcnO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdzdWNjZXNzJztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Rhbmdlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdSYXN0cmVpb0ltcG9ydGFudGVMaXN0Q29udHJvbGxlcicsIFJhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFJhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyKFJhc3RyZWlvLCBGaWx0ZXIsIFRhYmxlSGVhZGVyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3Jhc3RyZWlvcycsIHZtLCB7XG4gICAgICAgICAgICAncGVkaWRvcy5jb2RpZ29fbWFya2V0cGxhY2UnOiAnTElLRScsXG4gICAgICAgICAgICAnY2xpZW50ZXMubm9tZSc6ICAgICAgICAgICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvcy5yYXN0cmVpbyc6ICAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3Jhc3RyZWlvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgICAgICBSYXN0cmVpby5pbXBvcnRhbnQoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ3BlZGlkb19yYXN0cmVpb3MuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVmcmVzaCBhbGwgcmFzdHJlaW9zXG4gICAgICAgICAqL1xuICAgICAgICB2bS5yZWZyZXNoQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5yYXN0cmVpb3MgPSBbXTtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3Jhc3RyZWlvcy9yZWZyZXNoX2FsbCcpLmN1c3RvbVBVVCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1Jhc3RyZWlvcyBhdHVhbGl6YWRvcyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZW5oYUZvcm1Db250cm9sbGVyJywgU2VuaGFGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBTZW5oYUZvcm1Db250cm9sbGVyKFNlbmhhLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZW5oYSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnNlbmhhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFNlbmhhLnNhdmUodm0uc2VuaGEsIHZtLnNlbmhhLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU2VuaGEgc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignU2VuaGFMaXN0Q29udHJvbGxlcicsIFNlbmhhTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gU2VuaGFMaXN0Q29udHJvbGxlcihTZW5oYSwgVGFibGVIZWFkZXIsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgnc2VuaGFzJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuIFxuICAgICAgICAgICAgU2VuaGEuZnJvbVVzZXIoJHN0YXRlUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZSwgXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyZSBvIGZvcm11bMOhcmlvIGRlIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24oc2VuaGEpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3Mvc2VuaGEvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VuaGFGb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnU2VuaGFGb3JtJywgXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZW5oYTogc2VuaGEgfHwgeyB1c3VhcmlvX2lkOiAkc3RhdGVQYXJhbXMuaWQgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gIHtpbnR9IHNlbmhhIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSAgICAgICBcbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgU2VuaGEuZGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIGRlbGV0YWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXN1YXJpb0Zvcm1Db250cm9sbGVyJywgVXN1YXJpb0Zvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFVzdWFyaW9Gb3JtQ29udHJvbGxlcihVc3VhcmlvLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c3VhcmlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEudXN1YXJpbyk7XG5cbiAgICAgICAgLy8gQXBlbmFzIHBhcmEgZWRpw6fDo29cbiAgICAgICAgdm0udXN1YXJpby5ub3Zhc1JvbGVzID0gW107XG4gICAgICAgIGlmICh2bS51c3VhcmlvLmhhc093blByb3BlcnR5KCdyb2xlcycpKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udXN1YXJpby5yb2xlcywgZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgIHZtLnVzdWFyaW8ubm92YXNSb2xlc1tyb2xlLmlkXSA9IHJvbGUuaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFVzdWFyaW8uc2F2ZSh2bS51c3VhcmlvLCB2bS51c3VhcmlvLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnVXN1w6FyaW8gc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhciBcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9MaXN0Q29udHJvbGxlcicsIFVzdWFyaW9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvTGlzdENvbnRyb2xsZXIoVXN1YXJpbywgVGFibGVIZWFkZXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgndXN1YXJpb3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFVzdWFyaW8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyZSBvIGZvcm11bMOhcmlvIGRvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24odXN1YXJpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy91c3VhcmlvL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzdWFyaW9Gb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVXN1YXJpb0Zvcm0nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXN1YXJpbzogdXN1YXJpbyB8fCB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gIHtpbnR9ICBpZCBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gICAgXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIFVzdWFyaW8uZGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1VzdcOhcmlvIGRlbGV0YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
