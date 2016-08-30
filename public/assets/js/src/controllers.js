(function() {
    'use strict';

    AppController.$inject = ["$rootScope", "focus"];
    angular
        .module('MeuTucano')
        .controller('AppController', AppController);

    function AppController($rootScope, focus) {
        var vm = this;

        vm.searchOpen = false;
        vm.user = $rootScope.currentUser;

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

    ClienteDetalheController.$inject = ["$stateParams", "Cliente"];
    angular
        .module('MeuTucano')
        .controller('ClienteDetalheController', ClienteDetalheController);

    function ClienteDetalheController($stateParams, Cliente) {
        var vm = this;

        vm.cliente_id = $stateParams.id;
        vm.cliente    = {};
        vm.loading    = false;

        vm.load = function() {
            vm.cliente = {};
            vm.loading = true;

            Cliente.detail(vm.cliente_id).then(function(cliente) {
                vm.cliente = cliente;
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

    LinhaFormController.$inject = ["$rootScope", "$state", "$stateParams", "Restangular", "Linha", "toaster", "ngDialog"];
    angular
        .module('MeuTucano')
        .controller('LinhaFormController', LinhaFormController);

    function LinhaFormController($rootScope, $state, $stateParams, Restangular, Linha, toaster, ngDialog) {
        var vm = this;

        vm.linha = {
            id: $stateParams.id || null,
            atributos: []
        };

        vm.load = function() {
            vm.loading = true;

            Linha.get(vm.linha.id).then(function(linha) {
                vm.linha   = linha;
                vm.loading = false;

                for (var i in vm.linha.atributos) {
                    if (typeof vm.linha.atributos[i].opcoes != 'undefined') {
                        vm.linha.atributos[i].opcoes = vm.linha.atributos[i].opcoes.split(';');
                    }
                }
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
            vm.linha.atributos.unshift({});
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
                $state.go('app.produtos.linhas.index');
            });
        };

        /**
         * Exclui a linha
         *
         * @return {void}
         */
        vm.destroy = function() {
            Linha.delete(vm.linha.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Linha excluida com sucesso!');
                $state.go('app.produtos.linhas.index');
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

    DevolucaoFormController.$inject = ["$rootScope", "$scope", "toaster", "Devolucao"];
    angular
        .module('MeuTucano')
        .controller('DevolucaoFormController', DevolucaoFormController);

    function DevolucaoFormController($rootScope, $scope, toaster, Devolucao) {
        var vm = this;

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.loading = true;

            Devolucao.get($scope.ngDialogData.rastreio).then(function(devolucao) {
                vm.devolucao = devolucao;
                vm.loading   = false;
            });
        } else {
            vm.devolucao = {};
        }

        if (!vm.devolucao) {
            vm.devolucao = {
                /*motivo_status: vm.devolucao.status,
                rastreio_ref: { valor: vm.devolucao.valor },*/
                pago_cliente: '0'
            };
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            Devolucao.save(vm.devolucao, vm.devolucao.rastreio_id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Devolução criada com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();
(function() {
    'use strict';

    DevolucaoPendenteListController.$inject = ["Filter", "TableHeader", "Devolucao", "RastreioHelper", "toaster"];
    angular
        .module('MeuTucano')
        .controller('DevolucaoPendenteListController', DevolucaoPendenteListController);

    function DevolucaoPendenteListController(Filter, TableHeader, Devolucao, RastreioHelper, toaster) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('devolucoes', vm, {
            'clientes.nome':                               'LIKE',
            'pedido_rastreios.rastreio':                   'LIKE',
            'pedido_rastreio_devolucoes.codigo_devolucao': 'LIKE',
            'pedidos.id':                                  'LIKE',
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('devolucoes', vm);

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        /**
         * Load rastreios
         */
        vm.load = function() {
            vm.loading = true;

            Devolucao.pending({
                fields:   ['pedido_rastreio_devolucoes.*'],
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

    LogisticaFormController.$inject = ["Restangular", "$rootScope", "$scope", "toaster", "Logistica"];
    angular
        .module('MeuTucano')
        .controller('LogisticaFormController', LogisticaFormController);

    function LogisticaFormController(Restangular, $rootScope, $scope, toaster, Logistica) {
        var vm = this;

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.loading = true;

            Logistica.get($scope.ngDialogData.rastreio).then(function(logistica) {
                vm.logistica = logistica;
                vm.loading   = false;
            });
        } else {
            vm.logistica = {};
        }

        /*
        if (!vm.logistica.acao) { // Apenas foi cadastrada a PI
            vm.preSend                = true;
            vm.logistica.rastreio_ref = { valor: vm.rastreio.valor };
            console.log(vm.logistica);
        }
        */

        /**
         * Save the observation
         */
        vm.save = function() {
            Logistica.save(vm.logistica, vm.logistica.rastreio_id || null).then(function() {
                $scope.closeThisDialog(true);
                toaster.pop('success', 'Sucesso!', 'Logistica reversa salva com sucesso!');
            });
        };
    }

})();
(function() {
    'use strict';

    MarcaFormController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "Marca", "toaster"];
    angular
        .module('MeuTucano')
        .controller('MarcaFormController', MarcaFormController);

    function MarcaFormController($rootScope, $scope, $state, $stateParams, Marca, toaster) {
        var vm = this;

        if (typeof $scope.ngDialogData.marca != 'undefined') {
            vm.marca = angular.copy($scope.ngDialogData.marca);
        } else {
            vm.marca = {};
        }

        vm.load = function() {
            vm.loading = true;

            Marca.get(vm.marca.id).then(function(marca) {
                vm.marca   = marca;
                vm.loading = false;
            });
        };

        if (vm.marca.id) {
            vm.load();
        }

        /**
         * Salva a marca
         *
         * @return {void}
         */
        vm.save = function() {
            Marca.save(vm.marca, vm.marca.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Marca salva com sucesso!');
                $scope.closeThisDialog(true);
            });
        };

        /**
         * Exclui a marca
         *
         * @return {void}
         */
        vm.destroy = function() {
            Marca.delete(vm.marca.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Marca excluida com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }
})();
(function() {
    'use strict';

    MarcaListController.$inject = ["Marca", "Filter", "TableHeader", "ngDialog"];
    angular
        .module('MeuTucano')
        .controller('MarcaListController', MarcaListController);

    function MarcaListController(Marca, Filter, TableHeader, ngDialog) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('marcas', vm, {
            'marcas.titulo': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('marcas', vm);

        vm.load = function() {
            vm.loading = true;

            Marca.getList({
                fields:   ['marcas.*'],
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
         * Abre o formulário da amrca
         *
         * @return {void}
         */
        vm.openForm = function(marca) {
            ngDialog.open({
                template: 'views/marca/form.html',
                controller: 'MarcaFormController',
                controllerAs: 'MarcaForm',
                data: {
                    marca: marca || {}
                }
            }).closePromise.then(function(data) {
                if (data.value === true) vm.load();
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

    PedidoComentarioController.$inject = ["$rootScope", "$stateParams", "Restangular", "toaster", "ngDialog", "Comentario"];
    angular
        .module('MeuTucano')
        .controller('PedidoComentarioController', PedidoComentarioController);

    function PedidoComentarioController($rootScope, $stateParams, Restangular, toaster, ngDialog, Comentario) {
        var vm = this;

        vm.comentarios = [];
        vm.comentario = null;
        vm.pedido_id = $stateParams.id;
        vm.loading = false;

        /**
         * Load comentarios
         */
        vm.load = function() {
            vm.loading = true;

            Comentario.getFromOrder(vm.pedido_id).then(function(comentarios) {
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

            Comentario.save({
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

            Comentario.delete(comentario).then(function() {
                vm.loading = false;
                vm.comentario = null;
                vm.load();
                toaster.pop('info', 'Sucesso!', 'Comentário excluído com sucesso!');
            });
        };
    }
})();
(function() {
    'use strict';

    PedidoDetalheController.$inject = ["$rootScope", "$state", "$stateParams", "Restangular", "Pedido", "toaster", "RastreioHelper", "NotaHelper"];
    angular
        .module('MeuTucano')
        .controller('PedidoDetalheController', PedidoDetalheController);

    function PedidoDetalheController($rootScope, $state, $stateParams, Restangular, Pedido, toaster, RastreioHelper, NotaHelper) {
        var vm = this;

        vm.pedido_id = $stateParams.id;
        vm.pedido    = {};
        vm.loading   = false;
        vm.notaHelper = NotaHelper;

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

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
                toaster.pop('success', 'Sucesso!', 'Status do pedido alterado com sucesso!');

                if (status == 5) {
                    $state.go('app.pedidos.index');
                } else {
                    vm.load();
                    vm.loading = false;
                }
            });
        };

        /**
         * Priorizar pedido
         */
        vm.changePriority = function() {
            vm.loading = true;

            Restangular.one('pedidos/prioridade', vm.pedido.id).customPUT({
                'priorizado': !(vm.pedido.priorizado)
            }).then(function(pedido) {
                vm.load();
                vm.loading = false;
                toaster.pop('success', 'Sucesso!', 'Pedido priorizado com sucesso!');
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

    PiFormController.$inject = ["Pi", "$scope", "toaster", "$window", "$httpParamSerializer"];
    angular
        .module('MeuTucano')
        .controller('PiFormController', PiFormController);

    function PiFormController(Pi, $scope, toaster, $window, $httpParamSerializer) {
        var vm = this;

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.loading = true;

            Pi.get($scope.ngDialogData.rastreio).then(function(pi) {
                vm.pi      = pi;
                vm.loading = false;
            });
        } else {
            vm.pi = {};
        }

        /**
         * Salva as informações da PI
         *
         * @return {void}
         */
        vm.save = function() {
            Pi.save(vm.pi, vm.pi.rastreio_id || null).then(function() {
                $scope.closeThisDialog(true);
                toaster.pop('success', 'Sucesso!', 'Pedido de informação salvo com sucesso!');
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

    PiPendenteListController.$inject = ["Filter", "TableHeader", "Pi", "ngDialog", "toaster", "RastreioHelper"];
    angular
        .module('MeuTucano')
        .controller('PiPendenteListController', PiPendenteListController);

    function PiPendenteListController(Filter, TableHeader, Pi, ngDialog, toaster, RastreioHelper) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('pis', vm, {
            'clientes.nome':                 'LIKE',
            'pedido_rastreios.rastreio':     'LIKE',
            'pedidos.codigo_marketplace':    'LIKE',
            'pedido_rastreio_pis.codigo_pi': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('pis', vm);

        /**
         * @type {Object}
         */
        vm.rastreioHelper = RastreioHelper.init(vm);

        /**
         * Load rastreios
         */
        vm.load = function() {
            vm.loading = true;

            Pi.pending({
                fields:   ['pedido_rastreio_pis.*'],
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

    EditarController.$inject = ["Restangular", "$rootScope", "$scope", "toaster", "Rastreio"];
    angular
        .module('MeuTucano')
        .controller('EditarController', EditarController);

    function EditarController(Restangular, $rootScope, $scope, toaster, Rastreio) {
        var vm = this;

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.loading = true;

            Rastreio.get($scope.ngDialogData.rastreio).then(function(rastreio) {
                vm.rastreio = rastreio;
                vm.loading  = false;
            });
        } else {
            vm.rastreio = {};
        }

        /**
         * Save the observation
         */
        vm.save = function() {
            Rastreio.save(vm.rastreio, vm.rastreio.id || null).then(function() {
                $scope.closeThisDialog(true);
                toaster.pop('success', 'Sucesso!', 'Pedido editado com sucesso!');
            });
        };
    }
})();
(function() {
    'use strict';

    RastreioImportanteListController.$inject = ["Rastreio", "Filter", "TableHeader", "toaster"];
    angular
        .module('MeuTucano')
        .controller('RastreioImportanteListController', RastreioImportanteListController);

    function RastreioImportanteListController(Rastreio, Filter, TableHeader, toaster) {
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
         * Salva as informações da senha
         * 
         * @return {void} 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdXRoL0F1dGhDb250cm9sbGVyLmpzIiwiQ2xpZW50ZS9DbGllbnRlRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJDbGllbnRlL0NsaWVudGVMaXN0Q29udHJvbGxlci5qcyIsIkZhdHVyYW1lbnRvL0ZhdHVyYW1lbnRvQ29udHJvbGxlci5qcyIsIkxpbmhhL0xpbmhhRm9ybUNvbnRyb2xsZXIuanMiLCJMaW5oYS9MaW5oYUxpc3RDb250cm9sbGVyLmpzIiwiRGV2b2x1Y2FvL0Rldm9sdWNhb0Zvcm1Db250cm9sbGVyLmpzIiwiRGV2b2x1Y2FvL0Rldm9sdWNhb1BlbmRlbnRlTGlzdENvbnRyb2xsZXIuanMiLCJMb2dpc3RpY2EvTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIuanMiLCJNYXJjYS9NYXJjYUZvcm1Db250cm9sbGVyLmpzIiwiTWFyY2EvTWFyY2FMaXN0Q29udHJvbGxlci5qcyIsIk1hcmtldGluZy9UZW1wbGF0ZW1sQ29udHJvbGxlci5qcyIsIlBhcnRpYWxzL1NlYXJjaENvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvTGlzdENvbnRyb2xsZXIuanMiLCJQaS9QaUZvcm1Db250cm9sbGVyLmpzIiwiUGkvUGlQZW5kZW50ZUxpc3RDb250cm9sbGVyLmpzIiwiUmFzdHJlaW8vUmFzdHJlaW9FZGl0Rm9ybUNvbnRyb2xsZXIuanMiLCJSYXN0cmVpby9SYXN0cmVpb0ltcG9ydGFudGVMaXN0Q29udHJvbGxlci5qcyIsIlNlbmhhL1NlbmhhRm9ybUNvbnRyb2xsZXIuanMiLCJTZW5oYS9TZW5oYUxpc3RDb250cm9sbGVyLmpzIiwiVXN1YXJpby9Vc3VhcmlvRm9ybUNvbnRyb2xsZXIuanMiLCJV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QUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE1BQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7O1FBSUEsSUFBQSxHQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxNQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxVQUFBLFdBQUE7WUFDQSxNQUFBLE9BQUEsR0FBQSxNQUFBLElBQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7QUNqREEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxPQUFBLFFBQUEsYUFBQSxVQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGFBQUEsT0FBQSxLQUFBLFVBQUEsSUFBQTtZQUNBLGlCQUFBOzs7Ozs7O1FBT0EsR0FBQSxjQUFBLFlBQUEsS0FBQSxVQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE1BQUEsUUFBQTtnQkFDQSxVQUFBLENBQUE7Z0JBQ0EsVUFBQSxHQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7Ozs7OztRQU9BLEdBQUEsV0FBQSxTQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxPQUFBLFNBQUE7O2VBRUEsYUFBQSxLQUFBLFNBQUEs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QUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxjQUFBLFlBQUEsS0FBQSxZQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFFBQUEsUUFBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBOzs7Ozs7O1FBT0EsR0FBQSxXQUFBLFNBQUEsU0FBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLFNBQUEsV0FBQTs7ZUFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsS0FBQSxVQUFBLE1BQUEsR0FBQTs7Ozs7Ozs7OztRQVVBLEdBQUEsVUFBQSxTQUFBLElBQUE7WUFDQSxRQUFBLE9BQUEsSUFBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTtnQkFDQSxHQUFBOzs7OztLQUtBIiwiZmlsZSI6ImNvbnRyb2xsZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEFwcENvbnRyb2xsZXIoJHJvb3RTY29wZSwgZm9jdXMpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZWFyY2hPcGVuID0gZmFsc2U7XG4gICAgICAgIHZtLnVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5zZWFyY2hPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvY3VzKCdzZWFyY2hJbnB1dCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbG9zZSBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgJHJvb3RTY29wZS4kb24oXCJjbG9zZVNlYXJjaFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdJY21zQ29udHJvbGxlcicsIEljbXNDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEljbXNDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXJhIHJlbGF0w7NyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlUmVsYXRvcmlvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvcmVsYXRvcmlvcy9pY21zPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhDb250cm9sbGVyJywgQXV0aENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXV0aENvbnRyb2xsZXIoJGF1dGgsICRodHRwLCAkc3RhdGUsICRyb290U2NvcGUsIGZvY3VzLCBlbnZTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFzdFVzZXInKTtcbiAgICAgICAgaWYgKHZtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICBmb2N1cygncGFzc3dvcmQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvY3VzKCd1c2VybmFtZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ2luXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2dpbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsYXN0VXNlcicsIHZtLnVzZXJuYW1lKTtcbiAgICAgICAgICAgIHZhciBjcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdm0udXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHZtLnBhc3N3b3JkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkYXV0aC5sb2dpbihjcmVkZW50aWFscykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL2F1dGhlbnRpY2F0ZS91c2VyJyk7XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciB1c2VyID0gSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZGF0YS51c2VyKTtcblxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgdXNlcik7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hdXRoZW50aWNhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhLnVzZXI7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NsaWVudGVEZXRhbGhlQ29udHJvbGxlcicsIENsaWVudGVEZXRhbGhlQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBDbGllbnRlRGV0YWxoZUNvbnRyb2xsZXIoJHN0YXRlUGFyYW1zLCBDbGllbnRlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uY2xpZW50ZV9pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0uY2xpZW50ZSAgICA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nICAgID0gZmFsc2U7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uY2xpZW50ZSA9IHt9O1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIENsaWVudGUuZGV0YWlsKHZtLmNsaWVudGVfaWQpLnRoZW4oZnVuY3Rpb24oY2xpZW50ZSkge1xuICAgICAgICAgICAgICAgIHZtLmNsaWVudGUgPSBjbGllbnRlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDbGllbnRlTGlzdENvbnRyb2xsZXInLCBDbGllbnRlTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQ2xpZW50ZUxpc3RDb250cm9sbGVyKENsaWVudGUsIEZpbHRlciwgVGFibGVIZWFkZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpczsgXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgnY2xpZW50ZXMnLCB2bSwge1xuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAnTElLRScsXG4gICAgICAgICAgICAnY2xpZW50ZXMudGF4dmF0JzogICAgICdMSUtFJ1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ2NsaWVudGVzJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlOyBcbiBcbiAgICAgICAgICAgIENsaWVudGUuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnY2xpZW50ZXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGYXR1cmFtZW50b0NvbnRyb2xsZXInLCBGYXR1cmFtZW50b0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRmF0dXJhbWVudG9Db250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ubm90YXMgPSBbXTtcbiAgICAgICAgdm0uY29kaWdvID0ge1xuICAgICAgICAgICAgc2VydmljbzogJzAnXG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdm0uZ2VuZXJhdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIG5vdGFzXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5ub3RhcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbm90YXMvZmF0dXJhbWVudG8nKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihub3Rhcykge1xuICAgICAgICAgICAgICAgIHZtLm5vdGFzID0gbm90YXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlQ29kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gJ0dlcmFuZG8uLi4nO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJjb2RpZ29zL2dlcmFyXCIsIHZtLmNvZGlnby5zZXJ2aWNvKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gcmVzcG9uc2UuY29kaWdvO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KCdlcnJvcicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNvZGlnby5yYXN0cmVpbyA9ICdDw7NkaWdvcyBlc2dvdGFkb3MhJzsgXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICdFcnJvJywgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnbXNnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3dhcm5pbmcnLCAnQXRlbsOnw6NvJywgcmVzcG9uc2UubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uY29kaWdvLm1lbnNhZ2VtID0gcmVzcG9uc2UubXNnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZhdHVyYXIgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5mYXR1cmFyID0gZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJub3Rhcy9mYXR1cmFyXCIsIHBlZGlkb19pZCkuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBmYXR1cmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTGluaGFGb3JtQ29udHJvbGxlcicsIExpbmhhRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTGluaGFGb3JtQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIExpbmhhLCB0b2FzdGVyLCBuZ0RpYWxvZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmxpbmhhID0ge1xuICAgICAgICAgICAgaWQ6ICRzdGF0ZVBhcmFtcy5pZCB8fCBudWxsLFxuICAgICAgICAgICAgYXRyaWJ1dG9zOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBMaW5oYS5nZXQodm0ubGluaGEuaWQpLnRoZW4oZnVuY3Rpb24obGluaGEpIHtcbiAgICAgICAgICAgICAgICB2bS5saW5oYSAgID0gbGluaGE7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB2bS5saW5oYS5hdHJpYnV0b3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2bS5saW5oYS5hdHJpYnV0b3NbaV0ub3Bjb2VzICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5saW5oYS5hdHJpYnV0b3NbaV0ub3Bjb2VzID0gdm0ubGluaGEuYXRyaWJ1dG9zW2ldLm9wY29lcy5zcGxpdCgnOycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHZtLmxpbmhhLmlkKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRpY2lvbmEgdW0gYXRyaWJ1dG9cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubGluaGEuYXRyaWJ1dG9zLnVuc2hpZnQoe30pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgdW0gYXRyaWJ1dG9cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICB2bS5saW5oYS5hdHJpYnV0b3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgYSBsaW5oYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTGluaGEuc2F2ZSh2bS5saW5oYSwgdm0ubGluaGEuaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdMaW5oYSBzYWx2YSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdXRvcy5saW5oYXMuaW5kZXgnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGNsdWkgYSBsaW5oYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTGluaGEuZGVsZXRlKHZtLmxpbmhhLmlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0xpbmhhIGV4Y2x1aWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1dG9zLmxpbmhhcy5pbmRleCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTGluaGFMaXN0Q29udHJvbGxlcicsIExpbmhhTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTGluaGFMaXN0Q29udHJvbGxlcihMaW5oYSwgRmlsdGVyLCBUYWJsZUhlYWRlciwgbmdEaWFsb2cpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpczsgIFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ2xpbmhhcycsIHZtLCB7XG4gICAgICAgICAgICAnbGluaGFzLnRpdHVsbyc6ICdMSUtFJ1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ2xpbmhhcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTsgXG4gXG4gICAgICAgICAgICBMaW5oYS5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydsaW5oYXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGV2b2x1Y2FvRm9ybUNvbnRyb2xsZXInLCBEZXZvbHVjYW9Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9Gb3JtQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIsIERldm9sdWNhbykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIERldm9sdWNhby5nZXQoJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbykudGhlbihmdW5jdGlvbihkZXZvbHVjYW8pIHtcbiAgICAgICAgICAgICAgICB2bS5kZXZvbHVjYW8gPSBkZXZvbHVjYW87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF2bS5kZXZvbHVjYW8pIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHtcbiAgICAgICAgICAgICAgICAvKm1vdGl2b19zdGF0dXM6IHZtLmRldm9sdWNhby5zdGF0dXMsXG4gICAgICAgICAgICAgICAgcmFzdHJlaW9fcmVmOiB7IHZhbG9yOiB2bS5kZXZvbHVjYW8udmFsb3IgfSwqL1xuICAgICAgICAgICAgICAgIHBhZ29fY2xpZW50ZTogJzAnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBEZXZvbHVjYW8uc2F2ZSh2bS5kZXZvbHVjYW8sIHZtLmRldm9sdWNhby5yYXN0cmVpb19pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0Rldm9sdcOnw6NvIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEZXZvbHVjYW9QZW5kZW50ZUxpc3RDb250cm9sbGVyJywgRGV2b2x1Y2FvUGVuZGVudGVMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9QZW5kZW50ZUxpc3RDb250cm9sbGVyKEZpbHRlciwgVGFibGVIZWFkZXIsIERldm9sdWNhbywgUmFzdHJlaW9IZWxwZXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdkZXZvbHVjb2VzJywgdm0sIHtcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb19yYXN0cmVpb3MucmFzdHJlaW8nOiAgICAgICAgICAgICAgICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvX2Rldm9sdWNvZXMuY29kaWdvX2Rldm9sdWNhbyc6ICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9zLmlkJzogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdkZXZvbHVjb2VzJywgdm0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmFzdHJlaW9IZWxwZXIgPSBSYXN0cmVpb0hlbHBlci5pbml0KHZtKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBEZXZvbHVjYW8ucGVuZGluZyh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvX3Jhc3RyZWlvX2Rldm9sdWNvZXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpc3RpY2FGb3JtQ29udHJvbGxlcicsIExvZ2lzdGljYUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExvZ2lzdGljYUZvcm1Db250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIsIExvZ2lzdGljYSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIExvZ2lzdGljYS5nZXQoJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbykudGhlbihmdW5jdGlvbihsb2dpc3RpY2EpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSBsb2dpc3RpY2E7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmxvZ2lzdGljYSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKCF2bS5sb2dpc3RpY2EuYWNhbykgeyAvLyBBcGVuYXMgZm9pIGNhZGFzdHJhZGEgYSBQSVxuICAgICAgICAgICAgdm0ucHJlU2VuZCAgICAgICAgICAgICAgICA9IHRydWU7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EucmFzdHJlaW9fcmVmID0geyB2YWxvcjogdm0ucmFzdHJlaW8udmFsb3IgfTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLmxvZ2lzdGljYSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIExvZ2lzdGljYS5zYXZlKHZtLmxvZ2lzdGljYSwgdm0ubG9naXN0aWNhLnJhc3RyZWlvX2lkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdMb2dpc3RpY2EgcmV2ZXJzYSBzYWx2YSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTWFyY2FGb3JtQ29udHJvbGxlcicsIE1hcmNhRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTWFyY2FGb3JtQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBNYXJjYSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgJHNjb3BlLm5nRGlhbG9nRGF0YS5tYXJjYSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0ubWFyY2EgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5nRGlhbG9nRGF0YS5tYXJjYSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5tYXJjYSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIE1hcmNhLmdldCh2bS5tYXJjYS5pZCkudGhlbihmdW5jdGlvbihtYXJjYSkge1xuICAgICAgICAgICAgICAgIHZtLm1hcmNhICAgPSBtYXJjYTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodm0ubWFyY2EuaWQpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBhIG1hcmNhXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBNYXJjYS5zYXZlKHZtLm1hcmNhLCB2bS5tYXJjYS5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ01hcmNhIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhjbHVpIGEgbWFyY2FcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIE1hcmNhLmRlbGV0ZSh2bS5tYXJjYS5pZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdNYXJjYSBleGNsdWlkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTWFyY2FMaXN0Q29udHJvbGxlcicsIE1hcmNhTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTWFyY2FMaXN0Q29udHJvbGxlcihNYXJjYSwgRmlsdGVyLCBUYWJsZUhlYWRlciwgbmdEaWFsb2cpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdtYXJjYXMnLCB2bSwge1xuICAgICAgICAgICAgJ21hcmNhcy50aXR1bG8nOiAnTElLRSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgnbWFyY2FzJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBNYXJjYS5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydtYXJjYXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyZSBvIGZvcm11bMOhcmlvIGRhIGFtcmNhXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuRm9ybSA9IGZ1bmN0aW9uKG1hcmNhKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL21hcmNhL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hcmNhRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ01hcmNhRm9ybScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBtYXJjYTogbWFyY2EgfHwge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RlbXBsYXRlbWxDb250cm9sbGVyJywgVGVtcGxhdGVtbENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVGVtcGxhdGVtbENvbnRyb2xsZXIoUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgdGVtcGxhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnVybCk7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcInRlbXBsYXRlbWwvZ2VyYXJcIikuY3VzdG9tR0VUKFwiXCIsIHtcbiAgICAgICAgICAgICAgdXJsOiB2bS51cmxcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50ZW1wbGF0ZSA9IHJlc3BvbnNlLnRlbXBsYXRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgU2VhcmNoQ29udHJvbGxlcilcbiAgICAgICAgLmZpbHRlcignaGlnaGxpZ2h0JywgZnVuY3Rpb24oJHNjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQsIHBocmFzZSkge1xuICAgICAgICAgICAgICAgIGlmIChwaHJhc2UpIHRleHQgPSBTdHJpbmcodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKCcoJytwaHJhc2UrJyknLCAnZ2knKSxcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidW5kZXJsaW5lXCI+JDE8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbCh0ZXh0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlYXJjaCA9ICcnO1xuICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsb3NlIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiY2xvc2VTZWFyY2hcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh2bS5zZWFyY2gubGVuZ3RoIDw9IDMpIHtcbiAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKFwic2VhcmNoXCIpLmN1c3RvbUdFVChcIlwiLCB7c2VhcmNoOiB2bS5zZWFyY2h9KS50aGVuKGZ1bmN0aW9uKGJ1c2NhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IGJ1c2NhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXInLCBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyLCBuZ0RpYWxvZywgQ29tZW50YXJpbykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmNvbWVudGFyaW9zID0gW107XG4gICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICB2bS5wZWRpZG9faWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBjb21lbnRhcmlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIENvbWVudGFyaW8uZ2V0RnJvbU9yZGVyKHZtLnBlZGlkb19pZCkudGhlbihmdW5jdGlvbihjb21lbnRhcmlvcykge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvcyA9IGNvbWVudGFyaW9zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIGNvbWVudGFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBDb21lbnRhcmlvLnNhdmUoe1xuICAgICAgICAgICAgICAgICAgICAncGVkaWRvX2lkJzogcGVkaWRvLFxuICAgICAgICAgICAgICAgICAgICAnY29tZW50YXJpbyc6IHZtLmNvbWVudGFyaW9cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB2bS5mb3JtQ29tZW50YXJpby4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdDb21lbnTDoXJpbyBjYWRhc3RyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlc3Ryb3kgY29tZW50w6FyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihjb21lbnRhcmlvKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgQ29tZW50YXJpby5kZWxldGUoY29tZW50YXJpbykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0uY29tZW50YXJpbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdpbmZvJywgJ1N1Y2Vzc28hJywgJ0NvbWVudMOhcmlvIGV4Y2x1w61kbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0RldGFsaGVDb250cm9sbGVyJywgUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBQZWRpZG8sIHRvYXN0ZXIsIFJhc3RyZWlvSGVscGVyLCBOb3RhSGVscGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucGVkaWRvX2lkID0gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5wZWRpZG8gICAgPSB7fTtcbiAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgIHZtLm5vdGFIZWxwZXIgPSBOb3RhSGVscGVyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmFzdHJlaW9IZWxwZXIgPSBSYXN0cmVpb0hlbHBlci5pbml0KHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5wZWRpZG8gID0ge307XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUGVkaWRvLmdldCh2bS5wZWRpZG9faWQpLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvICA9IHBlZGlkbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbHRlcmFyIHN0YXR1cyBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmNoYW5nZVN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9zdGF0dXMnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHN0YXR1c1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTdGF0dXMgZG8gcGVkaWRvIGFsdGVyYWRvIGNvbSBzdWNlc3NvIScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnBlZGlkb3MuaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUHJpb3JpemFyIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uY2hhbmdlUHJpb3JpdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3MvcHJpb3JpZGFkZScsIHZtLnBlZGlkby5pZCkuY3VzdG9tUFVUKHtcbiAgICAgICAgICAgICAgICAncHJpb3JpemFkbyc6ICEodm0ucGVkaWRvLnByaW9yaXphZG8pXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIHByaW9yaXphZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9MaXN0Q29udHJvbGxlcicsIFBlZGlkb0xpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0xpc3RDb250cm9sbGVyKFBlZGlkbywgRmlsdGVyLCBUYWJsZUhlYWRlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3BlZGlkb3MnLCB2bSwge1xuICAgICAgICAgICAgJ3BlZGlkb3MuY29kaWdvX21hcmtldHBsYWNlJzogJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAgICAgICAgJ0xJS0UnXG4gICAgICAgIH0pO1xuIFxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdwZWRpZG9zJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbih0ZXN0ZSkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7IFxuIFxuICAgICAgICAgICAgUGVkaWRvLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ3BlZGlkb3MuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldG9ybmEgYSBjbGFzc2UgZGUgc3RhdHVzIGRvIHBlZGlkbyBcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbSAge1BlZGlkb30gcGVkaWRvIFxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnBhcnNlU3RhdHVzQ2xhc3MgPSBmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgIHN3aXRjaCAocGVkaWRvLnN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdpbmZvJztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnd2FybmluZyc7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGFuZ2VyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpRm9ybUNvbnRyb2xsZXInLCBQaUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBpRm9ybUNvbnRyb2xsZXIoUGksICRzY29wZSwgdG9hc3RlciwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQaS5nZXQoJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbykudGhlbihmdW5jdGlvbihwaSkge1xuICAgICAgICAgICAgICAgIHZtLnBpICAgICAgPSBwaTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnBpID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgYXMgaW5mb3JtYcOnw7VlcyBkYSBQSVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUGkuc2F2ZSh2bS5waSwgdm0ucGkucmFzdHJlaW9faWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBkZSBpbmZvcm1hw6fDo28gc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBQSVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblBpID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5mb1BpID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBub21lOiB2bS5yYXN0cmVpby5wZWRpZG8uY2xpZW50ZS5ub21lLFxuICAgICAgICAgICAgICAgIGNlcDogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmNlcCxcbiAgICAgICAgICAgICAgICBlbmRlcmVjbzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLnJ1YSxcbiAgICAgICAgICAgICAgICBudW1lcm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5udW1lcm8sXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudG86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jb21wbGVtZW50byxcbiAgICAgICAgICAgICAgICBiYWlycm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5iYWlycm8sXG4gICAgICAgICAgICAgICAgZGF0YTogdm0ucmFzdHJlaW8uZGF0YV9lbnZpb19yZWFkYWJsZSxcbiAgICAgICAgICAgICAgICB0aXBvOiB2bS5yYXN0cmVpby5zZXJ2aWNvLFxuICAgICAgICAgICAgICAgIHN0YXR1czogKHZtLnJhc3RyZWlvLnN0YXR1cyA9PSAzKSA/ICdlJyA6ICdhJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Mi5jb3JyZWlvcy5jb20uYnIvc2lzdGVtYXMvZmFsZWNvbW9zY29ycmVpb3MvPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihpbmZvUGkpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpUGVuZGVudGVMaXN0Q29udHJvbGxlcicsIFBpUGVuZGVudGVMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaVBlbmRlbnRlTGlzdENvbnRyb2xsZXIoRmlsdGVyLCBUYWJsZUhlYWRlciwgUGksIG5nRGlhbG9nLCB0b2FzdGVyLCBSYXN0cmVpb0hlbHBlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3BpcycsIHZtLCB7XG4gICAgICAgICAgICAnY2xpZW50ZXMubm9tZSc6ICAgICAgICAgICAgICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvcy5yYXN0cmVpbyc6ICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvcy5jb2RpZ29fbWFya2V0cGxhY2UnOiAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvX3Bpcy5jb2RpZ29fcGknOiAnTElLRSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncGlzJywgdm0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmFzdHJlaW9IZWxwZXIgPSBSYXN0cmVpb0hlbHBlci5pbml0KHZtKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQaS5wZW5kaW5nKHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9fcmFzdHJlaW9fcGlzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdGFyQ29udHJvbGxlcicsIEVkaXRhckNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRWRpdGFyQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyLCBSYXN0cmVpbykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJhc3RyZWlvLmdldCgkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvKS50aGVuKGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICAgICAgdm0ucmFzdHJlaW8gPSByYXN0cmVpbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5yYXN0cmVpbyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSYXN0cmVpby5zYXZlKHZtLnJhc3RyZWlvLCB2bS5yYXN0cmVpby5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGVkaXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdSYXN0cmVpb0ltcG9ydGFudGVMaXN0Q29udHJvbGxlcicsIFJhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFJhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyKFJhc3RyZWlvLCBGaWx0ZXIsIFRhYmxlSGVhZGVyLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgncmFzdHJlaW9zJywgdm0sIHtcbiAgICAgICAgICAgICdwZWRpZG9zLmNvZGlnb19tYXJrZXRwbGFjZSc6ICdMSUtFJyxcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9fcmFzdHJlaW9zLnJhc3RyZWlvJzogICdMSUtFJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdyYXN0cmVpb3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJhc3RyZWlvLmltcG9ydGFudCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvX3Jhc3RyZWlvcy4qJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZW5oYUZvcm1Db250cm9sbGVyJywgU2VuaGFGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBTZW5oYUZvcm1Db250cm9sbGVyKFNlbmhhLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZW5oYSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnNlbmhhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgYXMgaW5mb3JtYcOnw7VlcyBkYSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBTZW5oYS5zYXZlKHZtLnNlbmhhLCB2bS5zZW5oYS5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlbmhhTGlzdENvbnRyb2xsZXInLCBTZW5oYUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFNlbmhhTGlzdENvbnRyb2xsZXIoU2VuaGEsIFRhYmxlSGVhZGVyLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3NlbmhhcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiBcbiAgICAgICAgICAgIFNlbmhhLmZyb21Vc2VyKCRzdGF0ZVBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2UsIFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkZSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuRm9ybSA9IGZ1bmN0aW9uKHNlbmhhKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL3NlbmhhL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlbmhhRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1NlbmhhRm9ybScsIFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VuaGE6IHNlbmhhIHx8IHsgdXN1YXJpb19pZDogJHN0YXRlUGFyYW1zLmlkIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtICB7aW50fSBzZW5oYSBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gICAgICAgXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIFNlbmhhLmRlbGV0ZShpZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTZW5oYSBkZWxldGFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9Gb3JtQ29udHJvbGxlcicsIFVzdWFyaW9Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvRm9ybUNvbnRyb2xsZXIoVXN1YXJpbywgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXN1YXJpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnVzdWFyaW8pO1xuXG4gICAgICAgIC8vIEFwZW5hcyBwYXJhIGVkacOnw6NvXG4gICAgICAgIHZtLnVzdWFyaW8ubm92YXNSb2xlcyA9IFtdO1xuICAgICAgICBpZiAodm0udXN1YXJpby5oYXNPd25Qcm9wZXJ0eSgncm9sZXMnKSkge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnVzdWFyaW8ucm9sZXMsIGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgICAgICAgICB2bS51c3VhcmlvLm5vdmFzUm9sZXNbcm9sZS5pZF0gPSByb2xlLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBVc3VhcmlvLnNhdmUodm0udXN1YXJpbywgdm0udXN1YXJpby5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1VzdcOhcmlvIHNhbHZvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVc3VhcmlvTGlzdENvbnRyb2xsZXInLCBVc3VhcmlvTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXN1YXJpb0xpc3RDb250cm9sbGVyKFVzdWFyaW8sIFRhYmxlSGVhZGVyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3VzdWFyaW9zJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBVc3VhcmlvLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuRm9ybSA9IGZ1bmN0aW9uKHVzdWFyaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvdXN1YXJpby9mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc3VhcmlvRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1VzdWFyaW9Gb3JtJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzdWFyaW86IHVzdWFyaW8gfHwge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtICB7aW50fSAgaWQgXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9ICAgIFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBVc3VhcmlvLmRlbGV0ZShpZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdVc3XDoXJpbyBkZWxldGFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
