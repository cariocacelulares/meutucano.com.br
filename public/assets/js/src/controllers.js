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

    PedidoDetalheController.$inject = ["$rootScope", "$stateParams", "Restangular"];
    angular
        .module('MeuTucano')
        .controller('PedidoDetalheController', PedidoDetalheController);

    function PedidoDetalheController($rootScope, $stateParams, Restangular) {
        var vm = this;
  
        vm.pedido = [];
        vm.loading = false;
        vm.pedido_id = $stateParams.id;

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
         * Load pedido
         */
        vm.load = function() {
            vm.pedido = []; 
            vm.loading = true;

            Restangular.one('pedidos', vm.pedido_id).get().then(function(pedido) {
                vm.pedido = pedido;
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

    PedidoListController.$inject = ["$rootScope", "Restangular", "toaster"];
    angular
        .module('MeuTucano')
        .controller('PedidoListController', PedidoListController);

    function PedidoListController($rootScope, Restangular, toaster) {
        var vm = this;

        vm.pedidos = [];
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
         * Load notas
         */
        vm.load = function() {
            vm.pedidos = [];
            vm.loading = true;

            Restangular.all('pedidos').getList().then(function(pedidos) {
                vm.pedidos = pedidos;
                vm.loading = false;
            });
        };
        vm.load();
    }

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9EZXZvbHVjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXIuanMiLCJBdGVuZGltZW50by9FZGl0YXJDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vRW1haWxDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vTG9naXN0aWNhQ29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL09ic2VydmFjYW9Db250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlDb250cm9sbGVyLmpzIiwiQXRlbmRpbWVudG8vUGlMaXN0Q29udHJvbGxlci5qcyIsIkF0ZW5kaW1lbnRvL1Jhc3RyZWlvQ29udHJvbGxlci5qcyIsIkF1dGgvQXV0aENvbnRyb2xsZXIuanMiLCJGYXR1cmFtZW50by9GYXR1cmFtZW50b0NvbnRyb2xsZXIuanMiLCJJbnRlcm5vL01pbmhhU2VuaGFDb250cm9sbGVyLmpzIiwiSW50ZXJuby9TZW5oYUVkaXRhckNvbnRyb2xsZXIuanMiLCJJbnRlcm5vL1NlbmhhTm92YUNvbnRyb2xsZXIuanMiLCJJbnRlcm5vL1VzdWFyaW9Db250cm9sbGVyLmpzIiwiSW50ZXJuby9Vc3VhcmlvRWRpdGFyQ29udHJvbGxlci5qcyIsIkludGVybm8vVXN1YXJpb05vdm9Db250cm9sbGVyLmpzIiwiSW50ZXJuby9Vc3VhcmlvU2VuaGFDb250cm9sbGVyLmpzIiwiTWFya2V0aW5nL1RlbXBsYXRlbWxDb250cm9sbGVyLmpzIiwiUGFydGlhbHMvTWVudUNvbnRyb2xsZXIuanMiLCJQYXJ0aWFscy9TZWFyY2hDb250cm9sbGVyLmpzIiwiUGFydGlhbHMvVXBsb2FkQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9EZXRhbGhlQ29udHJvbGxlci5qcyIsIlBlZGlkby9QZWRpZG9MaXN0Q29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxpQkFBQTs7SUFFQSxTQUFBLGNBQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBLFNBQUEsc0JBQUEsVUFBQSxhQUFBLFdBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsV0FBQTtRQUNBLEdBQUEsUUFBQTtRQUNBLEdBQUEsZUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsZUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7OztRQUdBLEdBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxlQUFBOztZQUVBLFlBQUEsSUFBQSxlQUFBLFlBQUEsS0FBQSxTQUFBLE9BQUE7Z0JBQ0EsR0FBQSxRQUFBO2dCQUNBLEdBQUEsZUFBQTs7O1FBR0EsR0FBQTs7Ozs7UUFLQSxVQUFBLFdBQUE7WUFDQSxHQUFBO1dBQ0E7Ozs7O1FBS0EsR0FBQSxhQUFBLFdBQUE7WUFDQSxHQUFBLGFBQUE7WUFDQSxNQUFBOzs7Ozs7UUFNQSxXQUFBLElBQUEsZUFBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBOzs7Ozs7UUFNQSxHQUFBLFNBQUEsV0FBQTtZQUNBLE1BQUEsU0FBQSxLQUFBLFdBQUE7Z0JBQ0EsYUFBQSxXQUFBO2dCQUNBLFdBQUEsZ0JBQUE7Z0JBQ0EsV0FBQSxjQUFBOztnQkFFQSxPQUFBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxXQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGdCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7O1FBT0EsR0FBQSxhQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLGtCQUFBLFlBQUEsTUFBQSxxQkFBQSxPQUFBOzs7Ozs7OztRQVFBLEdBQUEsZ0JBQUEsU0FBQSxhQUFBO1lBQ0EsSUFBQSxPQUFBO2dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7WUFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEseUJBQUEsY0FBQSxNQUFBLHFCQUFBLE9BQUE7Ozs7Ozs7UUFPQSxHQUFBLFFBQUEsU0FBQSxXQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFdBQUE7b0JBQ0EsT0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxLQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxZQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxZQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxTQUFBLFNBQUEsVUFBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsVUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxXQUFBLFNBQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLEdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7UUFRQSxHQUFBLGFBQUEsU0FBQSxVQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxVQUFBOzs7Ozs7OztBQ3JOQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsc0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O0FDUkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLFlBQUEsYUFBQSxZQUFBLFNBQUEsc0JBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O1FBS0EsR0FBQSxvQkFBQSxXQUFBO1lBQ0EsSUFBQSxPQUFBO2dCQUNBLE9BQUEsYUFBQSxRQUFBOzs7WUFHQSxRQUFBLEtBQUEsV0FBQSxLQUFBLFlBQUEsc0JBQUEscUJBQUE7Ozs7OztBQ2xCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBO1lBQ0EsR0FBQSxXQUFBO2VBQ0E7WUFDQSxHQUFBLFlBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Z0JBQ0EsY0FBQSxFQUFBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLGNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxtQkFBQSxHQUFBLFNBQUEsSUFBQSxVQUFBLEdBQUEsV0FBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDakNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDJCQUFBOztJQUVBLFNBQUEsd0JBQUEsWUFBQSxhQUFBLFVBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFlBQUE7UUFDQSxHQUFBLFVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEsY0FBQSxVQUFBLEtBQUEsU0FBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7O0FDckNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLG9CQUFBOztJQUVBLFNBQUEsaUJBQUEsYUFBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBLFNBQUEsT0FBQSxTQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsSUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxTQUFBO2dCQUNBLFlBQUEsR0FBQSxTQUFBO2dCQUNBLE9BQUEsR0FBQSxTQUFBO2dCQUNBLEtBQUEsR0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQTs7O1lBR0EsWUFBQSxJQUFBLGtCQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsVUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztBQzVCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxtQkFBQTs7SUFFQSxTQUFBLGdCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLElBQUEsWUFBQTtnQkFDQSxPQUFBLEdBQUE7OztZQUdBLFlBQUEsSUFBQSxlQUFBLEdBQUEsV0FBQSxXQUFBLFdBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7QUN4QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxRQUFBLEtBQUEsT0FBQSxhQUFBO1FBQ0EsR0FBQSxZQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxXQUFBOztRQUVBLElBQUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUEsR0FBQSxTQUFBOztZQUVBLElBQUEsR0FBQSxVQUFBLE1BQUE7Z0JBQ0EsR0FBQSxXQUFBO21CQUNBO2dCQUNBLEdBQUEseUJBQUE7Z0JBQ0EsR0FBQSxVQUFBLGVBQUEsRUFBQSxPQUFBLEdBQUEsU0FBQTtnQkFDQSxRQUFBLElBQUEsR0FBQTs7Ozs7OztRQU9BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLG1CQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxXQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNsQ0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsYUFBQSxPQUFBLGFBQUEsU0FBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxhQUFBLE9BQUEsYUFBQSxTQUFBLElBQUEsVUFBQSxDQUFBLFlBQUEsR0FBQSxhQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsZ0JBQUE7O0lBRUEsU0FBQSxhQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUEsU0FBQSxzQkFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtRQUNBLEdBQUEsV0FBQTtRQUNBLEdBQUEsV0FBQTs7UUFFQSxJQUFBLEdBQUEsU0FBQSxJQUFBO1lBQ0EsR0FBQSxLQUFBLEdBQUEsU0FBQTs7WUFFQSxJQUFBLEdBQUEsR0FBQSxRQUFBO2dCQUNBLEdBQUEsV0FBQTttQkFDQTtnQkFDQSxHQUFBLGtCQUFBO2dCQUNBLEdBQUEsR0FBQSxlQUFBLEVBQUEsT0FBQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxHQUFBLGVBQUE7O2VBRUE7WUFDQSxHQUFBLEtBQUE7Z0JBQ0EsZUFBQSxHQUFBLFNBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFlBQUEsSUFBQSxZQUFBLEdBQUEsU0FBQSxJQUFBLFVBQUEsR0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxXQUFBLFdBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7O1FBT0EsR0FBQSxTQUFBLFdBQUE7WUFDQSxJQUFBLFNBQUE7Z0JBQ0EsVUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUEsT0FBQSxRQUFBO2dCQUNBLEtBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxVQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsUUFBQSxHQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBLGFBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsTUFBQSxHQUFBLFNBQUE7Z0JBQ0EsUUFBQSxDQUFBLEdBQUEsU0FBQSxVQUFBLEtBQUEsTUFBQTs7O1lBR0EsUUFBQSxLQUFBLDZEQUFBLHFCQUFBOzs7OztBQzFEQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTs7SUFFQSxTQUFBLGlCQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztBQ3JDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxzQkFBQTs7SUFFQSxTQUFBLG1CQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxZQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFlBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLGFBQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsYUFBQSxXQUFBO1lBQ0EsR0FBQSxZQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSx5QkFBQSxZQUFBLEtBQUEsU0FBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFVBQUE7O2dCQUVBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7QUNsREEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLE9BQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxhQUFBLFFBQUE7UUFDQSxJQUFBLEdBQUEsVUFBQTtZQUNBLE1BQUE7ZUFDQTtZQUNBLE1BQUE7Ozs7OztRQU1BLEdBQUEsUUFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLGFBQUEsUUFBQSxZQUFBLEdBQUE7WUFDQSxJQUFBLGNBQUE7Z0JBQ0EsVUFBQSxHQUFBO2dCQUNBLFVBQUEsR0FBQTs7O1lBR0EsTUFBQSxNQUFBLGFBQUEsS0FBQSxXQUFBO2dCQUNBLE9BQUEsTUFBQSxJQUFBLFdBQUEsS0FBQSxZQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLElBQUEsT0FBQSxLQUFBLFVBQUEsU0FBQSxLQUFBOztnQkFFQSxhQUFBLFFBQUEsUUFBQTtnQkFDQSxXQUFBLGdCQUFBOztnQkFFQSxXQUFBLGNBQUEsU0FBQSxLQUFBO2dCQUNBLE9BQUEsR0FBQTs7Ozs7O0FDdkNBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsWUFBQSxhQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxRQUFBO1FBQ0EsR0FBQSxTQUFBO1lBQ0EsU0FBQTs7UUFFQSxHQUFBLFVBQUE7UUFDQSxHQUFBLGFBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsUUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxZQUFBLElBQUEscUJBQUEsVUFBQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFFBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsZUFBQSxXQUFBO1lBQ0EsR0FBQSxPQUFBLFdBQUE7O1lBRUEsWUFBQSxJQUFBLGlCQUFBLEdBQUEsT0FBQSxTQUFBLFlBQUEsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxPQUFBLFdBQUEsU0FBQTs7Z0JBRUEsSUFBQSxTQUFBLGVBQUEsVUFBQTtvQkFDQSxHQUFBLE9BQUEsV0FBQTtvQkFDQSxRQUFBLElBQUEsU0FBQSxRQUFBLFNBQUE7OztnQkFHQSxJQUFBLFNBQUEsZUFBQSxRQUFBO29CQUNBLFFBQUEsSUFBQSxXQUFBLFdBQUEsU0FBQTs7Z0JBRUEsR0FBQSxPQUFBLFdBQUEsU0FBQTs7Ozs7OztRQU9BLEdBQUEsVUFBQSxTQUFBLFdBQUE7WUFDQSxZQUFBLElBQUEsaUJBQUEsV0FBQSxZQUFBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3JFQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx3QkFBQTs7SUFFQSxTQUFBLHFCQUFBLGFBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxTQUFBO1FBQ0EsR0FBQSxVQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxTQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxpQkFBQSxVQUFBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLFVBQUE7OztRQUdBLEdBQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsUUFBQSxRQUFBLEtBQUEsT0FBQSxhQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFVBQUEsR0FBQSxNQUFBLElBQUEsVUFBQSxHQUFBLE9BQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ25CQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxRQUFBO1FBQ0EsR0FBQSxNQUFBLGFBQUEsT0FBQSxhQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFVBQUEsV0FBQSxHQUFBLE9BQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3BCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxxQkFBQTs7SUFFQSxTQUFBLGtCQUFBLFlBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxXQUFBO1FBQ0EsR0FBQSxVQUFBOztRQUVBLFdBQUEsSUFBQSxVQUFBLFdBQUE7WUFDQSxHQUFBOzs7UUFHQSxXQUFBLElBQUEsV0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOzs7UUFHQSxXQUFBLElBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLFlBQUEsVUFBQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFdBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsU0FBQSxTQUFBLFNBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFNBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxVQUFBLFNBQUEsU0FBQTtZQUNBLFlBQUEsSUFBQSxZQUFBLFNBQUEsZUFBQSxLQUFBLFdBQUE7Z0JBQ0EsV0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQzFFQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSwyQkFBQTs7SUFFQSxTQUFBLHdCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7UUFDQSxHQUFBLFFBQUEsYUFBQTs7UUFFQSxRQUFBLFFBQUEsR0FBQSxRQUFBLE9BQUEsU0FBQSxNQUFBO1lBQ0EsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFlBQUEsR0FBQSxRQUFBLElBQUEsVUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ3hCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx5QkFBQTs7SUFFQSxTQUFBLHNCQUFBLGFBQUEsWUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsWUFBQSxJQUFBLFlBQUEsV0FBQSxHQUFBLFNBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7OztBQ25CQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSwwQkFBQTs7SUFFQSxTQUFBLHVCQUFBLFlBQUEsY0FBQSxhQUFBLFVBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFVBQUE7UUFDQSxHQUFBLFVBQUEsYUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxTQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxrQkFBQSxHQUFBLFNBQUEsVUFBQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7UUFHQSxHQUFBOzs7OztRQUtBLEdBQUEsU0FBQSxTQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLE9BQUE7Ozs7Ozs7O1FBUUEsR0FBQSxTQUFBLFdBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFNBQUEsR0FBQTs7Ozs7Ozs7OztRQVVBLEdBQUEsVUFBQSxTQUFBLFVBQUE7WUFDQSxZQUFBLElBQUEsVUFBQSxVQUFBLGVBQUEsS0FBQSxXQUFBO2dCQUNBLFdBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUM5RUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsd0JBQUE7O0lBRUEsU0FBQSxxQkFBQSxhQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztRQUtBLEdBQUEsbUJBQUEsV0FBQTtZQUNBLFFBQUEsSUFBQSxHQUFBOztZQUVBLFlBQUEsSUFBQSxvQkFBQSxVQUFBLElBQUE7Y0FDQSxLQUFBLEdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFdBQUEsU0FBQTs7Ozs7O0FDbkJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGtCQUFBOztJQUVBLFNBQUEsZUFBQSxRQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7O1FBT0EsR0FBQSxVQUFBLFNBQUEsTUFBQTtZQUNBLFFBQUEsUUFBQSxHQUFBLE9BQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsUUFBQTtvQkFDQSxLQUFBLFVBQUE7OztZQUdBLEtBQUEsVUFBQSxDQUFBLEtBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsVUFBQSxTQUFBLE1BQUEsS0FBQTtZQUNBLFFBQUEsUUFBQSxLQUFBLEtBQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsUUFBQTtvQkFDQSxLQUFBLFVBQUE7OztZQUdBLElBQUEsVUFBQSxDQUFBLElBQUE7Ozs7Ozs7UUFPQSxHQUFBLFFBQUE7WUFDQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUEsT0FBQSxLQUFBO2dCQUNBLE1BQUE7O1lBRUE7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBLE9BQUEsS0FBQTtnQkFDQSxNQUFBOztZQUVBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTs7WUFFQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxFQUFBLE9BQUEsWUFBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxVQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLFVBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsZUFBQSxNQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxFQUFBLE9BQUEsV0FBQSxNQUFBO29CQUNBLEVBQUEsT0FBQSxTQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLFdBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsZ0JBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsdUJBQUEsTUFBQTtvQkFDQSxFQUFBLE9BQUEsbUJBQUEsTUFBQTs7O1lBR0E7Z0JBQ0EsT0FBQTtnQkFDQSxNQUFBO2dCQUNBLEtBQUE7b0JBQ0EsRUFBQSxPQUFBLDBCQUFBLE1BQUE7b0JBQ0EsRUFBQSxPQUFBLG1CQUFBLE1BQUE7OztZQUdBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLENBQUEsU0FBQTtnQkFDQSxLQUFBO29CQUNBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxNQUFBLE9BQUEsS0FBQTs7b0JBRUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUEsT0FBQSxLQUFBOztvQkFFQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsTUFBQSxPQUFBLEtBQUE7Ozs7WUFJQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxDQUFBLE9BQUEsZ0JBQUEsTUFBQTtvQkFDQSxDQUFBLE9BQUEsZUFBQSxNQUFBLGlCQUFBLE1BQUEsT0FBQSxLQUFBOzs7WUFHQTtnQkFDQSxPQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxDQUFBOztZQUVBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxLQUFBO29CQUNBLENBQUEsT0FBQSxlQUFBLE1BQUEsZ0JBQUEsTUFBQSxPQUFBLEtBQUE7OztZQUdBO2dCQUNBLE9BQUE7Z0JBQ0EsTUFB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QUFBLFVBQUE7O1lBRUEsWUFBQSxJQUFBLHNCQUFBLEdBQUEsT0FBQSxJQUFBLFVBQUE7Z0JBQ0EsY0FBQTtlQUNBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7OztRQU9BLEdBQUEsZUFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxzQkFBQSxHQUFBLE9BQUEsSUFBQSxVQUFBO2dCQUNBLGNBQUE7ZUFDQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLFFBQUEsSUFBQSxRQUFBLFlBQUE7Ozs7OztBQ2xGQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx3QkFBQTs7SUFFQSxTQUFBLHFCQUFBLFlBQUEsYUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsVUFBQTtRQUNBLEdBQUEsVUFBQTs7UUFFQSxXQUFBLElBQUEsVUFBQSxXQUFBO1lBQ0EsR0FBQTs7O1FBR0EsV0FBQSxJQUFBLFdBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7O1FBR0EsV0FBQSxJQUFBLGdCQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxXQUFBLFVBQUEsS0FBQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQTs7O1FBR0EsR0FBQTs7O0tBR0EiLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIEFwcENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXBwQ29udHJvbGxlcigkYXV0aCwgJHN0YXRlLCAkcm9vdFNjb3BlLCBmb2N1cywgZW52U2VydmljZSwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIsIG5nRGlhbG9nLCBSZXN0YW5ndWxhciwgJGludGVydmFsLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB2bS51c2VyID0gJHJvb3RTY29wZS5jdXJyZW50VXNlcjtcbiAgICAgICAgdm0ubWV0YXMgPSB7fTtcbiAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZE1ldGEoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmdNZXRhcyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmdNZXRhcyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB2bS5sb2FkTWV0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZ01ldGFzID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdtZXRhcy9hdHVhbCcpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24obWV0YXMpIHtcbiAgICAgICAgICAgICAgICB2bS5tZXRhcyA9IG1ldGFzO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmdNZXRhcyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWRNZXRhKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRpbWVvdXQgbWV0YXNcbiAgICAgICAgICovXG4gICAgICAgICRpbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRNZXRhKCk7XG4gICAgICAgIH0sIDYwMDAwKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IHRydWU7XG4gICAgICAgICAgICBmb2N1cygnc2VhcmNoSW5wdXQnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xvc2Ugc2VhcmNoIG92ZXJsYXlcbiAgICAgICAgICovXG4gICAgICAgICRyb290U2NvcGUuJG9uKFwiY2xvc2VTZWFyY2hcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZtLnNlYXJjaE9wZW4gPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ291dFxuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkYXV0aC5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyJyk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgWE1MXG4gICAgICAgICAqIEBwYXJhbSBwZWRpZG9faWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW50WE1MID0gZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvbm90YXMveG1sLycgKyBwZWRpZG9faWQgKyAnPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSwgJ3htbCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBEQU5GRVxuICAgICAgICAgKiBAcGFyYW0gcGVkaWRvX2lkXG4gICAgICAgICAqL1xuICAgICAgICB2bS5wcmludERhbmZlID0gZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvbm90YXMvZGFuZmUvJyArIHBlZGlkb19pZCArICc/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpLCAnZGFuZmUnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgREFORkVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvX2lkXG4gICAgICAgICAqL1xuICAgICAgICB2bS5wcmludEV0aXF1ZXRhID0gZnVuY3Rpb24ocmFzdHJlaW9faWQpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9yYXN0cmVpb3MvZXRpcXVldGEvJyArIHJhc3RyZWlvX2lkICsgJz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCksICdldGlxdWV0YScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbnZpYXIgbm90YSBwb3IgZS1tYWlsXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZW1haWwgPSBmdW5jdGlvbihwZWRpZG9faWQsIGVtYWlsKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2VtYWlsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRW1haWxDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdFbWFpbCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwZWRpZG9faWQ6IHBlZGlkb19pZCxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmlyIFBJXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ucGkgPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9waS5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IG5nZGlhbG9nLWJpZycsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BpQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnUGknLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldm9sdcOnw6NvXG4gICAgICAgICAqIEBwYXJhbSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGV2b2x1Y2FvID0gZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYXRlbmRpbWVudG8vcGFydGlhbHMvZGV2b2x1Y2FvLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgbmdkaWFsb2ctYmlnJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGV2b2x1Y2FvQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRGV2b2x1Y2FvJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2fDrXN0aWNhIHJldmVyc2FcbiAgICAgICAgICogQHBhcmFtIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dpc3RpY2EgPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9sb2dpc3RpY2EuaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCBuZ2RpYWxvZy1iaWcnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpc3RpY2FDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdMb2dpc3RpY2EnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFzdHJlaW86IHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVkaXRhciByYXN0cmVpb1xuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmVkaXRhciA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2F0ZW5kaW1lbnRvL3BhcnRpYWxzL2VkaXRhci5odG1sJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0JyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdGFyQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRWRpdGFyJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHJhc3RyZWlvOiByYXN0cmVpb1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW5jZWxhIG5vdGFcbiAgICAgICAgICogQHBhcmFtIHBlZGlkb19pZFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uY2FuY2VsYXIgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcycsIHBlZGlkb19pZCkucmVtb3ZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRNZXRhKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGRlbGV0YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9ic2VydmHDp8Ojb1xuICAgICAgICAgKiBAcGFyYW0gcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLm9ic2VydmFjYW8gPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hdGVuZGltZW50by9wYXJ0aWFscy9vYnNlcnZhY2FvLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdPYnNlcnZhY2FvQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnT2JzZXJ2YWNhbycsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICByYXN0cmVpbzogcmFzdHJlaW9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGFzaGJvYXJkQ29udHJvbGxlcicsIERhc2hib2FyZENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignSWNtc0NvbnRyb2xsZXInLCBJY21zQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBJY21zQ29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgZW52U2VydmljZSwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VyYSByZWxhdMOzcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZVJlbGF0b3JpbyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGF1dGggPSB7XG4gICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3JlbGF0b3Jpb3MvaWNtcz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCkpO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEZXZvbHVjYW9Db250cm9sbGVyJywgRGV2b2x1Y2FvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9Db250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKTtcbiAgICAgICAgdm0uZGV2b2x1Y2FvID0ge307XG5cbiAgICAgICAgdm0uZnVsbFNlbmQgPSBmYWxzZTtcblxuICAgICAgICBpZiAodm0ucmFzdHJlaW8uZGV2b2x1Y2FvKSB7XG4gICAgICAgICAgICB2bS5kZXZvbHVjYW8gPSB2bS5yYXN0cmVpby5kZXZvbHVjYW87XG4gICAgICAgICAgICB2bS5mdWxsU2VuZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5kZXZvbHVjYW8gPSB7XG4gICAgICAgICAgICAgICAgbW90aXZvX3N0YXR1czogdm0ucmFzdHJlaW8uc3RhdHVzLFxuICAgICAgICAgICAgICAgIHJhc3RyZWlvX3JlZjogeyB2YWxvcjogdm0ucmFzdHJlaW8udmFsb3IgfSxcbiAgICAgICAgICAgICAgICBwYWdvX2NsaWVudGU6ICcwJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdkZXZvbHVjb2VzL2VkaXQnLCB2bS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKHZtLmRldm9sdWNhbykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdEZXZvbHXDp8OjbyBjcmlhZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rldm9sdWNhb0xpc3RDb250cm9sbGVyJywgRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRGV2b2x1Y2FvTGlzdENvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW9zID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnZGV2b2x1Y29lcycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHJhc3RyZWlvcykge1xuICAgICAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IHJhc3RyZWlvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdFZGl0YXJDb250cm9sbGVyJywgRWRpdGFyQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBFZGl0YXJDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKTtcbiAgICAgICAgdm0uY2VwICAgICAgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28uY2VwKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmZvRWRpdCA9IHtcbiAgICAgICAgICAgICAgICByYXN0cmVpbzogdm0ucmFzdHJlaW8ucmFzdHJlaW8sXG4gICAgICAgICAgICAgICAgZGF0YV9lbnZpbzogdm0ucmFzdHJlaW8uZGF0YV9lbnZpb19yZWFkYWJsZSxcbiAgICAgICAgICAgICAgICBwcmF6bzogdm0ucmFzdHJlaW8ucHJhem8sXG4gICAgICAgICAgICAgICAgY2VwOiB2bS5jZXAsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiB2bS5yYXN0cmVpby5zdGF0dXNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmFzdHJlaW9zL2VkaXQnLCB2bS5yYXN0cmVpby5pZCkuY3VzdG9tUFVUKGluZm9FZGl0KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBlZGl0YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VtYWlsQ29udHJvbGxlcicsIEVtYWlsQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBFbWFpbENvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnBlZGlkb19pZCA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnBlZGlkb19pZCk7XG4gICAgICAgIHZtLmVtYWlsICAgICA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLmVtYWlsKTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmQgZS1tYWlsXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5mb0VtYWlsID0ge1xuICAgICAgICAgICAgICAgIGVtYWlsOiB2bS5lbWFpbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdub3Rhcy9lbWFpbCcsIHZtLnBlZGlkb19pZCkuY3VzdG9tUE9TVChpbmZvRW1haWwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnRS1tYWlsIGVudmlhZG8gY29tIHN1Y2Vzc28gYW8gY2xpZW50ZSEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpc3RpY2FDb250cm9sbGVyJywgTG9naXN0aWNhQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMb2dpc3RpY2FDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5yYXN0cmVpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKTtcbiAgICAgICAgdm0ubG9naXN0aWNhID0ge307XG4gICAgICAgIHZtLmZ1bGxTZW5kID0gZmFsc2U7XG4gICAgICAgIHZtLnByZVNlbmQgID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHZtLnJhc3RyZWlvLmxvZ2lzdGljYSkge1xuICAgICAgICAgICAgdm0ubG9naXN0aWNhID0gdm0ucmFzdHJlaW8ubG9naXN0aWNhO1xuXG4gICAgICAgICAgICBpZiAodm0ubG9naXN0aWNhLmFjYW8pIHsgLy8gRm9pIGNhZGFzdHJhZG8gbyBjw7NkaWdvIGRlIHJhc3RyZWlvXG4gICAgICAgICAgICAgICAgdm0uZnVsbFNlbmQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHsgLy8gQXBlbmFzIGZvaSBjYWRhc3RyYWRhIGEgUElcbiAgICAgICAgICAgICAgICB2bS5wcmVTZW5kICAgICAgICAgICAgICAgID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2bS5sb2dpc3RpY2EucmFzdHJlaW9fcmVmID0geyB2YWxvcjogdm0ucmFzdHJlaW8udmFsb3IgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5sb2dpc3RpY2EpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ2xvZ2lzdGljYXMvZWRpdCcsIHZtLnJhc3RyZWlvLmlkKS5jdXN0b21QVVQodm0ubG9naXN0aWNhKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0xvZ8Otc3RpY2EgcmV2ZXJzYSBjcmlhZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ09ic2VydmFjYW9Db250cm9sbGVyJywgT2JzZXJ2YWNhb0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gT2JzZXJ2YWNhb0NvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLm9ic2VydmFjYW8gPSAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvLm9ic2VydmFjYW87XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3Jhc3RyZWlvcycsICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8uaWQpLmN1c3RvbVBVVCh7b2JzZXJ2YWNhbzogdm0ub2JzZXJ2YWNhb30pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnT2JzZXJ2YcOnw6NvIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQaUNvbnRyb2xsZXInLCBQaUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGlDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIsICR3aW5kb3csICRodHRwUGFyYW1TZXJpYWxpemVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucmFzdHJlaW8gPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbyk7XG4gICAgICAgIHZtLmZ1bGxTZW5kID0gZmFsc2U7XG4gICAgICAgIHZtLnByZVNlbmQgID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHZtLnJhc3RyZWlvLnBpKSB7XG4gICAgICAgICAgICB2bS5waSA9IHZtLnJhc3RyZWlvLnBpO1xuXG4gICAgICAgICAgICBpZiAodm0ucGkuc3RhdHVzKSB7IC8vIEZvaSBlbnZpYWRvIGEgcmVzcG9zdGEgZG9zIGNvcnJlaW9zXG4gICAgICAgICAgICAgICAgdm0uZnVsbFNlbmQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHsgLy8gQXBlbmFzIGZvaSBjYWRhc3RyYWRhIGEgUElcbiAgICAgICAgICAgICAgICB2bS5wcmVTZW5kICAgICAgICAgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLnBpLnJhc3RyZWlvX3JlZiA9IHsgdmFsb3I6IHZtLnJhc3RyZWlvLnZhbG9yIH07XG4gICAgICAgICAgICAgICAgdm0ucGkucGFnb19jbGllbnRlID0gJzAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ucGkgPSB7XG4gICAgICAgICAgICAgICAgbW90aXZvX3N0YXR1czogdm0ucmFzdHJlaW8uc3RhdHVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3Bpcy9lZGl0Jywgdm0ucmFzdHJlaW8uaWQpLmN1c3RvbVBVVCh2bS5waSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZGUgaW5mb3JtYcOnw6NvIGFsdGVyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9wZW4gUElcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5QaSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZm9QaSA9IHtcbiAgICAgICAgICAgICAgICByYXN0cmVpbzogdm0ucmFzdHJlaW8ucmFzdHJlaW8sXG4gICAgICAgICAgICAgICAgbm9tZTogdm0ucmFzdHJlaW8ucGVkaWRvLmNsaWVudGUubm9tZSxcbiAgICAgICAgICAgICAgICBjZXA6IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jZXAsXG4gICAgICAgICAgICAgICAgZW5kZXJlY286IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5ydWEsXG4gICAgICAgICAgICAgICAgbnVtZXJvOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28ubnVtZXJvLFxuICAgICAgICAgICAgICAgIGNvbXBsZW1lbnRvOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28uY29tcGxlbWVudG8sXG4gICAgICAgICAgICAgICAgYmFpcnJvOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28uYmFpcnJvLFxuICAgICAgICAgICAgICAgIGRhdGE6IHZtLnJhc3RyZWlvLmRhdGFfZW52aW9fcmVhZGFibGUsXG4gICAgICAgICAgICAgICAgdGlwbzogdm0ucmFzdHJlaW8uc2VydmljbyxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICh2bS5yYXN0cmVpby5zdGF0dXMgPT0gMykgPyAnZScgOiAnYSdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbignaHR0cDovL3d3dzIuY29ycmVpb3MuY29tLmJyL3Npc3RlbWFzL2ZhbGVjb21vc2NvcnJlaW9zLz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoaW5mb1BpKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQaUxpc3RDb250cm9sbGVyJywgUGlMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaUxpc3RDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgcmFzdHJlaW9zXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5yYXN0cmVpb3MgPSBbXTtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3BpcycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHJhc3RyZWlvcykge1xuICAgICAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IHJhc3RyZWlvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdSYXN0cmVpb0NvbnRyb2xsZXInLCBSYXN0cmVpb0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUmFzdHJlaW9Db250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgcmFzdHJlaW9zXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5yYXN0cmVpb3MgPSBbXTtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ3Jhc3RyZWlvcycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHJhc3RyZWlvcykge1xuICAgICAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IHJhc3RyZWlvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWZyZXNoIGFsbCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLnJlZnJlc2hBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncmFzdHJlaW9zL3JlZnJlc2hfYWxsJykuY3VzdG9tUFVUKCkudGhlbihmdW5jdGlvbihyYXN0cmVpb3MpIHtcbiAgICAgICAgICAgICAgICB2bS5yYXN0cmVpb3MgPSByYXN0cmVpb3M7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUmFzdHJlaW9zIGF0dWFsaXphZG9zIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhDb250cm9sbGVyJywgQXV0aENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXV0aENvbnRyb2xsZXIoJGF1dGgsICRodHRwLCAkc3RhdGUsICRyb290U2NvcGUsIGZvY3VzLCBlbnZTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdFVzZXInKTtcbiAgICAgICAgaWYgKHZtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICBmb2N1cygncGFzc3dvcmQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvY3VzKCd1c2VybmFtZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ2luXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dpbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0VXNlcicsIHZtLnVzZXJuYW1lKTtcbiAgICAgICAgICAgIHZhciBjcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdm0udXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL2F1dGhlbnRpY2F0ZS91c2VyJyk7XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciB1c2VyID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZGF0YS51c2VyKTtcblxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgdXNlcik7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXI7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZhdHVyYW1lbnRvQ29udHJvbGxlcicsIEZhdHVyYW1lbnRvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBGYXR1cmFtZW50b0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5ub3RhcyA9IFtdO1xuICAgICAgICB2bS5jb2RpZ28gPSB7XG4gICAgICAgICAgICBzZXJ2aWNvOiAnMCdcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB2bS5nZW5lcmF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgbm90YXNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLm5vdGFzID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdub3Rhcy9mYXR1cmFtZW50bycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKG5vdGFzKSB7XG4gICAgICAgICAgICAgICAgdm0ubm90YXMgPSBub3RhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZ2VuZXJhdGVDb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSAnR2VyYW5kby4uLic7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcImNvZGlnb3MvZ2VyYXJcIiwgdm0uY29kaWdvLnNlcnZpY28pLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSByZXNwb25zZS5jb2RpZ287XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ2Vycm9yJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gJ0PDs2RpZ29zIGVzZ290YWRvcyEnOyBcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ0Vycm8nLCByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KCdtc2cnKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnd2FybmluZycsICdBdGVuw6fDo28nLCByZXNwb25zZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ubWVuc2FnZW0gPSByZXNwb25zZS5tc2c7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmF0dXJhciBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZhdHVyYXIgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcIm5vdGFzL2ZhdHVyYXJcIiwgcGVkaWRvX2lkKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGZhdHVyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdNaW5oYVNlbmhhQ29udHJvbGxlcicsIE1pbmhhU2VuaGFDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIE1pbmhhU2VuaGFDb250cm9sbGVyKFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VuaGFzID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBzZW5oYXNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnNlbmhhcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnbWluaGFzLXNlbmhhcycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKHNlbmhhcykge1xuICAgICAgICAgICAgICAgIHZtLnNlbmhhcyA9IHNlbmhhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignU2VuaGFFZGl0YXJDb250cm9sbGVyJywgU2VuaGFFZGl0YXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFNlbmhhRWRpdGFyQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VuaGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5nRGlhbG9nRGF0YS5zZW5oYSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3NlbmhhcycsIHZtLnNlbmhhLmlkKS5jdXN0b21QVVQodm0uc2VuaGEpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU2VuaGEgZWRpdGFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignU2VuaGFOb3ZhQ29udHJvbGxlcicsIFNlbmhhTm92YUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gU2VuaGFOb3ZhQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VuaGEgPSB7fTtcbiAgICAgICAgdm0uc2VuaGEudXN1YXJpb19pZCA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEudXNlcl9pZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VuaGFzJykuY3VzdG9tUE9TVCh2bS5zZW5oYSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2coKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTZW5oYSBjcmlhZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9Db250cm9sbGVyJywgVXN1YXJpb0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXN1YXJpb0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXN1YXJpb3MgPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHVzdWFyaW9zXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS51c3VhcmlvcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgndXN1YXJpb3MnKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbih1c3Vhcmlvcykge1xuICAgICAgICAgICAgICAgIHZtLnVzdWFyaW9zID0gdXN1YXJpb3M7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdCB1c3VhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5lZGl0YXIgPSBmdW5jdGlvbih1c3VhcmlvKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2ludGVybm8vcGFydGlhbHMvdXN1YXJpb19mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc3VhcmlvRWRpdGFyQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRm9ybScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB1c3VhcmlvOiB1c3VhcmlvXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSB1c3VhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvaW50ZXJuby9wYXJ0aWFscy91c3VhcmlvX2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzdWFyaW9Ob3ZvQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRm9ybSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgdXNlclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdXNlcl9pZFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKHVzZXJfaWQpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgndXN1YXJpb3MnLCB1c2VyX2lkKS5jdXN0b21ERUxFVEUoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnVXN1w6FyaW8gZGVsZXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9FZGl0YXJDb250cm9sbGVyJywgVXN1YXJpb0VkaXRhckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXN1YXJpb0VkaXRhckNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnVzdWFyaW8gPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5nRGlhbG9nRGF0YS51c3VhcmlvKTtcbiAgICAgICAgdm0udXN1YXJpby5ub3Zhc1JvbGVzID0gW107XG5cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnVzdWFyaW8ucm9sZXMsIGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgICAgIHZtLnVzdWFyaW8ubm92YXNSb2xlc1tyb2xlLmlkXSA9IHJvbGUuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCd1c3VhcmlvcycsIHZtLnVzdWFyaW8uaWQpLmN1c3RvbVBVVCh2bS51c3VhcmlvKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXBsb2FkJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZygpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1VzdcOhcmlvIGVkaXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9Ob3ZvQ29udHJvbGxlcicsIFVzdWFyaW9Ob3ZvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvTm92b0NvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnVzdWFyaW8gPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgndXN1YXJpb3MnKS5jdXN0b21QT1NUKHZtLnVzdWFyaW8pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1cGxvYWQnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnVXN1w6FyaW8gY3JpYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVc3VhcmlvU2VuaGFDb250cm9sbGVyJywgVXN1YXJpb1NlbmhhQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvU2VuaGFDb250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VuaGFzID0gW107XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdm0udXNlcl9pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBzZW5oYXNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnNlbmhhcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnc2VuaGFzL3VzdWFyaW8nLCB2bS51c2VyX2lkKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihzZW5oYXMpIHtcbiAgICAgICAgICAgICAgICB2bS5zZW5oYXMgPSBzZW5oYXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdCB1c3VhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5lZGl0YXIgPSBmdW5jdGlvbihzZW5oYSkge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9pbnRlcm5vL3BhcnRpYWxzL3NlbmhhX2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlbmhhRWRpdGFyQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnRm9ybScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZW5oYTogc2VuaGFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIHVzdWFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9pbnRlcm5vL3BhcnRpYWxzL3NlbmhhX2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlbmhhTm92YUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ0Zvcm0nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdm0udXNlcl9pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgdXNlclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gc2VuaGFfaWRcbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihzZW5oYV9pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdzZW5oYXMnLCBzZW5oYV9pZCkuY3VzdG9tREVMRVRFKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIGRlbGV0YWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdUZW1wbGF0ZW1sQ29udHJvbGxlcicsIFRlbXBsYXRlbWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFRlbXBsYXRlbWxDb250cm9sbGVyKFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIHRlbXBsYXRlXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZVRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS51cmwpO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJ0ZW1wbGF0ZW1sL2dlcmFyXCIpLmN1c3RvbUdFVChcIlwiLCB7XG4gICAgICAgICAgICAgIHVybDogdm0udXJsXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGVtcGxhdGUgPSByZXNwb25zZS50ZW1wbGF0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLCBNZW51Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNZW51Q29udHJvbGxlcigkc3RhdGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBzdWJtZW51XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU3ViID0gZnVuY3Rpb24obWVudSkge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLml0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT0gbWVudSlcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWVudS5zdWJPcGVuID0gIW1lbnUuc3ViT3BlbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBpbmZlcmlvciBtZW51XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtZW51XG4gICAgICAgICAqIEBwYXJhbSBzdWJcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5JbmYgPSBmdW5jdGlvbihtZW51LCBzdWIpIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChtZW51LnN1YiwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtICE9IHN1YilcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdWJPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3ViLnN1Yk9wZW4gPSAhc3ViLnN1Yk9wZW47XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlIG1lbnUgaXRlbnNcbiAgICAgICAgICogQHR5cGUgeypbXX1cbiAgICAgICAgICovXG4gICAgICAgIHZtLml0ZW1zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGFpbmVsJyxcbiAgICAgICAgICAgICAgICBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmRhc2hib2FyZCcpLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1kYXNoYm9hcmQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGVkaWRvcycsXG4gICAgICAgICAgICAgICAgc3JlZjogJHN0YXRlLmhyZWYoJ2FwcC5wZWRpZG9zLmluZGV4JyksXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWN1YmVzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NsaWVudGVzJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtdXNlcnMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvZHV0b3MnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1kcm9wYm94JyxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1Byb2R1dG9zJywgaWNvbjogJ2ZhLWxpc3QnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdMaW5oYXMnLCBpY29uOiAnZmEtbGlzdC1hbHQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdNYXJjYXMnLCBpY29uOiAnZmEtbGlzdC1hbHQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdBc3Npc3TDqm5jaWEnLCBpY29uOiAnZmEtd3JlbmNoJyB9LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdNb3ZpbWVudGHDp8O1ZXMnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1leGNoYW5nZScsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdFbnRyYWRhJywgaWNvbjogJ2ZhLW1haWwtcmVwbHknIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdTYcOtZGEnLCBpY29uOiAnZmEtbWFpbC1mb3J3YXJkJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnRGVmZWl0bycsIGljb246ICdmYS1jaGFpbi1icm9rZW4nIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdUcmFuc3BvcnRhZG9yYXMnLCBpY29uOiAnZmEtdHJ1Y2snIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdGb3JuZWNlZG9yZXMnLCBpY29uOiAnZmEtYnVpbGRpbmcnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdGb3JtYXMgZGUgcGFnYW1lbnRvJywgaWNvbjogJ2ZhLW1vbmV5JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnT3BlcmHDp8OjbyBmaXNjYWwnLCBpY29uOiAnZmEtcGVyY2VudCcgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdGaW5hbmNlaXJvJyxcbiAgICAgICAgICAgICAgICBpY29uOiAnZmEtbW9uZXknLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnQ29udGFzIGEgcGFnYXIvcmVjZWJlcicsIGljb246ICdmYS1jcmVkaXQtY2FyZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1BsYW5vIGRlIGNvbnRhcycsIGljb246ICdmYS1saXN0JyB9LFxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS10cnVjaycsXG4gICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nLCAnYXRlbmRpbWVudG8nXSxcbiAgICAgICAgICAgICAgICBzdWI6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSYXN0cmVpb3MgaW1wb3J0YW50ZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXRydWNrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuYXRlbmRpbWVudG8ucmFzdHJlaW8nKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BJXFwncyBwZW5kZW50ZXMnICxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS13YXJuaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuYXRlbmRpbWVudG8ucGlzJylcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEZXZvbHXDp8O1ZXMgcGVuZGVudGVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYS11bmRvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuYXRlbmRpbWVudG8uZGV2b2x1Y29lcycpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVsYXTDs3Jpb3MnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1waWUtY2hhcnQnLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7dGl0bGU6ICdDYWl4YSBkacOhcmlvJywgaWNvbjogJ2ZhLW1vbmV5J30sXG4gICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ0lDTVMgbWVuc2FsJywgaWNvbjogJ2ZhLWZpbGUtcGRmLW8nLCBzcmVmOiAkc3RhdGUuaHJlZignYXBwLmFkbWluLmljbXMnKX1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NvbmZpZ3VyYcOnw7VlcycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWNvZycsXG4gICAgICAgICAgICAgICAgcm9sZXM6IFsnYWRtaW4nXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdNYXJrZXRpbmcnLFxuICAgICAgICAgICAgICAgIGljb246ICdmYS1idWxsaG9ybicsXG4gICAgICAgICAgICAgICAgc3ViOiBbXG4gICAgICAgICAgICAgICAgICAgIHt0aXRsZTogJ1RlbXBsYXRlIE1MJywgaWNvbjogJ2ZhLWNsaXBib2FyZCcsIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAubWFya2V0aW5nLnRlbXBsYXRlbWwnKX1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnSW50ZXJubycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRlc2t0b3AnLFxuICAgICAgICAgICAgICAgIHN1YjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0RhZG9zIGRhIGVtcHJlc2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWluZm8nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSW1wb3N0b3MgZGEgbm90YScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtcGVyY2VudCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVc3XDoXJpb3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhLXVzZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICRzdGF0ZS5ocmVmKCdhcHAuaW50ZXJuby51c3VhcmlvcycpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICBdO1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgU2VhcmNoQ29udHJvbGxlcilcbiAgICAgICAgLmZpbHRlcignaGlnaGxpZ2h0JywgZnVuY3Rpb24oJHNjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQsIHBocmFzZSkge1xuICAgICAgICAgICAgICAgIGlmIChwaHJhc2UpIHRleHQgPSBTdHJpbmcodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKCcoJytwaHJhc2UrJyknLCAnZ2knKSxcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidW5kZXJsaW5lXCI+JDE8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbCh0ZXh0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlYXJjaCA9ICcnO1xuICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsb3NlIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiY2xvc2VTZWFyY2hcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh2bS5zZWFyY2gubGVuZ3RoIDw9IDMpIHtcbiAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKFwic2VhcmNoXCIpLmN1c3RvbUdFVChcIlwiLCB7c2VhcmNoOiB2bS5zZWFyY2h9KS50aGVuKGZ1bmN0aW9uKGJ1c2NhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IGJ1c2NhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXBsb2FkQ29udHJvbGxlcicsIFVwbG9hZENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXBsb2FkQ29udHJvbGxlcihVcGxvYWQsIHRvYXN0ZXIsIGVudlNlcnZpY2UsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBsb2FkIG5vdGFzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBmaWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0udXBsb2FkID0gZnVuY3Rpb24gKGZpbGVzKSB7XG4gICAgICAgICAgICBpZiAoZmlsZXMgJiYgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvdXBsb2FkJyxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge0F1dGhvcml6YXRpb246ICdCZWFyZXIgJysgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJxdWl2b3M6IGZpbGVzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VwbG9hZCcpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3N0b3AtbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdVcGxvYWQgY29uY2x1w61kbycsIHJlc3BvbnNlLmRhdGEubXNnKTtcbiAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiRXJybyBubyB1cGxvYWQhXCIsIFwiRXJybyBhbyBlbnZpYXIgYXJxdWl2b3MsIHRlbnRlIG5vdmFtZW50ZSFcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcicsIFBlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIHRvYXN0ZXIsIG5nRGlhbG9nKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gXG4gICAgICAgIHZtLmNvbWVudGFyaW9zID0gW107XG4gICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICB2bS5wZWRpZG9faWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgY29tZW50YXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnY29tZW50YXJpb3MnKS5jdXN0b21HRVQodm0ucGVkaWRvX2lkKS50aGVuKGZ1bmN0aW9uKGNvbWVudGFyaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW9zID0gY29tZW50YXJpb3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgY29tZW50YXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgnY29tZW50YXJpb3MnKS5jdXN0b21QT1NUKHtcbiAgICAgICAgICAgICAgICAgICAgJ3BlZGlkb19pZCc6IHBlZGlkbyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvbWVudGFyaW8nOiB2bS5jb21lbnRhcmlvXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2bS5mb3JtQ29tZW50YXJpby4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnQ29tZW50w6FyaW8gY2FkYXN0cmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXN0cm95IGNvbWVudMOhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oY29tZW50YXJpbykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW5Db25maXJtKHsgXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICcnICsgXG4gICAgICAgICAgICAgICAgJzxwPjxpIGNsYXNzPVwiZmEgZmEtZXhjbGFtYXRpb24tdHJpYW5nbGVcIj48L2k+Jm5ic3A7IFRlbSBjZXJ0ZXphIHF1ZSBkZXNlamEgZXhjbHVpciBvIGNvbWVudMOhcmlvPzwvcD4nICsgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJuZ2RpYWxvZy1idXR0b25zXCI+JyArIFxuICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm5nZGlhbG9nLWJ1dHRvbiBuZ2RpYWxvZy1idXR0b24tc2Vjb25kYXJ5XCIgbmctY2xpY2s9XCJjbG9zZVRoaXNEaWFsb2coMClcIj5Ow6NvPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibmdkaWFsb2ctYnV0dG9uIG5nZGlhbG9nLWJ1dHRvbi1wcmltYXJ5XCIgbmctY2xpY2s9XCJjb25maXJtKDEpXCI+U2ltPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgcGxhaW46IHRydWVcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdjb21lbnRhcmlvcycsIGNvbWVudGFyaW8pLmN1c3RvbURFTEVURSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdm0uY29tZW50YXJpbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2luZm8nLCAnU3VjZXNzbyEnLCAnQ29tZW50w6FyaW8gZXhjbHXDrWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXInLCBQZWRpZG9EZXRhbGhlQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9EZXRhbGhlQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG4gIFxuICAgICAgICB2bS5wZWRpZG8gPSBbXTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB2bS5wZWRpZG9faWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuIFxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucGVkaWRvID0gW107IFxuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcycsIHZtLnBlZGlkb19pZCkuZ2V0KCkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbHRlcmFyIHN0YXR1cyBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmNoYW5nZVN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9zdGF0dXMnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHN0YXR1c1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlOyBcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTdGF0dXMgZG8gcGVkaWRvIGFsdGVyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByaW9yaXphciBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnByaW9yaXRpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3MvcHJpb3JpZGFkZScsIHZtLnBlZGlkby5pZCkuY3VzdG9tUFVUKHtcbiAgICAgICAgICAgICAgICAncHJpb3JpemFkbyc6IHRydWVcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTsgXG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIHByaW9yaXphZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlciBwcmlvcmlkYWRlIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0udW5wcmlvcml0aXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zL3ByaW9yaWRhZGUnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3ByaW9yaXphZG8nOiBmYWxzZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlOyBcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnaW5mbycsICdTdWNlc3NvIScsICdQcmlvcmlkYWRlIHJlbW92aWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9MaXN0Q29udHJvbGxlcicsIFBlZGlkb0xpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0xpc3RDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucGVkaWRvcyA9IFtdO1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuIFxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIG5vdGFzXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5wZWRpZG9zID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdwZWRpZG9zJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24ocGVkaWRvcykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkb3MgPSBwZWRpZG9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
