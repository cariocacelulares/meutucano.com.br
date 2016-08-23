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

    LinhaFormController.$inject = ["$rootScope", "$stateParams", "Restangular", "Linha"];
    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $stateParams, Restangular, Linha) {
        var vm = this;
  
        vm.linha_id = $stateParams.id;
        vm.linha    = {};
        vm.loading   = false;


        vm.load = function() {
            vm.linha  = {}; 
            vm.loading = true;

            Linha.get(vm.linha_id).then(function(linha) {
                vm.linha  = linha;
                vm.loading = false;
            });
        };
        vm.load();
    }
})();
(function() {
    'use strict';

    LinhaListController.$inject = ["Linha", "Filter", "TableHeader"];
    angular
        .module('MeuTucano')
        .controller('LinhaListController', LinhaListController);

    function LinhaListController(Linha, Filter, TableHeader) {
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
                orderBy:  'linhas.created_at',
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

        /**
         * Abre o formulário da linha
         * 
         * @return {void} 
         */
        /*vm.openForm = function(linha) {
            ngDialog.open({
                template: 'views/linha/form.html',
                controller: 'LinhaFormController',
                controllerAs: 'LinhaForm',
                data: {
                    linha: linha || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
            });
        };*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9EZXZvbHVjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9FZGl0YXJDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRW1haWxDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vTG9naXN0aWNhQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL09ic2VydmFjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlMaXN0Q29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL1Jhc3RyZWlvQ29udHJvbGxlci5qcyIsIkF1dGgvQXV0aENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0NsaWVudGVMaXN0Q29udHJvbGxlci5qcyIsIkZhdHVyYW1lbnRvL0ZhdHVyYW1lbnRvQ29udHJvbGxlci5qcyIsIkxpbmhhL0xpbmhhRm9ybUNvbnRyb2xsZXIuanMiLCJMaW5oYS9MaW5oYUxpc3RDb250cm9sbGVyLmpzIiwiTWFya2V0aW5nL1RlbXBsYXRlbWxDb250cm9sbGVyLmpzIiwiUGFydGlhbHMvTWVudUNvbnRyb2xsZXIuanMiLCJQYXJ0aWFscy9TZWFyY2hDb250cm9sbGVyLmpzIiwiUGFydGlhbHMvVXBsb2FkQ29udHJvbGxlci5qcyIsIlNlbmhhL1NlbmhhRm9ybUNvbnRyb2xsZXIuanMiLCJTZW5oYS9TZW5oYUxpc3RDb250cm9sbGVyLmpzIiwiVXN1YXJpby9Vc3VhcmlvRm9ybUNvbnRyb2xsZXIuanMiLCJVc3VhcmlvL1VzdWFyaW9MaXN0Q29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9EZXRhbGhlQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9MaXN0Q29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxpQkFBQTs7SUFFQSxTQUFBLGNBQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBLFNBQUEsc0JBQUEsVUFBQSxhQUFBLFdBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsV0FBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsZUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsZUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7OztRQUdBLEdBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxlQUFBOztZQUVBLFlBQUEsSUFBQSxlQUFBLFlBQUEsS0FBQSxTQUFBLE9BQUE7Z0JBQ0EsR0FBQSxRQUFBO2dCQUNBLEdBQUEsZUFBQTs7O1FBR0EsR0FBQTs7Ozs7UUFLQSxVQUFBLFdBQUE7WUFDQSxHQUFBO1dBQ0E7Ozs7O1FBS0EsR0FBQSxhQUFBLFdBQUE7WUFDQSxHQUFBLGFBQUE7WUFDQSxNQUFBOzs7Ozs7UUFNQSxXQUFBLElBQUEsZUFBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBOzs7Ozs7UUFNQSxHQUFBLFNBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxLQUFBLFdBQUE7Z0JBQ0EsYUFBQSxXQUFBO2dCQUNBLFdBQUEsZ0JBQUE7Z0JBQ0EsV0FBQSxjQUFBOztnQkFFQSxPQUFBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxXQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGdCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7O1FBT0EsR0FBQSxhQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGtCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7OztRQVFBLEdBQUEsZ0JBQUEsU0FBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBO2dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7WUFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEseUJBQUEsY0FBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7UUFPQSxHQUFBLFFBQUEsU0FBQSxXQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFdBQUE7b0JBQ0EsT0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxLQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxZQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxZQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxTQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxXQUFBLFNBQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLEdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7UUFRQSxHQUFBLGFBQUEsU0FBQSxVQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxVQUFBOzs7Ozs7OztBQ3JOQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsc0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O0FDUkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLFlBQUEsYUFBQSxZQUFBLFNBQUEsc0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O1FBS0EsR0FBQSxvQkFBQSxXQUFBO1lBQ0EsSUFBQSxPQUFBO2dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7WUFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEsc0JBQUEscUJBQUE7Ozs7OztBQ2xCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBO1lBQ0EsR0FBQSxXQUFBO2VBQ0E7WUFDQSxHQUFBLFlBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Z0JBQ0EsY0FBQSxFQUFBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLGNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxtQkFBQSxHQUFBLFNBQUEsSUFBQSxVQUFBLEdBQUEsV0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDakNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDJCQUFBOztJQUVBLFNBQUEsd0JBQUEsWUFBQSxhQUFBLFVBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFlBQUE7UUFDQSxHQUFBLFVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsY0FBQSxVQUFBLEtBQUEsU0FBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7O0FDckNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLG9CQUFBOztJQUVBLFNBQUEsaUJBQUEsYUFBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBLFNBQUEsT0FBQSxTQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsSUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxTQUFBO2dCQUNBLFlBQUEsR0FBQSxTQUFBO2dCQUNBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLEtBQUEsR0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQTs7O1lBR0EsWUFBQSxJQUFBLGtCQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztBQzVCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxtQkFBQTs7SUFFQSxTQUFBLGdCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLElBQUEsWUFBQTtnQkFDQSxPQUFBLEdBQUE7OztZQUdBLFlBQUEsSUFBQSxlQUFBLEdBQUEsV0FBQSxXQUFBLFdBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBOztZQUVBLElBQUEsR0FBQSxVQUFBLE1BQUE7Z0JBQ0EsR0FBQSxXQUFBO21CQUNBO2dCQUNBLEdBQUEseUJBQUE7Z0JBQ0EsR0FBQSxVQUFBLGVBQUEsRUFBQSxPQUFBLEdBQUEsU0FBQTtnQkFDQSxRQUFBLElBQUEsR0FBQTs7Ozs7OztRQU9BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLG1CQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxXQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsYUFBQSxPQUFBLGFBQUEsU0FBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxhQUFBLE9BQUEsYUFBQSxTQUFBLElBQUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxhQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsZ0JBQUE7O0lBRUEsU0FBQSxhQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUEsU0FBQSxzQkFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTs7UUFFQSxJQUFBLEdBQUEsU0FBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLEdBQUEsU0FBQTs7WUFFQSxJQUFBLEdBQUEsR0FBQSxRQUFBO2dCQUNBLEdBQUEsV0FBQTttQkFDQTtnQkFDQSxHQUFBLGtCQUFBO2dCQUNBLEdBQUEsR0FBQSxlQUFBLEVBQUEsT0FBQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxHQUFBLGVBQUE7O2VBRUE7WUFDQSxHQUFBLEtBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxZQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7O1FBT0EsR0FBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFNBQUE7Z0JBQ0EsVUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUEsT0FBQSxRQUFBO2dCQUNBLEtBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxVQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsUUFBQSxHQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBLGFBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsUUFBQSxDQUFBLEdBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsUUFBQSxLQUFBLDZEQUFBLHFCQUFBOzs7OztBQzFEQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTs7SUFFQSxTQUFBLGlCQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztBQ3JDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTs7SUFFQSxTQUFBLG1CQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLGFBQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsYUFBQSxXQUFBO1lBQ0EsR0FBQSxZQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSx5QkFBQSxZQUFBLEtBQUEsU0FBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFVBQUE7O2dCQUVBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7QUNsREEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLE9BQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxhQUFBLFFBQUE7UUFDQSxJQUFBLEdBQUEsVUFBQTtZQUNBLE1BQUE7ZUFDQTtZQUNBLE1BQUE7Ozs7OztRQU1BLEdBQUEsUUFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLGFBQUEsUUFBQSxZQUFBLEdBQUE7WUFDQSxJQUFBLGNBQUE7Z0JBQ0EsVUFBQSxHQUFBO2dCQUNBLFVBQUEsR0FBQTs7O1lBR0EsTUFBQSxNQUFBLGFBQUEsS0FBQSxXQUFBO2dCQUNBLE9BQUEsTUFBQSxJQUFBLFdBQUEsS0FBQSxZQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLElBQUEsT0FBQSxLQUFBLFVBQUEsU0FBQSxLQUFBOztnQkFFQSxhQUFBLFFBQUEsUUFBQTtnQkFDQSxXQUFBLGdCQUFBOztnQkFFQSxXQUFBLGNBQUEsU0FBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7Ozs7O0FDdkNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsU0FBQSxRQUFBLGFBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsYUFBQSxPQUFBLEtBQUEsWUFBQSxJQUFBO1lBQ0EsdUJBQUE7WUFDQSx1QkFBQTs7Ozs7OztRQU9BLEdBQUEsY0FBQSxZQUFBLEtBQUEsWUFBQTs7UUFFQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxRQUFBLFFBQUE7Z0JBQ0EsVUFBQSxDQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxVQUFBLEdBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBOzs7O0FDeENBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsWUFBQSxhQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBO1lBQ0EsU0FBQTs7UUFFQSxHQUFBLFVBQUE7UUFDQSxHQUFBLGFBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsUUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEscUJBQUEsVUFBQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFFBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsZUFBQSxXQUFBO1lBQ0EsR0FBQSxPQUFBLFdBQUE7O1lBRUEsWUFBQSxJQUFBLGlCQUFBLEdBQUEsT0FBQSxTQUFBLFlBQUEsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxPQUFBLFdBQUEsU0FBQTs7Z0JBRUEsSUFBQSxTQUFBLGVBQUEsVUFBQTtvQkFDQSxHQUFBLE9BQUEsV0FBQTtvQkFDQSxRQUFBLElBQUEsU0FBQSxRQUFBLFNBQUE7OztnQkFHQSxJQUFBLFNBQUEsZUFBQSxRQUFBO29CQUNBLFFBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQTs7Z0JBRUEsR0FBQSxPQUFBLFdBQUEsU0FBQTs7Ozs7OztRQU9BLEdBQUEsVUFBQSxTQUFBLFdBQUE7WUFDQSxZQUFBLElBQUEsaUJBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3JFQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLFlBQUEsY0FBQSxhQUFBLE9BQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBLGFBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxTQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE1BQUEsSUFBQSxHQUFBLFVBQUEsS0FBQSxTQUFBLE9BQUE7Z0JBQ0EsR0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTs7O1FBR0EsR0FBQTs7O0FDeEJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsT0FBQSxRQUFBLGFBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsYUFBQSxPQUFBLEtBQUEsVUFBQSxJQUFBO1lBQ0EsaUJBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFVBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsTUFBQSxRQUFBO2dCQUNBLFVBQUEsQ0FBQTtnQkFDQSxVQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsVUFBQSxHQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHdCQUFBOztJQUVBLFNBQUEscUJBQUEsYUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7UUFLQSxHQUFBLG1CQUFBLFdBQUE7WUFDQSxRQUFBLElBQUEsR0FBQTs7WUFFQSxZQUFBLElBQUEsb0JBQUEsVUFBQSxJQUFBO2NBQ0EsS0FBQSxHQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxXQUFBLFNBQUE7Ozs7OztBQ25CQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxrQkFBQTs7SUFFQSxTQUFBLGVBQUEsUUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7OztRQU9BLEdBQUEsVUFBQSxTQUFBLE1BQUE7WUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLFFBQUE7b0JBQ0EsS0FBQSxVQUFBOzs7WUFHQSxLQUFBLFVBQUEsQ0FBQSxLQUFBOzs7Ozs7Ozs7UUFTQSxHQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7WUFDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLFFBQUE7b0JBQ0EsS0FBQSxVQUFBOzs7WUFHQSxJQUFBLFVBQUEsQ0FBQSxJQUFBOzs7Ozs7O1FBT0EsR0FBQSxRQUFBO1lBQ0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBLE9BQUEsS0FBQTtnQkFDQSxNQUFBOztZQUVBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQSxPQUFBLEtBQUE7Z0JBQ0EsTUFBQTs7WUFFQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUEsT0FBQSxLQUFBO2dCQUNBLE1BQUE7O1lBRUE7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLFlBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsVUFBQSxNQUFBLGVBQUEsTUFBQSxPQUFBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLFVBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsZUFBQSxNQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxFQUFBLE9BQUEsV0FBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxTQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLFdBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsZ0JBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsdUJBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTs7O1lBR0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLDBCQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7OztZQUdBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLENBQUEsU0FBQTtnQkFDQSxLQUFBO29CQUNBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7Ozs7WUFJQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxDQUFBLE9BQUEsZ0JBQUEsTUFBQTtvQkFDQSxDQUFBLE9BQUEsZUFBQSxNQUFBLGlCQUFBLE1BQUEsT0FBQSxLQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxDQUFBOztZQUVBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxLQUFBO29CQUNBLENBQUEsT0FBQSxlQUFBLE1BQUEsZ0JBQUEsTUFBQSxPQUFBLEtBQUE7OztZQUdBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxLQUFBO29CQUNBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7Ozs7Ozs7OztBQ25KQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTtTQUNBLE9BQUEsc0JBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxTQUFBLE1BQUEsUUFBQTtnQkFDQSxJQUFBLFFBQUEsT0FBQSxPQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUEsSUFBQSxPQUFBLEtBQUE7b0JBQ0E7O2dCQUVBLE9BQUEsS0FBQSxZQUFBOzs7O0lBSUEsU0FBQSxpQkFBQSxhQUFBLFlBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxTQUFBO1FBQ0EsR0FBQSxpQkFBQTtRQUNBLEdBQUEsZUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsZUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7Ozs7OztRQU1BLEdBQUEsUUFBQSxXQUFBO1lBQ0EsV0FBQSxXQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLElBQUEsR0FBQSxPQUFBLFVBQUEsR0FBQTtnQkFDQSxHQUFBLGlCQUFBO21CQUNBO2dCQUNBLEdBQUEsZUFBQTs7Z0JBRUEsWUFBQSxJQUFBLFVBQUEsVUFBQSxJQUFBLENBQUEsUUFBQSxHQUFBLFNBQUEsS0FBQSxTQUFBLE9BQUE7b0JBQ0EsR0FBQSxlQUFBO29CQUNBLEdBQUEsaUJBQUE7Ozs7Ozs7QUNwREEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsb0JBQUE7O0lBRUEsU0FBQSxpQkFBQSxRQUFBLFNBQUEsWUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7O1FBT0EsR0FBQSxTQUFBLFVBQUEsT0FBQTtZQUNBLElBQUEsU0FBQSxNQUFBLFFBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUEsT0FBQTtvQkFDQSxLQUFBLFdBQUEsS0FBQSxZQUFBO29CQUNBLFNBQUEsQ0FBQSxlQUFBLFdBQUEsYUFBQSxRQUFBO29CQUNBLE1BQUE7d0JBQ0EsVUFBQTs7bUJBRUEsUUFBQSxVQUFBLFVBQUE7b0JBQ0EsV0FBQSxXQUFBO29CQUNBLFdBQUEsV0FBQTtvQkFDQSxRQUFBLElBQUEsV0FBQSxvQkFBQSxTQUFBLEtBQUE7bUJBQ0EsTUFBQSxZQUFBO29CQUNBLFFBQUEsSUFBQSxTQUFBLG1CQUFBOzs7Ozs7O0FDN0JBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsT0FBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxRQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxNQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7O0FDbEJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsT0FBQSxhQUFBLGNBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsY0FBQSxZQUFBLEtBQUEsVUFBQTs7UUFFQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLFNBQUEsYUFBQSxJQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7Ozs7UUFPQSxHQUFBLFdBQUEsU0FBQSxPQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsT0FBQSxTQUFBLEVBQUEsWUFBQSxhQUFBOztlQUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLFVBQUEsTUFBQSxHQUFBOzs7Ozs7Ozs7O1FBVUEsR0FBQSxVQUFBLFNBQUEsSUFBQTtZQUNBLE1BQUEsT0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLEdBQUE7Ozs7OztBQ3hEQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx5QkFBQTs7SUFFQSxTQUFBLHNCQUFBLFNBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7OztRQUdBLEdBQUEsUUFBQSxhQUFBO1FBQ0EsSUFBQSxHQUFBLFFBQUEsZUFBQSxVQUFBO1lBQ0EsUUFBQSxRQUFBLEdBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQTtnQkFDQSxHQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsS0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxRQUFBLEtBQUEsR0FBQSxTQUFBLEdBQUEsUUFBQSxNQUFBLE1BQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7O0FDNUJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsU0FBQSxhQUFBLFVBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxjQUFBLFlBQUEsS0FBQSxZQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFFBQUEsUUFBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBOzs7Ozs7O1FBT0EsR0FBQSxXQUFBLFNBQUEsU0FBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFNBQUEsV0FBQTs7ZUFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsS0FBQSxVQUFBLE1BQUEsR0FBQTs7Ozs7Ozs7OztRQVVBLEdBQUEsVUFBQSxTQUFBLElBQUE7WUFDQSxRQUFBLE9BQUEsSUFBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTtnQkFDQSxHQUFBOzs7Ozs7QUN4REEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsOEJBQUE7O0lBRUEsU0FBQSwyQkFBQSxZQUFBLGNBQUEsYUFBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxjQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBLGFBQUE7UUFDQSxHQUFBLFVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsZUFBQSxVQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsR0FBQSxjQUFBOzs7O1FBSUEsR0FBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsU0FBQSxRQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxlQUFBLFdBQUE7b0JBQ0EsYUFBQTtvQkFDQSxjQUFBLEdBQUE7bUJBQ0EsS0FBQSxXQUFBOztnQkFFQSxHQUFBLFVBQUE7Z0JBQ0EsR0FBQSxhQUFBO2dCQUNBLEdBQUEsZUFBQTtnQkFDQSxHQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7UUFPQSxHQUFBLFVBQUEsU0FBQSxZQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFNBQUEsWUFBQTtnQkFDQSxVQUFBO2dCQUNBO2dCQUNBO2dCQUNBO2dCQUNBO2dCQUNBO2dCQUNBLE9BQUE7ZUFDQSxLQUFBLFdBQUE7Z0JBQ0EsWUFBQSxJQUFBLGVBQUEsWUFBQSxlQUFBLEtBQUEsV0FBQTtvQkFDQSxHQUFBLFVBQUE7b0JBQ0EsR0FBQSxhQUFBO29CQUNBLEdBQUE7b0JBQ0EsUUFBQSxJQUFBLFFBQUEsWUFBQTs7Ozs7O0FDL0VBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDJCQUFBOztJQUVBLFNBQUEsd0JBQUEsWUFBQSxjQUFBLGFBQUEsUUFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFlBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsT0FBQSxJQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsZUFBQSxTQUFBLFFBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLGtCQUFBLEdBQUEsT0FBQSxJQUFBLFVBQUE7Z0JBQ0EsVUFBQTtlQUNBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztRQU9BLEdBQUEsYUFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxzQkFBQSxHQUFBLE9BQUEsSUFBQSxVQUFBO2dCQUNBLGNBQUE7ZUFDQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7UUFPQSxHQUFBLGVBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsc0JBQUEsR0FBQSxPQUFBLElBQUEsVUFBQTtnQkFDQSxjQUFBO2VBQ0EsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTtnQkFDQSxRQUFBLElBQUEsUUFBQSxZQUFBOzs7Ozs7QUNuRUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxRQUFBLFFBQUEsYUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxhQUFBLE9BQUEsS0FBQSxXQUFBLElBQUE7WUFDQSw4QkFBQTtZQUNBLDhCQUFBOzs7Ozs7O1FBT0EsR0FBQSxjQUFBLFlBQUEsS0FBQSxXQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE9BQUEsUUFBQTtnQkFDQSxVQUFBLENBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxVQUFBO2dCQUNBLFVBQUEsR0FBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxNQUFBO29CQUNBO3dCQUNBLGFBQUE7d0JBQ0EsYUFBQTt3QkFDQSxhQUFBO3dCQUNBLGFBQUE7O29CQUVBO3dCQUNBLGFBQUE7d0JBQ0EsYUFBQTt3QkFDQSxhQUFBO3dCQUNBLGFBQUE7OztlQUdBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxtQkFBQSxTQUFBLFFBQUE7WUFDQSxRQUFBLE9BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxPQUFBO2dCQUNBLEtBQUE7b0JBQ0EsT0FBQTtnQkFDQSxLQUFBO29CQUNBLE9BQUE7Z0JBQ0EsS0FBQTtnQkFDQSxLQUFBO29CQUNBLE9BQUE7Ozs7O0tBS0EiLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuIFxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgQXBwQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRyb290U2NvcGUsIGZvY3VzLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplciwgbmdEaWFsb2csIFJlc3Rhbmd1bGFyLCAkaW50ZXJ2YWwsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZWFyY2hPcGVuID0gZmFsc2U7XG4gICAgICAgIHZtLnVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xuICAgICAgICB2bS5tZXRhcyA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkTWV0YSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZtLmxvYWRNZXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21ldGFzL2F0dWFsJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihtZXRhcykge1xuICAgICAgICAgICAgICAgIHZtLm1ldGFzID0gbWV0YXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZE1ldGEoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGltZW91dCBtZXRhc1xuICAgICAgICAgKi9cbiAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgfSwgNjAwMDApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5zZWFyY2hPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvY3VzKCdzZWFyY2hJbnB1dCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbG9zZSBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgJHJvb3RTY29wZS4kb24oXCJjbG9zZVNlYXJjaFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nb3V0XG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBYTUxcbiAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucHJpbnRYTUwgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy94bWwvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAneG1sJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIERBTkZFXG4gICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RGFuZmUgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy9kYW5mZS8nICsgcGVkaWRvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdkYW5mZScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBEQU5GRVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RXRpcXVldGEgPSBmdW5jdGlvbihyYXN0cmVpb19pZCkge1xuICAgICAgICAgICAgdmFyIGF1dGggPSB7XG4gICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3Jhc3RyZWlvcy9ldGlxdWV0YS8nICsgcmFzdHJlaW9faWQgKyAnPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSwgJ2V0aXF1ZXRhJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudmlhciBub3RhIHBvciBlLW1haWxcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5lbWFpbCA9IGZ1bmN0aW9uKHBlZGlkb19pZCwgZW1haWwpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZW1haWwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFbWFpbENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0VtYWlsJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlZGlkb19pZDogcGVkaWRvX2lkLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyaXIgUElcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5waSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL3BpLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGlDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdQaScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV2b2x1w6fDo29cbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9kZXZvbHVjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZXZvbHVjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdEZXZvbHVjYW8nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ8Otc3RpY2EgcmV2ZXJzYVxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2lzdGljYSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2xvZ2lzdGljYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2lzdGljYUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0xvZ2lzdGljYScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdGFyIHJhc3RyZWlvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZWRpdGFyID0gZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZWRpdGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFZGl0YXInLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbmNlbGEgbm90YVxuICAgICAgICAgKiBAcGFyYW0gcGVkaWRvX2lkXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jYW5jZWxhciA9IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zJywgcGVkaWRvX2lkKS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZGVsZXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT2JzZXJ2YcOnw6NvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL29ic2VydmFjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ09ic2VydmFjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdPYnNlcnZhY2FvJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdJY21zQ29udHJvbGxlcicsIEljbXNDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEljbXNDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXJhIHJlbGF0w7NyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlUmVsYXRvcmlvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvcmVsYXRvcmlvcy9pY21zPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rldm9sdWNhb0NvbnRyb2xsZXInLCBEZXZvbHVjYW9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIERldm9sdWNhb0NvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSB7fTtcblxuICAgICAgICB2bS5mdWxsU2VuZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh2bS5yYXN0cmVpby5kZXZvbHVjYW8pIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHZtLnJhc3RyZWlvLmRldm9sdWNhbztcbiAgICAgICAgICAgIHZtLmZ1bGxTZW5kID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXMsXG4gICAgICAgICAgICAgICAgcmFzdHJlaW9fcmVmOiB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9LFxuICAgICAgICAgICAgICAgIHBhZ29fY2xpZW50ZTogJzAnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2Rldm9sdWNvZXMvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQodm0uZGV2b2x1Y2FvKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0Rldm9sdcOnw6NvIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXInLCBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpb3MgPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdkZXZvbHVjb2VzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRhckNvbnRyb2xsZXInLCBFZGl0YXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVkaXRhckNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5jZXAgICAgICA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jZXApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZm9FZGl0ID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBkYXRhX2VudmlvOiB2bS5yYXN0cmVpby5kYXRhX2VudmlvX3JlYWRhYmxlLFxuICAgICAgICAgICAgICAgIHByYXpvOiB2bS5yYXN0cmVpby5wcmF6byxcbiAgICAgICAgICAgICAgICBjZXA6IHZtLmNlcCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHZtLnJhc3RyZWlvLnN0YXR1c1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyYXN0cmVpb3MvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQoaW5mb0VkaXQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGVkaXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRW1haWxDb250cm9sbGVyJywgRW1haWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVtYWlsQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucGVkaWRvX2lkID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucGVkaWRvX2lkKTtcbiAgICAgICAgdm0uZW1haWwgICAgID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuZW1haWwpO1xuIFxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZCBlLW1haWxcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmZvRW1haWwgPSB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ25vdGFzL2VtYWlsJywgdm0ucGVkaWRvX2lkKS5jdXN0b21QT1NUKGluZm9FbWFpbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdFLW1haWwgZW52aWFkbyBjb20gc3VjZXNzbyBhbyBjbGllbnRlIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2lzdGljYUNvbnRyb2xsZXInLCBMb2dpc3RpY2FDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExvZ2lzdGljYUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5sb2dpc3RpY2EgPSB7fTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ubG9naXN0aWNhKSB7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSB2bS5yYXN0cmVpby5sb2dpc3RpY2E7XG5cbiAgICAgICAgICAgIGlmICh2bS5sb2dpc3RpY2EuYWNhbykgeyAvLyBGb2kgY2FkYXN0cmFkbyBvIGPDs2RpZ28gZGUgcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICAgICAgICAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLmxvZ2lzdGljYS5yYXN0cmVpb19yZWYgPSB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmxvZ2lzdGljYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbG9naXN0aWNhcy9lZGl0Jywgdm0ucmFzdHJlaW8uaWQpLmN1c3RvbVBVVCh2bS5sb2dpc3RpY2EpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTG9nw61zdGljYSByZXZlcnNhIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignT2JzZXJ2YWNhb0NvbnRyb2xsZXInLCBPYnNlcnZhY2FvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBPYnNlcnZhY2FvQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8ub2JzZXJ2YWNhbztcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmFzdHJlaW9zJywgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHtvYnNlcnZhY2FvOiB2bS5vYnNlcnZhY2FvfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdPYnNlcnZhw6fDo28gc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpQ29udHJvbGxlcicsIFBpQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ucGkpIHtcbiAgICAgICAgICAgIHZtLnBpID0gdm0ucmFzdHJlaW8ucGk7XG5cbiAgICAgICAgICAgIGlmICh2bS5waS5zdGF0dXMpIHsgLy8gRm9pIGVudmlhZG8gYSByZXNwb3N0YSBkb3MgY29ycmVpb3NcbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICA9IHRydWU7XG4gICAgICAgICAgICAgICAgdm0ucGkucmFzdHJlaW9fcmVmID0geyB2YWxvcjogdm0ucmFzdHJlaW8udmFsb3IgfTtcbiAgICAgICAgICAgICAgICB2bS5waS5wYWdvX2NsaWVudGUgPSAnMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5waSA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGlzL2VkaXQnLCB2bS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHZtLnBpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBkZSBpbmZvcm1hw6fDo28gYWx0ZXJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBQSVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblBpID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5mb1BpID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBub21lOiB2bS5yYXN0cmVpby5wZWRpZG8uY2xpZW50ZS5ub21lLFxuICAgICAgICAgICAgICAgIGNlcDogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmNlcCxcbiAgICAgICAgICAgICAgICBlbmRlcmVjbzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLnJ1YSxcbiAgICAgICAgICAgICAgICBudW1lcm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5udW1lcm8sXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudG86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jb21wbGVtZW50byxcbiAgICAgICAgICAgICAgICBiYWlycm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5iYWlycm8sXG4gICAgICAgICAgICAgICAgZGF0YTogdm0ucmFzdHJlaW8uZGF0YV9lbnZpb19yZWFkYWJsZSxcbiAgICAgICAgICAgICAgICB0aXBvOiB2bS5yYXN0cmVpby5zZXJ2aWNvLFxuICAgICAgICAgICAgICAgIHN0YXR1czogKHZtLnJhc3RyZWlvLnN0YXR1cyA9PSAzKSA/ICdlJyA6ICdhJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Mi5jb3JyZWlvcy5jb20uYnIvc2lzdGVtYXMvZmFsZWNvbW9zY29ycmVpb3MvPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihpbmZvUGkpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpTGlzdENvbnRyb2xsZXInLCBQaUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBpTGlzdENvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncGlzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Jhc3RyZWlvQ29udHJvbGxlcicsIFJhc3RyZWlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBSYXN0cmVpb0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmFzdHJlaW9zJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZnJlc2ggYWxsIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmVmcmVzaEFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyYXN0cmVpb3MvcmVmcmVzaF9hbGwnKS5jdXN0b21QVVQoKS50aGVuKGZ1bmN0aW9uKHJhc3RyZWlvcykge1xuICAgICAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IHJhc3RyZWlvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdSYXN0cmVpb3MgYXR1YWxpemFkb3MgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBBdXRoQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBdXRoQ29udHJvbGxlcigkYXV0aCwgJGh0dHAsICRzdGF0ZSwgJHJvb3RTY29wZSwgZm9jdXMsIGVudlNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYXN0VXNlcicpO1xuICAgICAgICBpZiAodm0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIGZvY3VzKCdwYXNzd29yZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9jdXMoJ3VzZXJuYW1lJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9naW5cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RVc2VyJywgdm0udXNlcm5hbWUpO1xuICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB2bS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvYXV0aGVudGljYXRlL3VzZXInKTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnVzZXIpO1xuXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlcjtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQ2xpZW50ZUxpc3RDb250cm9sbGVyJywgQ2xpZW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIENsaWVudGVMaXN0Q29udHJvbGxlcihDbGllbnRlLCBGaWx0ZXIsIFRhYmxlSGVhZGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7IFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ2NsaWVudGVzJywgdm0sIHtcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLnRheHZhdCc6ICAgICAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdjbGllbnRlcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTsgXG4gXG4gICAgICAgICAgICBDbGllbnRlLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ2NsaWVudGVzLionXSxcbiAgICAgICAgICAgICAgICBvcmRlckJ5OiAgJ2NsaWVudGVzLmNyZWF0ZWRfYXQnLFxuICAgICAgICAgICAgICAgIG9yZGVyOiAgICAnREVTQycsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZhdHVyYW1lbnRvQ29udHJvbGxlcicsIEZhdHVyYW1lbnRvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBGYXR1cmFtZW50b0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5ub3RhcyA9IFtdO1xuICAgICAgICB2bS5jb2RpZ28gPSB7XG4gICAgICAgICAgICBzZXJ2aWNvOiAnMCdcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB2bS5nZW5lcmF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgbm90YXNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLm5vdGFzID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdub3Rhcy9mYXR1cmFtZW50bycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKG5vdGFzKSB7XG4gICAgICAgICAgICAgICAgdm0ubm90YXMgPSBub3RhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZ2VuZXJhdGVDb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSAnR2VyYW5kby4uLic7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcImNvZGlnb3MvZ2VyYXJcIiwgdm0uY29kaWdvLnNlcnZpY28pLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSByZXNwb25zZS5jb2RpZ287XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ2Vycm9yJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gJ0PDs2RpZ29zIGVzZ290YWRvcyEnOyBcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ0Vycm8nLCByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KCdtc2cnKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnd2FybmluZycsICdBdGVuw6fDo28nLCByZXNwb25zZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ubWVuc2FnZW0gPSByZXNwb25zZS5tc2c7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmF0dXJhciBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZhdHVyYXIgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcIm5vdGFzL2ZhdHVyYXJcIiwgcGVkaWRvX2lkKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGZhdHVyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5oYUZvcm1Db250cm9sbGVyJywgTGluaGFGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMaW5oYUZvcm1Db250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIExpbmhhKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gIFxuICAgICAgICB2bS5saW5oYV9pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0ubGluaGEgICAgPSB7fTtcbiAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG5cblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5saW5oYSAgPSB7fTsgXG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgTGluaGEuZ2V0KHZtLmxpbmhhX2lkKS50aGVuKGZ1bmN0aW9uKGxpbmhhKSB7XG4gICAgICAgICAgICAgICAgdm0ubGluaGEgID0gbGluaGE7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5oYUxpc3RDb250cm9sbGVyJywgTGluaGFMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMaW5oYUxpc3RDb250cm9sbGVyKExpbmhhLCBGaWx0ZXIsIFRhYmxlSGVhZGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7ICBcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdsaW5oYXMnLCB2bSwge1xuICAgICAgICAgICAgJ2xpbmhhcy50aXR1bG8nOiAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdsaW5oYXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7IFxuIFxuICAgICAgICAgICAgTGluaGEuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnbGluaGFzLionXSxcbiAgICAgICAgICAgICAgICBvcmRlckJ5OiAgJ2xpbmhhcy5jcmVhdGVkX2F0JyxcbiAgICAgICAgICAgICAgICBvcmRlcjogICAgJ0RFU0MnLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkYSBsaW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICAvKnZtLm9wZW5Gb3JtID0gZnVuY3Rpb24obGluaGEpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvbGluaGEvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGluaGFGb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTGluaGFGb3JtJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmhhOiBsaW5oYSB8fCB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07Ki9cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdUZW1wbGF0ZW1sQ29udHJvbGxlcicsIFRlbXBsYXRlbWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFRlbXBsYXRlbWxDb250cm9sbGVyKFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIHRlbXBsYXRlXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZVRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS51cmwpO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJ0ZW1wbGF0ZW1sL2dlcmFyXCIpLmN1c3RvbUdFVChcIlwiLCB7XG4gICAgICAgICAgICAgIHVybDogdm0udXJsXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGVtcGxhdGUgPSByZXNwb25zZS50ZW1wbGF0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLCBNZW51Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNZW51Q29udHJvbGxlcigkc3RhdGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBzdWJtZW51XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU3ViID0gZnVuY3Rpb24obWVudSkge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gbWVudSlcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWVudS5zdWJPcGVuID0gIW1lbnUuc3ViT3BlbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBpbmZlcmlvciBtZW51XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAqIEBwYXJhbSBzdWJcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5JbmYgPSBmdW5jdGlvbihtZW51LCBzdWIpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZW51LnN1YiwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtICE9IHN1YilcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3ViLnN1Yk9wZW4gPSAhc3ViLnN1Yk9wZW47XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlIG1lbnUgaXRlbnNcbiAgICAgICAgICogQHR5cGUgeypbXX1cbiAgICAgICAgICovXG4gICAgICAgIHZtLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGFpbmVsJyxcbiAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmRhc2hib2FyZCcpLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1kYXNoYm9hcmQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGVkaWRvcycsXG4gICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wZWRpZG9zLmluZGV4JyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWN1YmVzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NsaWVudGVzJyxcbiAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmNsaWVudGVzLmluZGV4JyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVzZXJzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1Byb2R1dG9zJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtZHJvcGJveCcsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdQcm9kdXRvcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTGluaGFzJywgaWNvbjogJ2ZhLWxpc3QtYWx0Jywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wcm9kdXRvcy5saW5oYXMuaW5kZXgnKSB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTWFyY2FzJywgaWNvbjogJ2ZhLWxpc3QtYWx0JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnQXNzaXN0w6puY2lhJywgaWNvbjogJ2ZhLXdyZW5jaCcgfSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92aW1lbnRhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtZXhjaGFuZ2UnLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRW50cmFkYScsIGljb246ICdmYS1tYWlsLXJlcGx5JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnU2HDrWRhJywgaWNvbjogJ2ZhLW1haWwtZm9yd2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0RlZmVpdG8nLCBpY29uOiAnZmEtY2hhaW4tYnJva2VuJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnVHJhbnNwb3J0YWRvcmFzJywgaWNvbjogJ2ZhLXRydWNrJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRm9ybmVjZWRvcmVzJywgaWNvbjogJ2ZhLWJ1aWxkaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRm9ybWFzIGRlIHBhZ2FtZW50bycsIGljb246ICdmYS1tb25leScgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ09wZXJhw6fDo28gZmlzY2FsJywgaWNvbjogJ2ZhLXBlcmNlbnQnIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRmluYW5jZWlybycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLW1vbmV5JyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0NvbnRhcyBhIHBhZ2FyL3JlY2ViZXInLCBpY29uOiAnZmEtY3JlZGl0LWNhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdQbGFubyBkZSBjb250YXMnLCBpY29uOiAnZmEtbGlzdCcgfSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmFzdHJlaW9zJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJywgJ2F0ZW5kaW1lbnRvJ10sXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmFzdHJlaW9zIGltcG9ydGFudGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS10cnVjaycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmF0ZW5kaW1lbnRvLnJhc3RyZWlvJylcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQSVxcJ3MgcGVuZGVudGVzJyAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmF0ZW5kaW1lbnRvLnBpcycpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGV2b2x1w6fDtWVzIHBlbmRlbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdW5kbycsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmF0ZW5kaW1lbnRvLmRldm9sdWNvZXMnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1JlbGF0w7NyaW9zJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtcGllLWNoYXJ0JyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnQ2FpeGEgZGnDoXJpbycsIGljb246ICdmYS1tb25leSd9LFxuICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdJQ01TIG1lbnNhbCcsIGljb246ICdmYS1maWxlLXBkZi1vJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hZG1pbi5pY21zJyl9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdDb25maWd1cmHDp8O1ZXMnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1jb2cnLFxuICAgICAgICAgICAgICAgIHJvbGVzOiBbJ2FkbWluJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnTWFya2V0aW5nJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtYnVsbGhvcm4nLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdUZW1wbGF0ZSBNTCcsIGljb246ICdmYS1jbGlwYm9hcmQnLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLm1hcmtldGluZy50ZW1wbGF0ZW1sJyl9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0ludGVybm8nLCBcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtZGVza3RvcCcsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGFkb3MgZGEgZW1wcmVzYScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtaW5mbydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbXBvc3RvcyBkYSBub3RhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1wZXJjZW50J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1VzdcOhcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5pbnRlcm5vLnVzdWFyaW9zLmluZGV4JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBTZWFyY2hDb250cm9sbGVyKVxuICAgICAgICAuZmlsdGVyKCdoaWdobGlnaHQnLCBmdW5jdGlvbigkc2NlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odGV4dCwgcGhyYXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBocmFzZSkgdGV4dCA9IFN0cmluZyh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoJygnK3BocmFzZSsnKScsICdnaScpLFxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ1bmRlcmxpbmVcIj4kMTwvc3Bhbj4nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBTZWFyY2hDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VhcmNoID0gJyc7XG4gICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xvc2Ugc2VhcmNoIG92ZXJsYXlcbiAgICAgICAgICovXG4gICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJjbG9zZVNlYXJjaFwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBzZWFyY2ggcmVzdWx0c1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLnNlYXJjaC5sZW5ndGggPD0gMykge1xuICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoXCJzZWFyY2hcIikuY3VzdG9tR0VUKFwiXCIsIHtzZWFyY2g6IHZtLnNlYXJjaH0pLnRoZW4oZnVuY3Rpb24oYnVzY2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0gYnVzY2E7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVcGxvYWRDb250cm9sbGVyJywgVXBsb2FkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVcGxvYWRDb250cm9sbGVyKFVwbG9hZCwgdG9hc3RlciwgZW52U2VydmljZSwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgbm90YXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGZpbGVzXG4gICAgICAgICAqL1xuICAgICAgICB2bS51cGxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIil9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnF1aXZvczogZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnc3RvcC1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1VwbG9hZCBjb25jbHXDrWRvJywgcmVzcG9uc2UuZGF0YS5tc2cpO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgXCJFcnJvIG5vIHVwbG9hZCFcIiwgXCJFcnJvIGFvIGVudmlhciBhcnF1aXZvcywgdGVudGUgbm92YW1lbnRlIVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlbmhhRm9ybUNvbnRyb2xsZXInLCBTZW5oYUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFNlbmhhRm9ybUNvbnRyb2xsZXIoU2VuaGEsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlbmhhID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuc2VuaGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU2VuaGEuc2F2ZSh2bS5zZW5oYSwgdm0uc2VuaGEuaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTZW5oYSBzYWx2YSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZW5oYUxpc3RDb250cm9sbGVyJywgU2VuaGFMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBTZW5oYUxpc3RDb250cm9sbGVyKFNlbmhhLCBUYWJsZUhlYWRlciwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdzZW5oYXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gXG4gICAgICAgICAgICBTZW5oYS5mcm9tVXNlcigkc3RhdGVQYXJhbXMuaWQsIHtcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlLCBcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBYnJlIG8gZm9ybXVsw6FyaW8gZGUgc2VuaGFcbiAgICAgICAgICogXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlbkZvcm0gPSBmdW5jdGlvbihzZW5oYSkge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9zZW5oYS9mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZW5oYUZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdTZW5oYUZvcm0nLCBcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbmhhOiBzZW5oYSB8fCB7IHVzdWFyaW9faWQ6ICRzdGF0ZVBhcmFtcy5pZCB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSB0cnVlKSB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGEgc2VuaGFcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbSAge2ludH0gc2VuaGEgXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9ICAgICAgIFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBTZW5oYS5kZWxldGUoaWQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU2VuaGEgZGVsZXRhZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVc3VhcmlvRm9ybUNvbnRyb2xsZXInLCBVc3VhcmlvRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXN1YXJpb0Zvcm1Db250cm9sbGVyKFVzdWFyaW8sICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnVzdWFyaW8gPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5nRGlhbG9nRGF0YS51c3VhcmlvKTtcblxuICAgICAgICAvLyBBcGVuYXMgcGFyYSBlZGnDp8Ojb1xuICAgICAgICB2bS51c3VhcmlvLm5vdmFzUm9sZXMgPSBbXTtcbiAgICAgICAgaWYgKHZtLnVzdWFyaW8uaGFzT3duUHJvcGVydHkoJ3JvbGVzJykpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS51c3VhcmlvLnJvbGVzLCBmdW5jdGlvbihyb2xlKSB7XG4gICAgICAgICAgICAgICAgdm0udXN1YXJpby5ub3Zhc1JvbGVzW3JvbGUuaWRdID0gcm9sZS5pZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIG8gdXN1w6FyaW9cbiAgICAgICAgICogXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgVXN1YXJpby5zYXZlKHZtLnVzdWFyaW8sIHZtLnVzdWFyaW8uaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdVc3XDoXJpbyBzYWx2byBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyIFxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXN1YXJpb0xpc3RDb250cm9sbGVyJywgVXN1YXJpb0xpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFVzdWFyaW9MaXN0Q29udHJvbGxlcihVc3VhcmlvLCBUYWJsZUhlYWRlciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCd1c3VhcmlvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgVXN1YXJpby5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBYnJlIG8gZm9ybXVsw6FyaW8gZG8gdXN1w6FyaW9cbiAgICAgICAgICogXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlbkZvcm0gPSBmdW5jdGlvbih1c3VhcmlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL3VzdWFyaW8vZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXN1YXJpb0Zvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdVc3VhcmlvRm9ybScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB1c3VhcmlvOiB1c3VhcmlvIHx8IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSB0cnVlKSB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIG8gdXN1w6FyaW9cbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbSAge2ludH0gIGlkIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSAgICBcbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgVXN1YXJpby5kZWxldGUoaWQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnVXN1w6FyaW8gZGVsZXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7IFxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXInLCBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyLCBuZ0RpYWxvZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuIFxuICAgICAgICB2bS5jb21lbnRhcmlvcyA9IFtdO1xuICAgICAgICB2bS5jb21lbnRhcmlvID0gbnVsbDtcbiAgICAgICAgdm0ucGVkaWRvX2lkID0gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuIFxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIGNvbWVudGFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ2NvbWVudGFyaW9zJykuY3VzdG9tR0VUKHZtLnBlZGlkb19pZCkudGhlbihmdW5jdGlvbihjb21lbnRhcmlvcykge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvcyA9IGNvbWVudGFyaW9zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIGNvbWVudGFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2NvbWVudGFyaW9zJykuY3VzdG9tUE9TVCh7XG4gICAgICAgICAgICAgICAgICAgICdwZWRpZG9faWQnOiBwZWRpZG8sXG4gICAgICAgICAgICAgICAgICAgICdjb21lbnRhcmlvJzogdm0uY29tZW50YXJpb1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0uY29tZW50YXJpbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdm0uZm9ybUNvbWVudGFyaW8uJHNldFByaXN0aW5lKCk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0NvbWVudMOhcmlvIGNhZGFzdHJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVzdHJveSBjb21lbnTDoXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKGNvbWVudGFyaW8pIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuQ29uZmlybSh7IFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnJyArIFxuICAgICAgICAgICAgICAgICc8cD48aSBjbGFzcz1cImZhIGZhLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlXCI+PC9pPiZuYnNwOyBUZW0gY2VydGV6YSBxdWUgZGVzZWphIGV4Y2x1aXIgbyBjb21lbnTDoXJpbz88L3A+JyArIFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibmdkaWFsb2ctYnV0dG9uc1wiPicgKyBcbiAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuZ2RpYWxvZy1idXR0b24gbmdkaWFsb2ctYnV0dG9uLXNlY29uZGFyeVwiIG5nLWNsaWNrPVwiY2xvc2VUaGlzRGlhbG9nKDApXCI+TsOjbzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5nZGlhbG9nLWJ1dHRvbiBuZ2RpYWxvZy1idXR0b24tcHJpbWFyeVwiIG5nLWNsaWNrPVwiY29uZmlybSgxKVwiPlNpbTwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgIHBsYWluOiB0cnVlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnY29tZW50YXJpb3MnLCBjb21lbnRhcmlvKS5jdXN0b21ERUxFVEUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdpbmZvJywgJ1N1Y2Vzc28hJywgJ0NvbWVudMOhcmlvIGV4Y2x1w61kbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0RldGFsaGVDb250cm9sbGVyJywgUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgUGVkaWRvKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gIFxuICAgICAgICB2bS5wZWRpZG9faWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLnBlZGlkbyAgICA9IHt9OyBcbiAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG5cblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5wZWRpZG8gID0ge307IFxuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFBlZGlkby5nZXQodm0ucGVkaWRvX2lkKS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkbyAgPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWx0ZXJhciBzdGF0dXMgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jaGFuZ2VTdGF0dXMgPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3Mvc3RhdHVzJywgdm0ucGVkaWRvLmlkKS5jdXN0b21QVVQoe1xuICAgICAgICAgICAgICAgICdzdGF0dXMnOiBzdGF0dXNcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTsgXG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU3RhdHVzIGRvIHBlZGlkbyBhbHRlcmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcmlvcml6YXIgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5wcmlvcml0aXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zL3ByaW9yaWRhZGUnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3ByaW9yaXphZG8nOiB0cnVlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkbyA9IHBlZGlkbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7IFxuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBwcmlvcml6YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXIgcHJpb3JpZGFkZSBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnVucHJpb3JpdGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9wcmlvcmlkYWRlJywgdm0ucGVkaWRvLmlkKS5jdXN0b21QVVQoe1xuICAgICAgICAgICAgICAgICdwcmlvcml6YWRvJzogZmFsc2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTsgXG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2luZm8nLCAnU3VjZXNzbyEnLCAnUHJpb3JpZGFkZSByZW1vdmlkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvTGlzdENvbnRyb2xsZXInLCBQZWRpZG9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9MaXN0Q29udHJvbGxlcihQZWRpZG8sIEZpbHRlciwgVGFibGVIZWFkZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdwZWRpZG9zJywgdm0sIHtcbiAgICAgICAgICAgICdwZWRpZG9zLmNvZGlnb19tYXJrZXRwbGFjZSc6ICdMSUtFJyxcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICdMSUtFJ1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncGVkaWRvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTsgXG4gXG4gICAgICAgICAgICBQZWRpZG8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvcy4qJ10sXG4gICAgICAgICAgICAgICAgb3JkZXJCeTogICdwZWRpZG9zLmNyZWF0ZWRfYXQnLFxuICAgICAgICAgICAgICAgIG9yZGVyOiAgICAnREVTQycsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlLCBcbiAgICAgICAgICAgICAgICBqb2luOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlOiAgICAgICAnY2xpZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25UYWJsZTogICAgICdjbGllbnRlcy5pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogICAgJz0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VGFibGU6ICdwZWRpZG9zLmNsaWVudGVfaWQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlOiAgICAgICAncGVkaWRvX25vdGFzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uVGFibGU6ICAgICAncGVkaWRvX25vdGFzLnBlZGlkb19pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogICAgJz0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VGFibGU6ICdwZWRpZG9zLmlkJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldG9ybmEgYSBjbGFzc2UgZGUgc3RhdHVzIGRvIHBlZGlkbyBcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbSAge1BlZGlkb30gcGVkaWRvIFxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnBhcnNlU3RhdHVzQ2xhc3MgPSBmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgIHN3aXRjaCAocGVkaWRvLnN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdpbmZvJztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnd2FybmluZyc7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGFuZ2VyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
