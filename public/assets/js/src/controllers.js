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
                        sref: $state.href('app.interno.usuarios')
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

    MinhaSenhaController.$inject = ["Restangular"];
    angular
        .module('MeuTucano')
        .controller('MinhaSenhaController', MinhaSenhaController);

    function MinhaSenhaController(Restangular) {
        var vm = this;

        vm.senhas = [];
        vm.loading = false;

        /**
         * Load senhas
         */
        vm.load = function() {
            vm.senhas = [];
            vm.loading = true;

            Restangular.one('minhas-senhas').getList().then(function(senhas) {
                vm.senhas = senhas;
                vm.loading = false;
            });
        };
        vm.load();
    }

})();
(function() {
    'use strict';

    SenhaEditarController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('SenhaEditarController', SenhaEditarController);

    function SenhaEditarController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.senha = angular.copy($scope.ngDialogData.senha);

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('senhas', vm.senha.id).customPUT(vm.senha).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Senha editada com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    SenhaNovaController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('SenhaNovaController', SenhaNovaController);

    function SenhaNovaController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.senha = {};
        vm.senha.usuario_id = $scope.ngDialogData.user_id;

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('senhas').customPOST(vm.senha).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Senha criada com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    UsuarioController.$inject = ["$rootScope", "Restangular", "ngDialog", "toaster"];
    angular
        .module('MeuTucano')
        .controller('UsuarioController', UsuarioController);

    function UsuarioController($rootScope, Restangular, ngDialog, toaster) {
        var vm = this;

        vm.usuarios = [];
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
         * Load usuarios
         */
        vm.load = function() {
            vm.usuarios = [];
            vm.loading = true;

            Restangular.all('usuarios').getList().then(function(usuarios) {
                vm.usuarios = usuarios;
                vm.loading = false;
            });
        };
        vm.load();

        /**
         * Edit usuario
         */
        vm.editar = function(usuario) {
            ngDialog.open({
                template: 'views/interno/partials/usuario_form.html',
                className: 'ngdialog-theme-default',
                controller: 'UsuarioEditarController',
                controllerAs: 'Form',
                data: {
                    usuario: usuario
                }
            });
        };

        /**
         * Create usuario
         */
        vm.create = function() {
            ngDialog.open({
                template: 'views/interno/partials/usuario_form.html',
                className: 'ngdialog-theme-default',
                controller: 'UsuarioNovoController',
                controllerAs: 'Form'
            });
        };

        /**
         * Delete user
         *
         * @param user_id
         */
        vm.destroy = function(user_id) {
            Restangular.one('usuarios', user_id).customDELETE().then(function() {
                $rootScope.$broadcast('upload');
                toaster.pop('success', 'Sucesso!', 'Usuário deletado com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    UsuarioEditarController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('UsuarioEditarController', UsuarioEditarController);

    function UsuarioEditarController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.usuario = angular.copy($scope.ngDialogData.usuario);
        vm.usuario.novasRoles = [];

        angular.forEach(vm.usuario.roles, function(role) {
            vm.usuario.novasRoles[role.id] = role.id;
        });

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('usuarios', vm.usuario.id).customPUT(vm.usuario).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Usuário editado com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    UsuarioNovoController.$inject = ["Restangular", "$rootScope", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('UsuarioNovoController', UsuarioNovoController);

    function UsuarioNovoController(Restangular, $rootScope, $scope, toaster) {
        var vm = this;

        vm.usuario = {};

        /**
         * Save the observation
         */
        vm.save = function() {
            Restangular.one('usuarios').customPOST(vm.usuario).then(function() {
                $rootScope.$broadcast('upload');
                $scope.closeThisDialog();
                toaster.pop('success', 'Sucesso!', 'Usuário criado com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    UsuarioSenhaController.$inject = ["$rootScope", "$stateParams", "Restangular", "ngDialog", "toaster"];
    angular
        .module('MeuTucano')
        .controller('UsuarioSenhaController', UsuarioSenhaController);

    function UsuarioSenhaController($rootScope, $stateParams, Restangular, ngDialog, toaster) {
        var vm = this;

        vm.senhas = [];
        vm.loading = false;
        vm.user_id = $stateParams.id;

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
         * Load senhas
         */
        vm.load = function() {
            vm.senhas = [];
            vm.loading = true;

            Restangular.one('senhas/usuario', vm.user_id).getList().then(function(senhas) {
                vm.senhas = senhas;
                vm.loading = false;
            });
        };
        vm.load();

        /**
         * Edit usuario
         */
        vm.editar = function(senha) {
            ngDialog.open({
                template: 'views/interno/partials/senha_form.html',
                className: 'ngdialog-theme-default',
                controller: 'SenhaEditarController',
                controllerAs: 'Form',
                data: {
                    senha: senha
                }
            });
        };

        /**
         * Create usuario
         */
        vm.create = function() {
            ngDialog.open({
                template: 'views/interno/partials/senha_form.html',
                className: 'ngdialog-theme-default',
                controller: 'SenhaNovaController',
                controllerAs: 'Form',
                data: {
                    user_id: vm.user_id
                }
            });
        };

        /**
         * Delete user
         *
         * @param senha_id
         */
        vm.destroy = function(senha_id) {
            Restangular.one('senhas', senha_id).customDELETE().then(function() {
                $rootScope.$broadcast('upload');
                toaster.pop('success', 'Sucesso!', 'Senha deletada com sucesso!');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9EZXZvbHVjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9FZGl0YXJDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRW1haWxDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vTG9naXN0aWNhQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL09ic2VydmFjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlMaXN0Q29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL1Jhc3RyZWlvQ29udHJvbGxlci5qcyIsIkF1dGgvQXV0aENvbnRyb2xsZXIuanMiLCJGYXR1cmFtZW50by9GYXR1cmFtZW50b0NvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvTGlzdENvbnRyb2xsZXIuanMiLCJQYXJ0aWFscy9NZW51Q29udHJvbGxlci5qcyIsIlBhcnRpYWxzL1NlYXJjaENvbnRyb2xsZXIuanMiLCJQYXJ0aWFscy9VcGxvYWRDb250cm9sbGVyLmpzIiwiSW50ZXJuby9NaW5oYVNlbmhhQ29udHJvbGxlci5qcyIsIkludGVybm8vU2VuaGFFZGl0YXJDb250cm9sbGVyLmpzIiwiSW50ZXJuby9TZW5oYU5vdmFDb250cm9sbGVyLmpzIiwiSW50ZXJuby9Vc3VhcmlvQ29udHJvbGxlci5qcyIsIkludGVybm8vVXN1YXJpb0VkaXRhckNvbnRyb2xsZXIuanMiLCJJbnRlcm5vL1VzdWFyaW9Ob3ZvQ29udHJvbGxlci5qcyIsIkludGVybm8vVXN1YXJpb1NlbmhhQ29udHJvbGxlci5qcyIsIk1hcmtldGluZy9UZW1wbGF0ZW1sQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxpQkFBQTs7SUFFQSxTQUFBLGNBQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBLFNBQUEsc0JBQUEsVUFBQSxhQUFBLFdBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsV0FBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsZUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsZUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7OztRQUdBLEdBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxlQUFBOztZQUVBLFlBQUEsSUFBQSxlQUFBLFlBQUEsS0FBQSxTQUFBLE9BQUE7Z0JBQ0EsR0FBQSxRQUFBO2dCQUNBLEdBQUEsZUFBQTs7O1FBR0EsR0FBQTs7Ozs7UUFLQSxVQUFBLFdBQUE7WUFDQSxHQUFBO1dBQ0E7Ozs7O1FBS0EsR0FBQSxhQUFBLFdBQUE7WUFDQSxHQUFBLGFBQUE7WUFDQSxNQUFBOzs7Ozs7UUFNQSxXQUFBLElBQUEsZUFBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBOzs7Ozs7UUFNQSxHQUFBLFNBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxLQUFBLFdBQUE7Z0JBQ0EsYUFBQSxXQUFBO2dCQUNBLFdBQUEsZ0JBQUE7Z0JBQ0EsV0FBQSxjQUFBOztnQkFFQSxPQUFBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxXQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGdCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7O1FBT0EsR0FBQSxhQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGtCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7OztRQVFBLEdBQUEsZ0JBQUEsU0FBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBO2dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7WUFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEseUJBQUEsY0FBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7UUFPQSxHQUFBLFFBQUEsU0FBQSxXQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFdBQUE7b0JBQ0EsT0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxLQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxZQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxZQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxTQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxXQUFBLFNBQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLEdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7UUFRQSxHQUFBLGFBQUEsU0FBQSxVQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxVQUFBOzs7Ozs7OztBQ3JOQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsc0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O0FDUkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLFlBQUEsYUFBQSxZQUFBLFNBQUEsc0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O1FBS0EsR0FBQSxvQkFBQSxXQUFBO1lBQ0EsSUFBQSxPQUFBO2dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7WUFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEsc0JBQUEscUJBQUE7Ozs7OztBQ2xCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBO1lBQ0EsR0FBQSxXQUFBO2VBQ0E7WUFDQSxHQUFBLFlBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Z0JBQ0EsY0FBQSxFQUFBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLGNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxtQkFBQSxHQUFBLFNBQUEsSUFBQSxVQUFBLEdBQUEsV0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDakNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDJCQUFBOztJQUVBLFNBQUEsd0JBQUEsWUFBQSxhQUFBLFVBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFlBQUE7UUFDQSxHQUFBLFVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsY0FBQSxVQUFBLEtBQUEsU0FBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7O0FDckNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLG9CQUFBOztJQUVBLFNBQUEsaUJBQUEsYUFBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBLFNBQUEsT0FBQSxTQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsSUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxTQUFBO2dCQUNBLFlBQUEsR0FBQSxTQUFBO2dCQUNBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLEtBQUEsR0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQTs7O1lBR0EsWUFBQSxJQUFBLGtCQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztBQzVCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxtQkFBQTs7SUFFQSxTQUFBLGdCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLElBQUEsWUFBQTtnQkFDQSxPQUFBLEdBQUE7OztZQUdBLFlBQUEsSUFBQSxlQUFBLEdBQUEsV0FBQSxXQUFBLFdBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBOztZQUVBLElBQUEsR0FBQSxVQUFBLE1BQUE7Z0JBQ0EsR0FBQSxXQUFBO21CQUNBO2dCQUNBLEdBQUEseUJBQUE7Z0JBQ0EsR0FBQSxVQUFBLGVBQUEsRUFBQSxPQUFBLEdBQUEsU0FBQTtnQkFDQSxRQUFBLElBQUEsR0FBQTs7Ozs7OztRQU9BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLG1CQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxXQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsYUFBQSxPQUFBLGFBQUEsU0FBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxhQUFBLE9BQUEsYUFBQSxTQUFBLElBQUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxhQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsZ0JBQUE7O0lBRUEsU0FBQSxhQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUEsU0FBQSxzQkFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTs7UUFFQSxJQUFBLEdBQUEsU0FBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLEdBQUEsU0FBQTs7WUFFQSxJQUFBLEdBQUEsR0FBQSxRQUFBO2dCQUNBLEdBQUEsV0FBQTttQkFDQTtnQkFDQSxHQUFBLGtCQUFBO2dCQUNBLEdBQUEsR0FBQSxlQUFBLEVBQUEsT0FBQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxHQUFBLGVBQUE7O2VBRUE7WUFDQSxHQUFBLEtBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxZQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7O1FBT0EsR0FBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFNBQUE7Z0JBQ0EsVUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUEsT0FBQSxRQUFBO2dCQUNBLEtBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxVQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsUUFBQSxHQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBLGFBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsUUFBQSxDQUFBLEdBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsUUFBQSxLQUFBLDZEQUFBLHFCQUFBOzs7OztBQzFEQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTs7SUFFQSxTQUFBLGlCQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztBQ3JDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTs7SUFFQSxTQUFBLG1CQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLGFBQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsYUFBQSxXQUFBO1lBQ0EsR0FBQSxZQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSx5QkFBQSxZQUFBLEtBQUEsU0FBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFVBQUE7O2dCQUVBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7QUNsREEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLE9BQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxhQUFBLFFBQUE7UUFDQSxJQUFBLEdBQUEsVUFBQTtZQUNBLE1BQUE7ZUFDQTtZQUNBLE1BQUE7Ozs7OztRQU1BLEdBQUEsUUFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLGFBQUEsUUFBQSxZQUFBLEdBQUE7WUFDQSxJQUFBLGNBQUE7Z0JBQ0EsVUFBQSxHQUFBO2dCQUNBLFVBQUEsR0FBQTs7O1lBR0EsTUFBQSxNQUFBLGFBQUEsS0FBQSxXQUFBO2dCQUNBLE9BQUEsTUFBQSxJQUFBLFdBQUEsS0FBQSxZQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLElBQUEsT0FBQSxLQUFBLFVBQUEsU0FBQSxLQUFBOztnQkFFQSxhQUFBLFFBQUEsUUFBQTtnQkFDQSxXQUFBLGdCQUFBOztnQkFFQSxXQUFBLGNBQUEsU0FBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7Ozs7O0FDdkNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsWUFBQSxhQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBO1lBQ0EsU0FBQTs7UUFFQSxHQUFBLFVBQUE7UUFDQSxHQUFBLGFBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsUUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEscUJBQUEsVUFBQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFFBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsZUFBQSxXQUFBO1lBQ0EsR0FBQSxPQUFBLFdBQUE7O1lBRUEsWUFBQSxJQUFBLGlCQUFBLEdBQUEsT0FBQSxTQUFBLFlBQUEsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxPQUFBLFdBQUEsU0FBQTs7Z0JBRUEsSUFBQSxTQUFBLGVBQUEsVUFBQTtvQkFDQSxHQUFBLE9BQUEsV0FBQTtvQkFDQSxRQUFBLElBQUEsU0FBQSxRQUFBLFNBQUE7OztnQkFHQSxJQUFBLFNBQUEsZUFBQSxRQUFBO29CQUNBLFFBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQTs7Z0JBRUEsR0FBQSxPQUFBLFdBQUEsU0FBQTs7Ozs7OztRQU9BLEdBQUEsVUFBQSxTQUFBLFdBQUE7WUFDQSxZQUFBLElBQUEsaUJBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3JFQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSw4QkFBQTs7SUFFQSxTQUFBLDJCQUFBLFlBQUEsY0FBQSxhQUFBLFNBQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGNBQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUEsYUFBQTtRQUNBLEdBQUEsVUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxlQUFBLFVBQUEsR0FBQSxXQUFBLEtBQUEsU0FBQSxhQUFBO2dCQUNBLEdBQUEsVUFBQTtnQkFDQSxHQUFBLGNBQUE7Ozs7UUFJQSxHQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxTQUFBLFFBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLGVBQUEsV0FBQTtvQkFDQSxhQUFBO29CQUNBLGNBQUEsR0FBQTttQkFDQSxLQUFBLFdBQUE7O2dCQUVBLEdBQUEsVUFBQTtnQkFDQSxHQUFBLGFBQUE7Z0JBQ0EsR0FBQSxlQUFBO2dCQUNBLEdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztRQU9BLEdBQUEsVUFBQSxTQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsU0FBQSxZQUFBO2dCQUNBLFVBQUE7Z0JBQ0E7Z0JBQ0E7Z0JBQ0E7Z0JBQ0E7Z0JBQ0E7Z0JBQ0EsT0FBQTtlQUNBLEtBQUEsV0FBQTtnQkFDQSxZQUFBLElBQUEsZUFBQSxZQUFBLGVBQUEsS0FBQSxXQUFBO29CQUNBLEdBQUEsVUFBQTtvQkFDQSxHQUFBLGFBQUE7b0JBQ0EsR0FBQTtvQkFDQSxRQUFBLElBQUEsUUFBQSxZQUFBOzs7Ozs7QUMvRUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsMkJBQUE7O0lBRUEsU0FBQSx3QkFBQSxZQUFBLGNBQUEsYUFBQSxRQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsWUFBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxPQUFBLElBQUEsR0FBQSxXQUFBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsVUFBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7O1FBS0EsR0FBQSxlQUFBLFNBQUEsUUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsa0JBQUEsR0FBQSxPQUFBLElBQUEsVUFBQTtnQkFDQSxVQUFBO2VBQ0EsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7O1FBT0EsR0FBQSxhQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLHNCQUFBLEdBQUEsT0FBQSxJQUFBLFVBQUE7Z0JBQ0EsY0FBQTtlQUNBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztRQU9BLEdBQUEsZUFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxzQkFBQSxHQUFBLE9BQUEsSUFBQSxVQUFBO2dCQUNBLGNBQUE7ZUFDQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQSxRQUFBLFlBQUE7Ozs7OztBQ25FQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx3QkFBQTs7SUFFQSxTQUFBLHFCQUFBLFFBQUEsUUFBQSxhQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGFBQUEsT0FBQSxLQUFBLFdBQUEsSUFBQTtZQUNBLDhCQUFBO1lBQ0EsOEJBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFdBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsT0FBQSxRQUFBO2dCQUNBLFVBQUEsQ0FBQTtnQkFDQSxVQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsVUFBQSxHQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2dCQUNBLE1BQUE7b0JBQ0E7d0JBQ0EsYUFBQTt3QkFDQSxhQUFBO3dCQUNBLGFBQUE7d0JBQ0EsYUFBQTs7b0JBRUE7d0JBQ0EsYUFBQTt3QkFDQSxhQUFBO3dCQUNBLGFBQUE7d0JBQ0EsYUFBQTs7O2VBR0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7OztBQ3REQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxrQkFBQTs7SUFFQSxTQUFBLGVBQUEsUUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7OztRQU9BLEdBQUEsVUFBQSxTQUFBLE1BQUE7WUFDQSxRQUFBLFFBQUEsR0FBQSxPQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLFFBQUE7b0JBQ0EsS0FBQSxVQUFBOzs7WUFHQSxLQUFBLFVBQUEsQ0FBQSxLQUFBOzs7Ozs7Ozs7UUFTQSxHQUFBLFVBQUEsU0FBQSxNQUFBLEtBQUE7WUFDQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLFFBQUE7b0JBQ0EsS0FBQSxVQUFBOzs7WUFHQSxJQUFBLFVBQUEsQ0FBQSxJQUFBOzs7Ozs7O1FBT0EsR0FBQSxRQUFBO1lBQ0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBLE9BQUEsS0FBQTtnQkFDQSxNQUFBOztZQUVBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQSxPQUFBLEtBQUE7Z0JBQ0EsTUFBQTs7WUFFQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7O1lBRUE7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLFlBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsVUFBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLGVBQUEsTUFBQTs7O1lBR0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLFdBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsU0FBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxXQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLGdCQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLHVCQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7OztZQUdBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxLQUFBO29CQUNBLEVBQUEsT0FBQSwwQkFBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxtQkFBQSxNQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxDQUFBLFNBQUE7Z0JBQ0EsS0FBQTtvQkFDQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7O29CQUVBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBOzs7O1lBSUE7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsQ0FBQSxPQUFBLGdCQUFBLE1BQUE7b0JBQ0EsQ0FBQSxPQUFBLGVBQUEsTUFBQSxpQkFBQSxNQUFBLE9BQUEsS0FBQTs7O1lBR0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsQ0FBQTs7WUFFQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxDQUFBLE9BQUEsZUFBQSxNQUFBLGdCQUFBLE1BQUEsT0FBQSxLQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7O29CQUVBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBOzs7Ozs7Ozs7QUNsSkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsb0JBQUE7U0FDQSxPQUFBLHNCQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsU0FBQSxNQUFBLFFBQUE7Z0JBQ0EsSUFBQSxRQUFBLE9BQUEsT0FBQSxNQUFBLFFBQUEsSUFBQSxPQUFBLElBQUEsT0FBQSxLQUFBO29CQUNBOztnQkFFQSxPQUFBLEtBQUEsWUFBQTs7OztJQUlBLFNBQUEsaUJBQUEsYUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsU0FBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLGVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxlQUFBOzs7Ozs7UUFNQSxHQUFBLFFBQUEsV0FBQTtZQUNBLFdBQUEsV0FBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxJQUFBLEdBQUEsT0FBQSxVQUFBLEdBQUE7Z0JBQ0EsR0FBQSxpQkFBQTttQkFDQTtnQkFDQSxHQUFBLGVBQUE7O2dCQUVBLFlBQUEsSUFBQSxVQUFBLFVBQUEsSUFBQSxDQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsU0FBQSxPQUFBO29CQUNBLEdBQUEsZUFBQTtvQkFDQSxHQUFBLGlCQUFBOzs7Ozs7O0FDcERBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLG9CQUFBOztJQUVBLFNBQUEsaUJBQUEsUUFBQSxTQUFBLFlBQUEsWUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7OztRQU9BLEdBQUEsU0FBQSxVQUFBLE9BQUE7WUFDQSxJQUFBLFNBQUEsTUFBQSxRQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBLE9BQUE7b0JBQ0EsS0FBQSxXQUFBLEtBQUEsWUFBQTtvQkFDQSxTQUFBLENBQUEsZUFBQSxXQUFBLGFBQUEsUUFBQTtvQkFDQSxNQUFBO3dCQUNBLFVBQUE7O21CQUVBLFFBQUEsVUFBQSxVQUFBO29CQUNBLFdBQUEsV0FBQTtvQkFDQSxXQUFBLFdBQUE7b0JBQ0EsUUFBQSxJQUFBLFdBQUEsb0JBQUEsU0FBQSxLQUFBO21CQUNBLE1BQUEsWUFBQTtvQkFDQSxRQUFBLElBQUEsU0FBQSxtQkFBQTs7Ozs7OztBQzdCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx3QkFBQTs7SUFFQSxTQUFBLHFCQUFBLGFBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxTQUFBO1FBQ0EsR0FBQSxVQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxTQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxpQkFBQSxVQUFBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsUUFBQSxRQUFBLEtBQUEsT0FBQSxhQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFVBQUEsR0FBQSxNQUFBLElBQUEsVUFBQSxHQUFBLE9BQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ25CQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxRQUFBO1FBQ0EsR0FBQSxNQUFBLGFBQUEsT0FBQSxhQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFVBQUEsV0FBQSxHQUFBLE9BQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3BCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxxQkFBQTs7SUFFQSxTQUFBLGtCQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLFlBQUEsVUFBQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFdBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsU0FBQSxTQUFBLFNBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFNBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxVQUFBLFNBQUEsU0FBQTtZQUNBLFlBQUEsSUFBQSxZQUFBLFNBQUEsZUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQzFFQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSwyQkFBQTs7SUFFQSxTQUFBLHdCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFFBQUEsYUFBQTs7UUFFQSxRQUFBLFFBQUEsR0FBQSxRQUFBLE9BQUEsU0FBQSxNQUFBO1lBQ0EsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFlBQUEsR0FBQSxRQUFBLElBQUEsVUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3hCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx5QkFBQTs7SUFFQSxTQUFBLHNCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFlBQUEsV0FBQSxHQUFBLFNBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ25CQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSwwQkFBQTs7SUFFQSxTQUFBLHVCQUFBLFlBQUEsY0FBQSxhQUFBLFVBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFVBQUEsYUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxTQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxrQkFBQSxHQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsU0FBQSxTQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLE9BQUE7Ozs7Ozs7O1FBUUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFNBQUEsR0FBQTs7Ozs7Ozs7OztRQVVBLEdBQUEsVUFBQSxTQUFBLFVBQUE7WUFDQSxZQUFBLElBQUEsVUFBQSxVQUFBLGVBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUM5RUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxhQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztRQUtBLEdBQUEsbUJBQUEsV0FBQTtZQUNBLFFBQUEsSUFBQSxHQUFBOztZQUVBLFlBQUEsSUFBQSxvQkFBQSxVQUFBLElBQUE7Y0FDQSxLQUFBLEdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFdBQUEsU0FBQTs7Ozs7S0FLQSIsImZpbGUiOiJjb250cm9sbGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgQXBwQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRhdXRoLCAkc3RhdGUsICRyb290U2NvcGUsIGZvY3VzLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplciwgbmdEaWFsb2csIFJlc3Rhbmd1bGFyLCAkaW50ZXJ2YWwsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZWFyY2hPcGVuID0gZmFsc2U7XG4gICAgICAgIHZtLnVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xuICAgICAgICB2bS5tZXRhcyA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkTWV0YSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZtLmxvYWRNZXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nTWV0YXMgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ21ldGFzL2F0dWFsJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihtZXRhcykge1xuICAgICAgICAgICAgICAgIHZtLm1ldGFzID0gbWV0YXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZE1ldGEoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGltZW91dCBtZXRhc1xuICAgICAgICAgKi9cbiAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgfSwgNjAwMDApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5zZWFyY2hPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvY3VzKCdzZWFyY2hJbnB1dCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbG9zZSBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgJHJvb3RTY29wZS4kb24oXCJjbG9zZVNlYXJjaFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9nb3V0XG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRhdXRoLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBYTUxcbiAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucHJpbnRYTUwgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy94bWwvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAneG1sJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIERBTkZFXG4gICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RGFuZmUgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9ub3Rhcy9kYW5mZS8nICsgcGVkaWRvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdkYW5mZScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBEQU5GRVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50RXRpcXVldGEgPSBmdW5jdGlvbihyYXN0cmVpb19pZCkge1xuICAgICAgICAgICAgdmFyIGF1dGggPSB7XG4gICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3Jhc3RyZWlvcy9ldGlxdWV0YS8nICsgcmFzdHJlaW9faWQgKyAnPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSwgJ2V0aXF1ZXRhJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudmlhciBub3RhIHBvciBlLW1haWxcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5lbWFpbCA9IGZ1bmN0aW9uKHBlZGlkb19pZCwgZW1haWwpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZW1haWwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFbWFpbENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0VtYWlsJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHBlZGlkb19pZDogcGVkaWRvX2lkLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyaXIgUElcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5waSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL3BpLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGlDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdQaScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV2b2x1w6fDo29cbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9kZXZvbHVjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZXZvbHVjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdEZXZvbHVjYW8nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ8Otc3RpY2EgcmV2ZXJzYVxuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2lzdGljYSA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2xvZ2lzdGljYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2lzdGljYUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0xvZ2lzdGljYScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdGFyIHJhc3RyZWlvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZWRpdGFyID0gZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZWRpdGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFZGl0YXInLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbmNlbGEgbm90YVxuICAgICAgICAgKiBAcGFyYW0gcGVkaWRvX2lkXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jYW5jZWxhciA9IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zJywgcGVkaWRvX2lkKS5yZW1vdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZGVsZXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT2JzZXJ2YcOnw6NvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL29ic2VydmFjYW8uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ09ic2VydmFjYW9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdPYnNlcnZhY2FvJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdJY21zQ29udHJvbGxlcicsIEljbXNDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEljbXNDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXJhIHJlbGF0w7NyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlUmVsYXRvcmlvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvcmVsYXRvcmlvcy9pY21zPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rldm9sdWNhb0NvbnRyb2xsZXInLCBEZXZvbHVjYW9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIERldm9sdWNhb0NvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5kZXZvbHVjYW8gPSB7fTtcblxuICAgICAgICB2bS5mdWxsU2VuZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh2bS5yYXN0cmVpby5kZXZvbHVjYW8pIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHZtLnJhc3RyZWlvLmRldm9sdWNhbztcbiAgICAgICAgICAgIHZtLmZ1bGxTZW5kID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXMsXG4gICAgICAgICAgICAgICAgcmFzdHJlaW9fcmVmOiB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9LFxuICAgICAgICAgICAgICAgIHBhZ29fY2xpZW50ZTogJzAnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2Rldm9sdWNvZXMvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQodm0uZGV2b2x1Y2FvKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0Rldm9sdcOnw6NvIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXInLCBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9MaXN0Q29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpb3MgPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdkZXZvbHVjb2VzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRhckNvbnRyb2xsZXInLCBFZGl0YXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVkaXRhckNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5jZXAgICAgICA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jZXApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZm9FZGl0ID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBkYXRhX2VudmlvOiB2bS5yYXN0cmVpby5kYXRhX2VudmlvX3JlYWRhYmxlLFxuICAgICAgICAgICAgICAgIHByYXpvOiB2bS5yYXN0cmVpby5wcmF6byxcbiAgICAgICAgICAgICAgICBjZXA6IHZtLmNlcCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHZtLnJhc3RyZWlvLnN0YXR1c1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyYXN0cmVpb3MvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQoaW5mb0VkaXQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGVkaXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRW1haWxDb250cm9sbGVyJywgRW1haWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVtYWlsQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucGVkaWRvX2lkID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucGVkaWRvX2lkKTtcbiAgICAgICAgdm0uZW1haWwgICAgID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuZW1haWwpO1xuIFxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZCBlLW1haWxcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmZvRW1haWwgPSB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHZtLmVtYWlsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ25vdGFzL2VtYWlsJywgdm0ucGVkaWRvX2lkKS5jdXN0b21QT1NUKGluZm9FbWFpbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdFLW1haWwgZW52aWFkbyBjb20gc3VjZXNzbyBhbyBjbGllbnRlIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2lzdGljYUNvbnRyb2xsZXInLCBMb2dpc3RpY2FDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExvZ2lzdGljYUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8pO1xuICAgICAgICB2bS5sb2dpc3RpY2EgPSB7fTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ubG9naXN0aWNhKSB7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSB2bS5yYXN0cmVpby5sb2dpc3RpY2E7XG5cbiAgICAgICAgICAgIGlmICh2bS5sb2dpc3RpY2EuYWNhbykgeyAvLyBGb2kgY2FkYXN0cmFkbyBvIGPDs2RpZ28gZGUgcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICAgICAgICAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLmxvZ2lzdGljYS5yYXN0cmVpb19yZWYgPSB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmxvZ2lzdGljYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbG9naXN0aWNhcy9lZGl0Jywgdm0ucmFzdHJlaW8uaWQpLmN1c3RvbVBVVCh2bS5sb2dpc3RpY2EpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTG9nw61zdGljYSByZXZlcnNhIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignT2JzZXJ2YWNhb0NvbnRyb2xsZXInLCBPYnNlcnZhY2FvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBPYnNlcnZhY2FvQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ub2JzZXJ2YWNhbyA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8ub2JzZXJ2YWNhbztcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmFzdHJlaW9zJywgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHtvYnNlcnZhY2FvOiB2bS5vYnNlcnZhY2FvfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdPYnNlcnZhw6fDo28gc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpQ29udHJvbGxlcicsIFBpQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKTtcbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcbiAgICAgICAgdm0ucHJlU2VuZCAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8ucGkpIHtcbiAgICAgICAgICAgIHZtLnBpID0gdm0ucmFzdHJlaW8ucGk7XG5cbiAgICAgICAgICAgIGlmICh2bS5waS5zdGF0dXMpIHsgLy8gRm9pIGVudmlhZG8gYSByZXNwb3N0YSBkb3MgY29ycmVpb3NcbiAgICAgICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICA9IHRydWU7XG4gICAgICAgICAgICAgICAgdm0ucGkucmFzdHJlaW9fcmVmID0geyB2YWxvcjogdm0ucmFzdHJlaW8udmFsb3IgfTtcbiAgICAgICAgICAgICAgICB2bS5waS5wYWdvX2NsaWVudGUgPSAnMCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5waSA9IHtcbiAgICAgICAgICAgICAgICBtb3Rpdm9fc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGlzL2VkaXQnLCB2bS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHZtLnBpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBkZSBpbmZvcm1hw6fDo28gYWx0ZXJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBQSVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblBpID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5mb1BpID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBub21lOiB2bS5yYXN0cmVpby5wZWRpZG8uY2xpZW50ZS5ub21lLFxuICAgICAgICAgICAgICAgIGNlcDogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmNlcCxcbiAgICAgICAgICAgICAgICBlbmRlcmVjbzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLnJ1YSxcbiAgICAgICAgICAgICAgICBudW1lcm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5udW1lcm8sXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudG86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jb21wbGVtZW50byxcbiAgICAgICAgICAgICAgICBiYWlycm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5iYWlycm8sXG4gICAgICAgICAgICAgICAgZGF0YTogdm0ucmFzdHJlaW8uZGF0YV9lbnZpb19yZWFkYWJsZSxcbiAgICAgICAgICAgICAgICB0aXBvOiB2bS5yYXN0cmVpby5zZXJ2aWNvLFxuICAgICAgICAgICAgICAgIHN0YXR1czogKHZtLnJhc3RyZWlvLnN0YXR1cyA9PSAzKSA/ICdlJyA6ICdhJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Mi5jb3JyZWlvcy5jb20uYnIvc2lzdGVtYXMvZmFsZWNvbW9zY29ycmVpb3MvPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihpbmZvUGkpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpTGlzdENvbnRyb2xsZXInLCBQaUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBpTGlzdENvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncGlzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Jhc3RyZWlvQ29udHJvbGxlcicsIFJhc3RyZWlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBSYXN0cmVpb0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgncmFzdHJlaW9zJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocmFzdHJlaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gcmFzdHJlaW9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZnJlc2ggYWxsIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmVmcmVzaEFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdyYXN0cmVpb3MvcmVmcmVzaF9hbGwnKS5jdXN0b21QVVQoKS50aGVuKGZ1bmN0aW9uKHJhc3RyZWlvcykge1xuICAgICAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IHJhc3RyZWlvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdSYXN0cmVpb3MgYXR1YWxpemFkb3MgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBBdXRoQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBdXRoQ29udHJvbGxlcigkYXV0aCwgJGh0dHAsICRzdGF0ZSwgJHJvb3RTY29wZSwgZm9jdXMsIGVudlNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYXN0VXNlcicpO1xuICAgICAgICBpZiAodm0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIGZvY3VzKCdwYXNzd29yZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9jdXMoJ3VzZXJuYW1lJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9naW5cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RVc2VyJywgdm0udXNlcm5hbWUpO1xuICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB2bS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvYXV0aGVudGljYXRlL3VzZXInKTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnVzZXIpO1xuXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlcjtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRmF0dXJhbWVudG9Db250cm9sbGVyJywgRmF0dXJhbWVudG9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEZhdHVyYW1lbnRvQ29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLm5vdGFzID0gW107XG4gICAgICAgIHZtLmNvZGlnbyA9IHtcbiAgICAgICAgICAgIHNlcnZpY286ICcwJ1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHZtLmdlbmVyYXRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBub3Rhc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubm90YXMgPSBbXTtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ25vdGFzL2ZhdHVyYW1lbnRvJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24obm90YXMpIHtcbiAgICAgICAgICAgICAgICB2bS5ub3RhcyA9IG5vdGFzO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZUNvZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmNvZGlnby5yYXN0cmVpbyA9ICdHZXJhbmRvLi4uJztcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKFwiY29kaWdvcy9nZXJhclwiLCB2bS5jb2RpZ28uc2VydmljbykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLmNvZGlnby5yYXN0cmVpbyA9IHJlc3BvbnNlLmNvZGlnbztcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKSkge1xuICAgICAgICAgICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSAnQ8OzZGlnb3MgZXNnb3RhZG9zISc7IFxuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAnRXJybycsIHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ21zZycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCd3YXJuaW5nJywgJ0F0ZW7Dp8OjbycsIHJlc3BvbnNlLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmNvZGlnby5tZW5zYWdlbSA9IHJlc3BvbnNlLm1zZztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGYXR1cmFyIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmF0dXJhciA9IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKFwibm90YXMvZmF0dXJhclwiLCBwZWRpZG9faWQpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZmF0dXJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyJywgUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgdG9hc3RlciwgbmdEaWFsb2cpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcbiBcbiAgICAgICAgdm0uY29tZW50YXJpb3MgPSBbXTtcbiAgICAgICAgdm0uY29tZW50YXJpbyA9IG51bGw7XG4gICAgICAgIHZtLnBlZGlkb19pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBjb21lbnRhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdjb21lbnRhcmlvcycpLmN1c3RvbUdFVCh2bS5wZWRpZG9faWQpLnRoZW4oZnVuY3Rpb24oY29tZW50YXJpb3MpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0uY29tZW50YXJpb3MgPSBjb21lbnRhcmlvcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSBjb21lbnRhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdjb21lbnRhcmlvcycpLmN1c3RvbVBPU1Qoe1xuICAgICAgICAgICAgICAgICAgICAncGVkaWRvX2lkJzogcGVkaWRvLFxuICAgICAgICAgICAgICAgICAgICAnY29tZW50YXJpbyc6IHZtLmNvbWVudGFyaW9cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICAgICAgICAgIHZtLmZvcm1Db21lbnRhcmlvLiRzZXRQcmlzdGluZSgpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdDb21lbnTDoXJpbyBjYWRhc3RyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlc3Ryb3kgY29tZW50w6FyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihjb21lbnRhcmlvKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbmdEaWFsb2cub3BlbkNvbmZpcm0oeyBcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJycgKyBcbiAgICAgICAgICAgICAgICAnPHA+PGkgY2xhc3M9XCJmYSBmYS1leGNsYW1hdGlvbi10cmlhbmdsZVwiPjwvaT4mbmJzcDsgVGVtIGNlcnRlemEgcXVlIGRlc2VqYSBleGNsdWlyIG8gY29tZW50w6FyaW8/PC9wPicgKyBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm5nZGlhbG9nLWJ1dHRvbnNcIj4nICsgXG4gICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmdkaWFsb2ctYnV0dG9uIG5nZGlhbG9nLWJ1dHRvbi1zZWNvbmRhcnlcIiBuZy1jbGljaz1cImNsb3NlVGhpc0RpYWxvZygwKVwiPk7Do288L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJuZ2RpYWxvZy1idXR0b24gbmdkaWFsb2ctYnV0dG9uLXByaW1hcnlcIiBuZy1jbGljaz1cImNvbmZpcm0oMSlcIj5TaW08L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICBwbGFpbjogdHJ1ZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2NvbWVudGFyaW9zJywgY29tZW50YXJpbykuY3VzdG9tREVMRVRFKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnaW5mbycsICdTdWNlc3NvIScsICdDb21lbnTDoXJpbyBleGNsdcOtZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9EZXRhbGhlQ29udHJvbGxlcicsIFBlZGlkb0RldGFsaGVDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0RldGFsaGVDb250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIFBlZGlkbykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICBcbiAgICAgICAgdm0ucGVkaWRvX2lkID0gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5wZWRpZG8gICAgPSB7fTsgXG4gICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuXG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucGVkaWRvICA9IHt9OyBcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQZWRpZG8uZ2V0KHZtLnBlZGlkb19pZCkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFsdGVyYXIgc3RhdHVzIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uY2hhbmdlU3RhdHVzID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zL3N0YXR1cycsIHZtLnBlZGlkby5pZCkuY3VzdG9tUFVUKHtcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogc3RhdHVzXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkbyA9IHBlZGlkbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7IFxuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1N0YXR1cyBkbyBwZWRpZG8gYWx0ZXJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUHJpb3JpemFyIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ucHJpb3JpdGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9wcmlvcmlkYWRlJywgdm0ucGVkaWRvLmlkKS5jdXN0b21QVVQoe1xuICAgICAgICAgICAgICAgICdwcmlvcml6YWRvJzogdHJ1ZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlOyBcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gcHJpb3JpemFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVyIHByaW9yaWRhZGUgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS51bnByaW9yaXRpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3MvcHJpb3JpZGFkZScsIHZtLnBlZGlkby5pZCkuY3VzdG9tUFVUKHtcbiAgICAgICAgICAgICAgICAncHJpb3JpemFkbyc6IGZhbHNlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkbyA9IHBlZGlkbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7IFxuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdpbmZvJywgJ1N1Y2Vzc28hJywgJ1ByaW9yaWRhZGUgcmVtb3ZpZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0xpc3RDb250cm9sbGVyJywgUGVkaWRvTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvTGlzdENvbnRyb2xsZXIoUGVkaWRvLCBGaWx0ZXIsIFRhYmxlSGVhZGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgncGVkaWRvcycsIHZtLCB7XG4gICAgICAgICAgICAncGVkaWRvcy5jb2RpZ29fbWFya2V0cGxhY2UnOiAnTElLRScsXG4gICAgICAgICAgICAnY2xpZW50ZXMubm9tZSc6ICAgICAgICAgICAgICAnTElLRSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncGVkaWRvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTsgXG4gXG4gICAgICAgICAgICBQZWRpZG8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvcy4qJ10sXG4gICAgICAgICAgICAgICAgb3JkZXJCeTogICdwZWRpZG9zLmNyZWF0ZWRfYXQnLFxuICAgICAgICAgICAgICAgIG9yZGVyOiAgICAnREVTQycsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlLCBcbiAgICAgICAgICAgICAgICBqb2luOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlOiAgICAgICAnY2xpZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25UYWJsZTogICAgICdjbGllbnRlcy5pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogICAgJz0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VGFibGU6ICdwZWRpZG9zLmNsaWVudGVfaWQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlOiAgICAgICAncGVkaWRvX25vdGFzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uVGFibGU6ICAgICAncGVkaWRvX25vdGFzLnBlZGlkb19pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogICAgJz0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VGFibGU6ICdwZWRpZG9zLmlkJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdNZW51Q29udHJvbGxlcicsIE1lbnVDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIE1lbnVDb250cm9sbGVyKCRzdGF0ZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHN1Ym1lbnVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lbnVcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5TdWIgPSBmdW5jdGlvbihtZW51KSB7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBtZW51KVxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN1Yk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtZW51LnN1Yk9wZW4gPSAhbWVudS5zdWJPcGVuO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIGluZmVyaW9yIG1lbnVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1lbnVcbiAgICAgICAgICogQHBhcmFtIHN1YlxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlbkluZiA9IGZ1bmN0aW9uKG1lbnUsIHN1Yikge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG1lbnUuc3ViLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gc3ViKVxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN1Yk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdWIuc3ViT3BlbiA9ICFzdWIuc3ViT3BlbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0cmlldmUgbWVudSBpdGVuc1xuICAgICAgICAgKiBAdHlwZSB7KltdfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uaXRlbXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdQYWluZWwnLFxuICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuZGFzaGJvYXJkJyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRhc2hib2FyZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdQZWRpZG9zJyxcbiAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLnBlZGlkb3MuaW5kZXgnKSxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtY3ViZXMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQ2xpZW50ZXMnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS11c2VycydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdQcm9kdXRvcycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRyb3Bib3gnLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnUHJvZHV0b3MnLCBpY29uOiAnZmEtbGlzdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0xpbmhhcycsIGljb246ICdmYS1saXN0LWFsdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ01hcmNhcycsIGljb246ICdmYS1saXN0LWFsdCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0Fzc2lzdMOqbmNpYScsIGljb246ICdmYS13cmVuY2gnIH0sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ01vdmltZW50YcOnw7VlcycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWV4Y2hhbmdlJyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0VudHJhZGEnLCBpY29uOiAnZmEtbWFpbC1yZXBseScgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1Nhw61kYScsIGljb246ICdmYS1tYWlsLWZvcndhcmQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdEZWZlaXRvJywgaWNvbjogJ2ZhLWNoYWluLWJyb2tlbicgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1RyYW5zcG9ydGFkb3JhcycsIGljb246ICdmYS10cnVjaycgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0Zvcm5lY2Vkb3JlcycsIGljb246ICdmYS1idWlsZGluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ0Zvcm1hcyBkZSBwYWdhbWVudG8nLCBpY29uOiAnZmEtbW9uZXknIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdPcGVyYcOnw6NvIGZpc2NhbCcsIGljb246ICdmYS1wZXJjZW50JyB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0ZpbmFuY2Vpcm8nLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1tb25leScsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdDb250YXMgYSBwYWdhci9yZWNlYmVyJywgaWNvbjogJ2ZhLWNyZWRpdC1jYXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnUGxhbm8gZGUgY29udGFzJywgaWNvbjogJ2ZhLWxpc3QnIH0sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1Jhc3RyZWlvcycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXRydWNrJyxcbiAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbicsICdhdGVuZGltZW50byddLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Jhc3RyZWlvcyBpbXBvcnRhbnRlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdHJ1Y2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hdGVuZGltZW50by5yYXN0cmVpbycpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUElcXCdzIHBlbmRlbnRlcycgLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXdhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hdGVuZGltZW50by5waXMnKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Rldm9sdcOnw7VlcyBwZW5kZW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVuZG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5hdGVuZGltZW50by5kZXZvbHVjb2VzJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZWxhdMOzcmlvcycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXBpZS1jaGFydCcsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ0NhaXhhIGRpw6FyaW8nLCBpY29uOiAnZmEtbW9uZXknfSxcbiAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnSUNNUyBtZW5zYWwnLCBpY29uOiAnZmEtZmlsZS1wZGYtbycsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuYWRtaW4uaWNtcycpfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQ29uZmlndXJhw6fDtWVzJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtY29nJyxcbiAgICAgICAgICAgICAgICByb2xlczogWydhZG1pbiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ01hcmtldGluZycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWJ1bGxob3JuJyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAge3RpdGxlOiAnVGVtcGxhdGUgTUwnLCBpY29uOiAnZmEtY2xpcGJvYXJkJywgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5tYXJrZXRpbmcudGVtcGxhdGVtbCcpfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdJbnRlcm5vJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtZGVza3RvcCcsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGFkb3MgZGEgZW1wcmVzYScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtaW5mbydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbXBvc3RvcyBkYSBub3RhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1wZXJjZW50J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1VzdcOhcmlvcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5pbnRlcm5vLnVzdWFyaW9zJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBTZWFyY2hDb250cm9sbGVyKVxuICAgICAgICAuZmlsdGVyKCdoaWdobGlnaHQnLCBmdW5jdGlvbigkc2NlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odGV4dCwgcGhyYXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBocmFzZSkgdGV4dCA9IFN0cmluZyh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoJygnK3BocmFzZSsnKScsICdnaScpLFxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ1bmRlcmxpbmVcIj4kMTwvc3Bhbj4nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBTZWFyY2hDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VhcmNoID0gJyc7XG4gICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xvc2Ugc2VhcmNoIG92ZXJsYXlcbiAgICAgICAgICovXG4gICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJjbG9zZVNlYXJjaFwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBzZWFyY2ggcmVzdWx0c1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLnNlYXJjaC5sZW5ndGggPD0gMykge1xuICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoXCJzZWFyY2hcIikuY3VzdG9tR0VUKFwiXCIsIHtzZWFyY2g6IHZtLnNlYXJjaH0pLnRoZW4oZnVuY3Rpb24oYnVzY2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0gYnVzY2E7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVcGxvYWRDb250cm9sbGVyJywgVXBsb2FkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVcGxvYWRDb250cm9sbGVyKFVwbG9hZCwgdG9hc3RlciwgZW52U2VydmljZSwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWQgbm90YXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGZpbGVzXG4gICAgICAgICAqL1xuICAgICAgICB2bS51cGxvYWQgPSBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7QXV0aG9yaXphdGlvbjogJ0JlYXJlciAnKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIil9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnF1aXZvczogZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnc3RvcC1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1VwbG9hZCBjb25jbHXDrWRvJywgcmVzcG9uc2UuZGF0YS5tc2cpO1xuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgXCJFcnJvIG5vIHVwbG9hZCFcIiwgXCJFcnJvIGFvIGVudmlhciBhcnF1aXZvcywgdGVudGUgbm92YW1lbnRlIVwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01pbmhhU2VuaGFDb250cm9sbGVyJywgTWluaGFTZW5oYUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTWluaGFTZW5oYUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZW5oYXMgPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHNlbmhhc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uc2VuaGFzID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdtaW5oYXMtc2VuaGFzJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24oc2VuaGFzKSB7XG4gICAgICAgICAgICAgICAgdm0uc2VuaGFzID0gc2VuaGFzO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZW5oYUVkaXRhckNvbnRyb2xsZXInLCBTZW5oYUVkaXRhckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gU2VuaGFFZGl0YXJDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZW5oYSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnNlbmhhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VuaGFzJywgdm0uc2VuaGEuaWQpLmN1c3RvbVBVVCh2bS5zZW5oYSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTZW5oYSBlZGl0YWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZW5oYU5vdmFDb250cm9sbGVyJywgU2VuaGFOb3ZhQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBTZW5oYU5vdmFDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZW5oYSA9IHt9O1xuICAgICAgICB2bS5zZW5oYS51c3VhcmlvX2lkID0gJHNjb3BlLm5nRGlhbG9nRGF0YS51c2VyX2lkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdzZW5oYXMnKS5jdXN0b21QT1NUKHZtLnNlbmhhKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXN1YXJpb0NvbnRyb2xsZXInLCBVc3VhcmlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvQ29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c3VhcmlvcyA9IFtdO1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgdXN1YXJpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnVzdWFyaW9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCd1c3VhcmlvcycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHVzdWFyaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0udXN1YXJpb3MgPSB1c3VhcmlvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFZGl0IHVzdWFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmVkaXRhciA9IGZ1bmN0aW9uKHVzdWFyaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvaW50ZXJuby9wYXJ0aWFscy91c3VhcmlvX2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzdWFyaW9FZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdGb3JtJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzdWFyaW86IHVzdWFyaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIHVzdWFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9pbnRlcm5vL3BhcnRpYWxzL3VzdWFyaW9fZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0JyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXN1YXJpb05vdm9Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdGb3JtJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZSB1c2VyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB1c2VyX2lkXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24odXNlcl9pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCd1c3VhcmlvcycsIHVzZXJfaWQpLmN1c3RvbURFTEVURSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdVc3XDoXJpbyBkZWxldGFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXN1YXJpb0VkaXRhckNvbnRyb2xsZXInLCBVc3VhcmlvRWRpdGFyQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvRWRpdGFyQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXN1YXJpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnVzdWFyaW8pO1xuICAgICAgICB2bS51c3VhcmlvLm5vdmFzUm9sZXMgPSBbXTtcblxuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udXN1YXJpby5yb2xlcywgZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgdm0udXN1YXJpby5ub3Zhc1JvbGVzW3JvbGUuaWRdID0gcm9sZS5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3VzdWFyaW9zJywgdm0udXN1YXJpby5pZCkuY3VzdG9tUFVUKHZtLnVzdWFyaW8pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnVXN1w6FyaW8gZWRpdGFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXN1YXJpb05vdm9Db250cm9sbGVyJywgVXN1YXJpb05vdm9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFVzdWFyaW9Ob3ZvQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXN1YXJpbyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCd1c3VhcmlvcycpLmN1c3RvbVBPU1Qodm0udXN1YXJpbykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdVc3XDoXJpbyBjcmlhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9TZW5oYUNvbnRyb2xsZXInLCBVc3VhcmlvU2VuaGFDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFVzdWFyaW9TZW5oYUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgbmdEaWFsb2csIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZW5oYXMgPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB2bS51c2VyX2lkID0gJHN0YXRlUGFyYW1zLmlkO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHNlbmhhc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uc2VuaGFzID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdzZW5oYXMvdXN1YXJpbycsIHZtLnVzZXJfaWQpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHNlbmhhcykge1xuICAgICAgICAgICAgICAgIHZtLnNlbmhhcyA9IHNlbmhhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFZGl0IHVzdWFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmVkaXRhciA9IGZ1bmN0aW9uKHNlbmhhKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2ludGVybm8vcGFydGlhbHMvc2VuaGFfZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0JyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VuaGFFZGl0YXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdGb3JtJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbmhhOiBzZW5oYVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgdXN1YXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2ludGVybm8vcGFydGlhbHMvc2VuaGFfZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0JyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VuaGFOb3ZhQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRm9ybScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB2bS51c2VyX2lkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZSB1c2VyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBzZW5oYV9pZFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKHNlbmhhX2lkKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3NlbmhhcycsIHNlbmhhX2lkKS5jdXN0b21ERUxFVEUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU2VuaGEgZGVsZXRhZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RlbXBsYXRlbWxDb250cm9sbGVyJywgVGVtcGxhdGVtbENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVGVtcGxhdGVtbENvbnRyb2xsZXIoUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgdGVtcGxhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnVybCk7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcInRlbXBsYXRlbWwvZ2VyYXJcIikuY3VzdG9tR0VUKFwiXCIsIHtcbiAgICAgICAgICAgICAgdXJsOiB2bS51cmxcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50ZW1wbGF0ZSA9IHJlc3BvbnNlLnRlbXBsYXRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
