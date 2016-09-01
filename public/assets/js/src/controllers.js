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

    DevolucaoFormController.$inject = ["$rootScope", "$scope", "toaster", "Devolucao"];
    angular
        .module('MeuTucano')
        .controller('DevolucaoFormController', DevolucaoFormController);

    function DevolucaoFormController($rootScope, $scope, toaster, Devolucao) {
        var vm = this;

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.devolucao = $scope.ngDialogData.rastreio;
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

    ClienteDetalheController.$inject = ["$stateParams", "Cliente", "ClienteEnderecoHelper"];
    angular
        .module('MeuTucano')
        .controller('ClienteDetalheController', ClienteDetalheController);

    function ClienteDetalheController($stateParams, Cliente, ClienteEnderecoHelper) {
        var vm = this;

        vm.cliente_id = $stateParams.id;
        vm.cliente    = {};
        vm.loading    = false;

        /**
         * @type {Object}
         */
        vm.clienteEnderecoHelper = ClienteEnderecoHelper.init(vm);

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

    LogisticaFormController.$inject = ["Restangular", "$rootScope", "$scope", "toaster", "Logistica"];
    angular
        .module('MeuTucano')
        .controller('LogisticaFormController', LogisticaFormController);

    function LogisticaFormController(Restangular, $rootScope, $scope, toaster, Logistica) {
        var vm = this;

        if (typeof $scope.ngDialogData.rastreio != 'undefined') {
            vm.logistica = $scope.ngDialogData.rastreio;
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
        vm.save = function() {
            vm.loading = true;

            Comentario.save({
                'pedido_id':  vm.pedido_id,
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
                vm.load();
                toaster.pop('success', 'Sucesso!', 'Comentário excluído com sucesso!');
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

        vm.pedido_id  = $stateParams.id;
        vm.pedido     = {};
        vm.loading    = false;
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

        /**
         * Retorna a classe de status do pedido
         *
         * @return {string}
         */
        vm.parseStatusClass = function() {
            switch (vm.pedido.status) {
                case 1:
                case 2:
                    return 'info';
                case 3:
                    return 'success';
                case 4:
                case 5:
                    return 'danger';
            }
        };

        /**
         * Retorna a classe de status do rastreio
         *
         * @return {string}
         */
        vm.parseRastreioStatusClass = function(rastreio) {
            switch (rastreio.status) {
                case 1:
                case 7:
                case 8:
                    return 'info';
                case 2:
                    return 'warning';
                case 4:
                    return 'success';
                case 3:
                case 5:
                case 6:
                    return 'danger';
            }
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
                case 2:
                    return 'info';
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
            vm.pi = $scope.ngDialogData.rastreio;
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

    ProdutoFormController.$inject = ["$stateParams", "Produto", "toaster", "TabsHelper", "Linha", "Marca", "Atributo"];
    angular
        .module('MeuTucano')
        .controller('ProdutoFormController', ProdutoFormController);

    function ProdutoFormController($stateParams, Produto, toaster, TabsHelper, Linha, Marca, Atributo) {
        var vm = this;

        vm.produto = {
            sku: $stateParams.sku || null,
            unidade: 'un',
            ativo: '1'
        };

        vm.tabsHelper = TabsHelper;
        vm.linhas = {};
        vm.marcas = {};
        vm.atributos = {};

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(produto) {
                vm.produto = produto;

                if (!vm.produto.unidade)
                    vm.produto.unidade = 'un';

                if (vm.produto.ativo === null)
                    vm.produto.ativo = '1';

                if (vm.produto.linha_id)
                    vm.loadAtributos();

                vm.loading = false;
            });
        };

        vm.loadMarcas = function() {
            vm.loading = true;

            Marca.getList().then(function(marcas) {
                vm.marcas = marcas;
                vm.loading = false;
            });
        };

        vm.loadLinhas = function() {
            vm.loading = true;

            Linha.getList().then(function(linhas) {
                vm.linhas = linhas;
                vm.loading = false;
            });
        };

        vm.loadAtributos = function() {
            vm.loading = true;

            Atributo.fromLinha(vm.produto.linha_id).then(function(atributos) {
                vm.atributos = atributos;
                vm.loading = false;
            });
        };

        if (vm.produto.sku)
            vm.load();

        if (vm.produto.linha_id)
            vm.loadAtributos();

        vm.loadMarcas();
        vm.loadLinhas();

        vm.linhaChange = function() {
            vm.produto.linha_id = vm.produto.linha.id;
            vm.loadAtributos();
        };

        /**
         * Salva o produto
         *
         * @return {void}
         */
        vm.save = function() {
            Produto.save(vm.produto, vm.produto.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto salvo com sucesso!');
            });
        };

        /**
         * Exclui o produto
         *
         * @return {void}
         */
        vm.destroy = function() {
            Produto.delete(vm.produto.id).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto excluido com sucesso!');
            });
        };
    }
})();
(function() {
    'use strict';

    ProdutoListController.$inject = ["Filter", "TableHeader", "Produto"];
    angular
        .module('MeuTucano')
        .controller('ProdutoListController', ProdutoListController);

    function ProdutoListController(Filter, TableHeader, Produto) {
        var vm = this;

        /**
         * Filtros
         * @type {Filter}
         */
        vm.filterList = Filter.init('produtos', vm, {
            'produtos.titulo': 'LIKE'
        });

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('produtos', vm);

        vm.load = function() {
            vm.loading = true;

            Produto.getList({
                fields:   ['produtos.*'],
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
            vm.rastreio = $scope.ngDialogData.rastreio;
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
(function() {
    'use strict';

    EnderecoFormController.$inject = ["Cliente", "$scope", "toaster"];
    angular
        .module('MeuTucano')
        .controller('EnderecoFormController', EnderecoFormController);

    function EnderecoFormController(Cliente, $scope, toaster) {
        var vm = this;

        vm.cliente = angular.copy($scope.ngDialogData.cliente);

        /**
         * Salva as informações da cliente
         *
         * @return {void}
         */
        vm.save = function() {
            Cliente.save(vm.cliente, vm.cliente.id || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Endereço(s) salvo com sucesso!');
                $scope.closeThisDialog(true);
            });
        };
    }

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQXV0aC9BdXRoQ29udHJvbGxlci5qcyIsIkFkbWluL0ljbXNDb250cm9sbGVyLmpzIiwiRGV2b2x1Y2FvL0Rldm9sdWNhb0Zvcm1Db250cm9sbGVyLmpzIiwiRGV2b2x1Y2FvL0Rldm9sdWNhb1BlbmRlbnRlTGlzdENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0NsaWVudGVEZXRhbGhlQ29udHJvbGxlci5qcyIsIkNsaWVudGUvQ2xpZW50ZUxpc3RDb250cm9sbGVyLmpzIiwiRmF0dXJhbWVudG8vRmF0dXJhbWVudG9Db250cm9sbGVyLmpzIiwiTGluaGEvTGluaGFGb3JtQ29udHJvbGxlci5qcyIsIkxpbmhhL0xpbmhhTGlzdENvbnRyb2xsZXIuanMiLCJMb2dpc3RpY2EvTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIuanMiLCJNYXJjYS9NYXJjYUZvcm1Db250cm9sbGVyLmpzIiwiTWFyY2EvTWFyY2FMaXN0Q29udHJvbGxlci5qcyIsIk1hcmtldGluZy9UZW1wbGF0ZW1sQ29udHJvbGxlci5qcyIsIlBhcnRpYWxzL1NlYXJjaENvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvTGlzdENvbnRyb2xsZXIuanMiLCJQaS9QaUZvcm1Db250cm9sbGVyLmpzIiwiUGkvUGlQZW5kZW50ZUxpc3RDb250cm9sbGVyLmpzIiwiUHJvZHV0by9Qcm9kdXRvRm9ybUNvbnRyb2xsZXIuanMiLCJQcm9kdXRvL1Byb2R1dG9MaXN0Q29udHJvbGxlci5qcyIsIlJhc3RyZWlvL1Jhc3RyZWlvRWRpdEZvcm1Db250cm9sbGVyLmpzIiwiUmFzdHJlaW8vUmFzdHJlaW9JbXBvcnRhbnRlTGlzdENvbnRyb2xsZXIuanMiLCJTZW5oYS9TZW5oYUZvcm1Db250cm9sbGVyLmpzIiwiU2VuaGEvU2VuaGFMaXN0Q29udHJvbGxlci5qcyIsIlVzdWFyaW8vVXN1YXJpb0Zvcm1Db250cm9sbGVyLmpzIiwiVXN1YXJpby9Vc3VhcmlvTGlzdENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0VuZGVyZWNvL0VuZGVyZWNvRm9ybUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsaUJBQUE7O0lBRUEsU0FBQSxjQUFBLFlBQUEsT0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsV0FBQTs7Ozs7UUFLQSxHQUFBLGFBQUEsV0FBQTtZQUNBLEdBQUEsYUFBQTtZQUNBLE1BQUE7Ozs7OztRQU1BLFdBQUEsSUFBQSxlQUFBLFVBQUE7WUFDQSxHQUFBLGFBQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLHNCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztBQ1JBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGtCQUFBOztJQUVBLFNBQUEsZUFBQSxPQUFBLE9BQUEsUUFBQSxZQUFBLE9BQUEsWUFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFdBQUEsYUFBQSxRQUFBO1FBQ0EsSUFBQSxHQUFBLFVBQUE7WUFDQSxNQUFBO2VBQ0E7WUFDQSxNQUFBOzs7Ozs7UUFNQSxHQUFBLFFBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxhQUFBLFFBQUEsWUFBQSxHQUFBO1lBQ0EsSUFBQSxjQUFBO2dCQUNBLFVBQUEsR0FBQTtnQkFDQSxVQUFBLEdBQUE7OztZQUdBLE1BQUEsTUFBQSxhQUFBLEtBQUEsV0FBQTtnQkFDQSxPQUFBLE1BQUEsSUFBQSxXQUFBLEtBQUEsWUFBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQTtnQkFDQSxJQUFB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QUE7Ozs7Ozs7O1FBUUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxNQUFBLEtBQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxVQUFBLFdBQUE7WUFDQSxNQUFBLE9BQUEsR0FBQSxNQUFBLElBQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7QUNqREEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxPQUFBLFFBQUEsYUFBQSxVQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGFBQUEsT0FBQSxLQUFBLFVBQUEsSUFBQTtZQUNBLGlCQUFBOzs7Ozs7O1FBT0EsR0FBQSxjQUFBLFlBQUEsS0FBQSxVQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE1BQUEsUUFBQTtnQkFDQSxVQUFBLENBQUE7Z0JBQ0EsVUFBQSxHQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7Ozs7OztRQU9BLEdBQUEsV0FBQSxTQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxPQUFBLFNBQUE7O2VBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLEtBQUEsVUFBQSxNQUFBLEdBQUE7Ozs7O0FDckRBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHdCQUFBOztJQUVBLFNBQUEscUJBQUEsYUFBQTtRQUNBLElBQUEsS0FBQTs7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LFNBQUE7Z0JBQ0EsR0FBQSxVQUFBOztnQkFFQSxJQUFBLENBQUEsR0FBQSxRQUFBO29CQUNBLEdBQUEsUUFBQSxVQUFBOztnQkFFQSxJQUFBLEdBQUEsUUFBQSxVQUFBO29CQUNBLEdBQUEsUUFBQSxRQUFBOztnQkFFQSxJQUFBLEdBQUEsUUFBQTtvQkFDQSxHQUFBOztnQkFFQSxHQUFBLFVBQUE7Ozs7UUFJQSxHQUFBLGFBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLFVBQUEsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTs7OztRQUlBLEdBQUEsYUFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE1BQUEsVUFBQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBLFNBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7O1FBSUEsR0FBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFNBQUEsVUFBQSxHQUFBLFFBQUEsVUFBQSxLQUFBLFNBQUEsV0FBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxVQUFBOzs7O1FBSUEsSUFBQSxHQUFBLFFBQUE7WUFDQSxHQUFBOztRQUVBLElBQUEsR0FBQSxRQUFBO1lBQ0EsR0FBQTs7UUFFQSxHQUFBO1FBQ0EsR0FBQTs7UUFFQSxHQUFBLGNBQUEsV0FBQTtZQUNBLEdBQUEsUUFBQSxXQUFBLEdBQUEsUUFBQSxNQUFBO1lBQ0EsR0FBQTs7Ozs7Ozs7UUFRQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFFBQUEsS0FBQSxHQUFBLFNBQUEsR0FBQSxRQUFBLE1BQUEsTUFBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxVQUFBLFdBQUE7WUFDQSxRQUFBLE9BQUEsR0FBQSxRQUFBLElBQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7O0FDbkdBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsUUFBQSxhQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsYUFBQSxPQUFBLEtBQUEsWUFBQSxJQUFBO1lBQ0EsbUJBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFlBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsUUFBQSxRQUFBO2dCQUNBLFVBQUEsQ0FBQTtnQkFDQSxVQUFBLEdBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxZQUFBOzs7O1FBSUEsR0FBQTs7O0FDdENBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLG9CQUFBOztJQUVBLFNBQUEsaUJBQUEsYUFBQSxZQUFBLFFBQUEsU0FBQSxVQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLElBQUEsT0FBQSxPQUFBLGFBQUEsWUFBQSxhQUFBO1lBQ0EsR0FBQSxXQUFBLE9BQUEsYUFBQTtlQUNBO1lBQ0EsR0FBQSxXQUFBOzs7Ozs7UUFNQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFNBQUEsS0FBQSxHQUFBLFVBQUEsR0FBQSxTQUFBLE1BQUEsTUFBQSxLQUFBLFdBQUE7Z0JBQ0EsT0FBQSxnQkFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7OztBQ3RCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQ0FBQTs7SUFFQSxTQUFBLGlDQUFBLFVBQUEsUUFBQSxhQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsYUFBQSxPQUFBLEtBQUEsYUFBQSxJQUFBO1lBQ0EsOEJBQUE7WUFDQSw4QkFBQTtZQUNBLDhCQUFBOzs7Ozs7O1FBT0EsR0FBQSxjQUFBLFlBQUEsS0FBQSxhQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFNBQUEsVUFBQTtnQkFDQSxVQUFBLENBQUE7Z0JBQ0EsVUFBQSxHQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7Ozs7QUN2Q0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxPQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTs7Ozs7OztRQU9BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsTUFBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7OztBQ3BCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLE9BQUEsYUFBQSxjQUFBLGFBQUEsVUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFVBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsTUFBQSxTQUFBLGFBQUEsSUFBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBOzs7Ozs7O1FBT0EsR0FBQSxXQUFBLFNBQUEsT0FBQTtZQUNBLFNBQUEsS0FBQTtnQkFDQSxVQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxFQUFBLFlBQUEsYUFBQTs7ZUFFQSxhQUFBLEtBQUEsU0FBQSxNQUFBO2dCQUNBLElBQUEsS0FBQSxVQUFBLE1BQUEsR0FBQTs7Ozs7Ozs7OztRQVVBLEdBQUEsVUFBQSxTQUFBLElBQUE7WUFDQSxNQUFBLE9BQUEsSUFBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTtnQkFDQSxHQUFBOzs7Ozs7QUN4REEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxTQUFBLFlBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsVUFBQSxRQUFBLEtBQUEsT0FBQSxhQUFBOzs7UUFHQSxHQUFBLFFBQUEsYUFBQTtRQUNBLElBQUEsR0FBQSxRQUFBLGVBQUEsVUFBQTtZQUNBLFFBQUEsUUFBQSxHQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUE7Z0JBQ0EsR0FBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLEtBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsUUFBQSxLQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUEsTUFBQSxNQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7OztBQzVCQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx5QkFBQTs7SUFFQSxTQUFBLHNCQUFBLFNBQUEsYUFBQSxVQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsY0FBQSxZQUFBLEtBQUEsWUFBQTs7UUFFQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxRQUFBLFFBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7Ozs7OztRQU9BLEdBQUEsV0FBQSxTQUFBLFNBQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxTQUFBLFdBQUE7O2VBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLEtBQUEsVUFBQSxNQUFBLEdBQUE7Ozs7Ozs7Ozs7UUFVQSxHQUFBLFVBQUEsU0FBQSxJQUFBO1lBQ0EsUUFBQSxPQUFBLElBQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsR0FBQTs7Ozs7O0FDeERBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDBCQUFBOztJQUVBLFNBQUEsdUJBQUEsU0FBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxVQUFBLFFBQUEsS0FBQSxPQUFBLGFBQUE7Ozs7Ozs7UUFPQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFFBQUEsS0FBQSxHQUFBLFNBQUEsR0FBQSxRQUFBLE1BQUEsTUFBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTtnQkFDQSxPQUFBLGdCQUFBOzs7OztLQUtBIiwiZmlsZSI6ImNvbnRyb2xsZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEFwcENvbnRyb2xsZXIoJHJvb3RTY29wZSwgZm9jdXMpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZWFyY2hPcGVuID0gZmFsc2U7XG4gICAgICAgIHZtLnVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuU2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5zZWFyY2hPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvY3VzKCdzZWFyY2hJbnB1dCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbG9zZSBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgJHJvb3RTY29wZS4kb24oXCJjbG9zZVNlYXJjaFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBdXRoQ29udHJvbGxlcicsIEF1dGhDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEF1dGhDb250cm9sbGVyKCRhdXRoLCAkaHR0cCwgJHN0YXRlLCAkcm9vdFNjb3BlLCBmb2N1cywgZW52U2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnVzZXJuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhc3RVc2VyJyk7XG4gICAgICAgIGlmICh2bS51c2VybmFtZSkge1xuICAgICAgICAgICAgZm9jdXMoJ3Bhc3N3b3JkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb2N1cygndXNlcm5hbWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2dpblxuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdFVzZXInLCB2bS51c2VybmFtZSk7XG4gICAgICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHZtLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9hdXRoZW50aWNhdGUvdXNlcicpO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlciA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmRhdGEudXNlcik7XG5cbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIHVzZXIpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdJY21zQ29udHJvbGxlcicsIEljbXNDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEljbXNDb250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCBlbnZTZXJ2aWNlLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXJhIHJlbGF0w7NyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlUmVsYXRvcmlvID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXV0aCA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXRlbGxpemVyX3Rva2VuXCIpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvcmVsYXRvcmlvcy9pY21zPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihhdXRoKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rldm9sdWNhb0Zvcm1Db250cm9sbGVyJywgRGV2b2x1Y2FvRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRGV2b2x1Y2FvRm9ybUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyLCBEZXZvbHVjYW8pIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5kZXZvbHVjYW8gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdm0uZGV2b2x1Y2FvKSB7XG4gICAgICAgICAgICB2bS5kZXZvbHVjYW8gPSB7XG4gICAgICAgICAgICAgICAgLyptb3Rpdm9fc3RhdHVzOiB2bS5kZXZvbHVjYW8uc3RhdHVzLFxuICAgICAgICAgICAgICAgIHJhc3RyZWlvX3JlZjogeyB2YWxvcjogdm0uZGV2b2x1Y2FvLnZhbG9yIH0sKi9cbiAgICAgICAgICAgICAgICBwYWdvX2NsaWVudGU6ICcwJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgRGV2b2x1Y2FvLnNhdmUodm0uZGV2b2x1Y2FvLCB2bS5kZXZvbHVjYW8ucmFzdHJlaW9faWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdEZXZvbHXDp8OjbyBjcmlhZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGV2b2x1Y2FvUGVuZGVudGVMaXN0Q29udHJvbGxlcicsIERldm9sdWNhb1BlbmRlbnRlTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRGV2b2x1Y2FvUGVuZGVudGVMaXN0Q29udHJvbGxlcihGaWx0ZXIsIFRhYmxlSGVhZGVyLCBEZXZvbHVjYW8sIFJhc3RyZWlvSGVscGVyLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgnZGV2b2x1Y29lcycsIHZtLCB7XG4gICAgICAgICAgICAnY2xpZW50ZXMubm9tZSc6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9fcmFzdHJlaW9zLnJhc3RyZWlvJzogICAgICAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb19yYXN0cmVpb19kZXZvbHVjb2VzLmNvZGlnb19kZXZvbHVjYW8nOiAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvcy5pZCc6ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdMSUtFJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgnZGV2b2x1Y29lcycsIHZtKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnJhc3RyZWlvSGVscGVyID0gUmFzdHJlaW9IZWxwZXIuaW5pdCh2bSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgcmFzdHJlaW9zXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgRGV2b2x1Y2FvLnBlbmRpbmcoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ3BlZGlkb19yYXN0cmVpb19kZXZvbHVjb2VzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQ2xpZW50ZURldGFsaGVDb250cm9sbGVyJywgQ2xpZW50ZURldGFsaGVDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIENsaWVudGVEZXRhbGhlQ29udHJvbGxlcigkc3RhdGVQYXJhbXMsIENsaWVudGUsIENsaWVudGVFbmRlcmVjb0hlbHBlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmNsaWVudGVfaWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLmNsaWVudGUgICAgPSB7fTtcbiAgICAgICAgdm0ubG9hZGluZyAgICA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uY2xpZW50ZUVuZGVyZWNvSGVscGVyID0gQ2xpZW50ZUVuZGVyZWNvSGVscGVyLmluaXQodm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmNsaWVudGUgPSB7fTtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBDbGllbnRlLmRldGFpbCh2bS5jbGllbnRlX2lkKS50aGVuKGZ1bmN0aW9uKGNsaWVudGUpIHtcbiAgICAgICAgICAgICAgICB2bS5jbGllbnRlID0gY2xpZW50ZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQ2xpZW50ZUxpc3RDb250cm9sbGVyJywgQ2xpZW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIENsaWVudGVMaXN0Q29udHJvbGxlcihDbGllbnRlLCBGaWx0ZXIsIFRhYmxlSGVhZGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7IFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ2NsaWVudGVzJywgdm0sIHtcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLnRheHZhdCc6ICAgICAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdjbGllbnRlcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTsgXG4gXG4gICAgICAgICAgICBDbGllbnRlLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ2NsaWVudGVzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRmF0dXJhbWVudG9Db250cm9sbGVyJywgRmF0dXJhbWVudG9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEZhdHVyYW1lbnRvQ29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLm5vdGFzID0gW107XG4gICAgICAgIHZtLmNvZGlnbyA9IHtcbiAgICAgICAgICAgIHNlcnZpY286ICcwJ1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHZtLmdlbmVyYXRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBub3Rhc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubm90YXMgPSBbXTtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoJ25vdGFzL2ZhdHVyYW1lbnRvJykuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24obm90YXMpIHtcbiAgICAgICAgICAgICAgICB2bS5ub3RhcyA9IG5vdGFzO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIHJhc3RyZWlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZUNvZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmNvZGlnby5yYXN0cmVpbyA9ICdHZXJhbmRvLi4uJztcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKFwiY29kaWdvcy9nZXJhclwiLCB2bS5jb2RpZ28uc2VydmljbykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLmNvZGlnby5yYXN0cmVpbyA9IHJlc3BvbnNlLmNvZGlnbztcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnZXJyb3InKSkge1xuICAgICAgICAgICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSAnQ8OzZGlnb3MgZXNnb3RhZG9zISc7IFxuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCAnRXJybycsIHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ21zZycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCd3YXJuaW5nJywgJ0F0ZW7Dp8OjbycsIHJlc3BvbnNlLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZtLmNvZGlnby5tZW5zYWdlbSA9IHJlc3BvbnNlLm1zZztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGYXR1cmFyIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmF0dXJhciA9IGZ1bmN0aW9uKHBlZGlkb19pZCkge1xuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKFwibm90YXMvZmF0dXJhclwiLCBwZWRpZG9faWQpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZmF0dXJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmhhRm9ybUNvbnRyb2xsZXInLCBMaW5oYUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExpbmhhRm9ybUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBMaW5oYSwgdG9hc3RlciwgbmdEaWFsb2cpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5saW5oYSA9IHtcbiAgICAgICAgICAgIGlkOiAkc3RhdGVQYXJhbXMuaWQgfHwgbnVsbCxcbiAgICAgICAgICAgIGF0cmlidXRvczogW11cbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgTGluaGEuZ2V0KHZtLmxpbmhhLmlkKS50aGVuKGZ1bmN0aW9uKGxpbmhhKSB7XG4gICAgICAgICAgICAgICAgdm0ubGluaGEgICA9IGxpbmhhO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2bS5saW5oYS5pZCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkaWNpb25hIHVtIGF0cmlidXRvXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxpbmhhLmF0cmlidXRvcy51bnNoaWZ0KHt9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIHVtIGF0cmlidXRvXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5yZW1vdmVBdHRyaWJ1dGUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgdm0ubGluaGEuYXRyaWJ1dG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGEgbGluaGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIExpbmhhLnNhdmUodm0ubGluaGEsIHZtLmxpbmhhLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTGluaGEgc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHV0b3MubGluaGFzLmluZGV4Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhjbHVpIGEgbGluaGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIExpbmhhLmRlbGV0ZSh2bS5saW5oYS5pZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdMaW5oYSBleGNsdWlkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdXRvcy5saW5oYXMuaW5kZXgnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmhhTGlzdENvbnRyb2xsZXInLCBMaW5oYUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExpbmhhTGlzdENvbnRyb2xsZXIoTGluaGEsIEZpbHRlciwgVGFibGVIZWFkZXIsIG5nRGlhbG9nKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7ICBcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdsaW5oYXMnLCB2bSwge1xuICAgICAgICAgICAgJ2xpbmhhcy50aXR1bG8nOiAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdsaW5oYXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7IFxuIFxuICAgICAgICAgICAgTGluaGEuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnbGluaGFzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2lzdGljYUZvcm1Db250cm9sbGVyJywgTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgTG9naXN0aWNhKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ubG9naXN0aWNhID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICBpZiAoIXZtLmxvZ2lzdGljYS5hY2FvKSB7IC8vIEFwZW5hcyBmb2kgY2FkYXN0cmFkYSBhIFBJXG4gICAgICAgICAgICB2bS5wcmVTZW5kICAgICAgICAgICAgICAgID0gdHJ1ZTtcbiAgICAgICAgICAgIHZtLmxvZ2lzdGljYS5yYXN0cmVpb19yZWYgPSB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2codm0ubG9naXN0aWNhKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTG9naXN0aWNhLnNhdmUodm0ubG9naXN0aWNhLCB2bS5sb2dpc3RpY2EucmFzdHJlaW9faWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0xvZ2lzdGljYSByZXZlcnNhIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdNYXJjYUZvcm1Db250cm9sbGVyJywgTWFyY2FGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNYXJjYUZvcm1Db250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIE1hcmNhLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc2NvcGUubmdEaWFsb2dEYXRhLm1hcmNhICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2bS5tYXJjYSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLm1hcmNhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLm1hcmNhID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgTWFyY2EuZ2V0KHZtLm1hcmNhLmlkKS50aGVuKGZ1bmN0aW9uKG1hcmNhKSB7XG4gICAgICAgICAgICAgICAgdm0ubWFyY2EgICA9IG1hcmNhO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2bS5tYXJjYS5pZCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGEgbWFyY2FcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIE1hcmNhLnNhdmUodm0ubWFyY2EsIHZtLm1hcmNhLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTWFyY2Egc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGNsdWkgYSBtYXJjYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWFyY2EuZGVsZXRlKHZtLm1hcmNhLmlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ01hcmNhIGV4Y2x1aWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdNYXJjYUxpc3RDb250cm9sbGVyJywgTWFyY2FMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNYXJjYUxpc3RDb250cm9sbGVyKE1hcmNhLCBGaWx0ZXIsIFRhYmxlSGVhZGVyLCBuZ0RpYWxvZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ21hcmNhcycsIHZtLCB7XG4gICAgICAgICAgICAnbWFyY2FzLnRpdHVsbyc6ICdMSUtFJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdtYXJjYXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIE1hcmNhLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ21hcmNhcy4qJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBYnJlIG8gZm9ybXVsw6FyaW8gZGEgYW1yY2FcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24obWFyY2EpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvbWFyY2EvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFyY2FGb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnTWFyY2FGb3JtJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmNhOiBtYXJjYSB8fCB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVGVtcGxhdGVtbENvbnRyb2xsZXInLCBUZW1wbGF0ZW1sQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBUZW1wbGF0ZW1sQ29udHJvbGxlcihSZXN0YW5ndWxhcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSB0ZW1wbGF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZ2VuZXJhdGVUZW1wbGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codm0udXJsKTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKFwidGVtcGxhdGVtbC9nZXJhclwiKS5jdXN0b21HRVQoXCJcIiwge1xuICAgICAgICAgICAgICB1cmw6IHZtLnVybFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRlbXBsYXRlID0gcmVzcG9uc2UudGVtcGxhdGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlYXJjaENvbnRyb2xsZXInLCBTZWFyY2hDb250cm9sbGVyKVxuICAgICAgICAuZmlsdGVyKCdoaWdobGlnaHQnLCBmdW5jdGlvbigkc2NlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odGV4dCwgcGhyYXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBocmFzZSkgdGV4dCA9IFN0cmluZyh0ZXh0KS5yZXBsYWNlKG5ldyBSZWdFeHAoJygnK3BocmFzZSsnKScsICdnaScpLFxuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ1bmRlcmxpbmVcIj4kMTwvc3Bhbj4nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiBTZWFyY2hDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VhcmNoID0gJyc7XG4gICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xvc2Ugc2VhcmNoIG92ZXJsYXlcbiAgICAgICAgICovXG4gICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJjbG9zZVNlYXJjaFwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBzZWFyY2ggcmVzdWx0c1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHZtLnNlYXJjaC5sZW5ndGggPD0gMykge1xuICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0ge307XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBSZXN0YW5ndWxhci5hbGwoXCJzZWFyY2hcIikuY3VzdG9tR0VUKFwiXCIsIHtzZWFyY2g6IHZtLnNlYXJjaH0pLnRoZW4oZnVuY3Rpb24oYnVzY2EpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZtLnJlc3VsdGFkb0J1c2NhID0gYnVzY2E7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcicsIFBlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIHRvYXN0ZXIsIG5nRGlhbG9nLCBDb21lbnRhcmlvKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uY29tZW50YXJpb3MgPSBbXTtcbiAgICAgICAgdm0ucGVkaWRvX2lkID0gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgY29tZW50YXJpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBDb21lbnRhcmlvLmdldEZyb21PcmRlcih2bS5wZWRpZG9faWQpLnRoZW4oZnVuY3Rpb24oY29tZW50YXJpb3MpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0uY29tZW50YXJpb3MgPSBjb21lbnRhcmlvcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSBjb21lbnRhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgQ29tZW50YXJpby5zYXZlKHtcbiAgICAgICAgICAgICAgICAncGVkaWRvX2lkJzogIHZtLnBlZGlkb19pZCxcbiAgICAgICAgICAgICAgICAnY29tZW50YXJpbyc6IHZtLmNvbWVudGFyaW9cbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW8gPSBudWxsO1xuICAgICAgICAgICAgICAgIHZtLmZvcm1Db21lbnRhcmlvLiRzZXRQcmlzdGluZSgpO1xuXG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0NvbWVudMOhcmlvIGNhZGFzdHJhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVzdHJveSBjb21lbnTDoXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKGNvbWVudGFyaW8pIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBDb21lbnRhcmlvLmRlbGV0ZShjb21lbnRhcmlvKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnQ29tZW50w6FyaW8gZXhjbHXDrWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXInLCBQZWRpZG9EZXRhbGhlQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9EZXRhbGhlQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIFBlZGlkbywgdG9hc3RlciwgUmFzdHJlaW9IZWxwZXIsIE5vdGFIZWxwZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5wZWRpZG9faWQgID0gJHN0YXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5wZWRpZG8gICAgID0ge307XG4gICAgICAgIHZtLmxvYWRpbmcgICAgPSBmYWxzZTtcbiAgICAgICAgdm0ubm90YUhlbHBlciA9IE5vdGFIZWxwZXI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5yYXN0cmVpb0hlbHBlciA9IFJhc3RyZWlvSGVscGVyLmluaXQodm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnBlZGlkbyAgPSB7fTtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQZWRpZG8uZ2V0KHZtLnBlZGlkb19pZCkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wZWRpZG8gID0gcGVkaWRvO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFsdGVyYXIgc3RhdHVzIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uY2hhbmdlU3RhdHVzID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zL3N0YXR1cycsIHZtLnBlZGlkby5pZCkuY3VzdG9tUFVUKHtcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogc3RhdHVzXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1N0YXR1cyBkbyBwZWRpZG8gYWx0ZXJhZG8gY29tIHN1Y2Vzc28hJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucGVkaWRvcy5pbmRleCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcmlvcml6YXIgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jaGFuZ2VQcmlvcml0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9wcmlvcmlkYWRlJywgdm0ucGVkaWRvLmlkKS5jdXN0b21QVVQoe1xuICAgICAgICAgICAgICAgICdwcmlvcml6YWRvJzogISh2bS5wZWRpZG8ucHJpb3JpemFkbylcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gcHJpb3JpemFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRvcm5hIGEgY2xhc3NlIGRlIHN0YXR1cyBkbyBwZWRpZG9cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucGFyc2VTdGF0dXNDbGFzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3dpdGNoICh2bS5wZWRpZG8uc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdpbmZvJztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnc3VjY2Vzcyc7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkYW5nZXInO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRvcm5hIGEgY2xhc3NlIGRlIHN0YXR1cyBkbyByYXN0cmVpb1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5wYXJzZVJhc3RyZWlvU3RhdHVzQ2xhc3MgPSBmdW5jdGlvbihyYXN0cmVpbykge1xuICAgICAgICAgICAgc3dpdGNoIChyYXN0cmVpby5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdpbmZvJztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnd2FybmluZyc7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Rhbmdlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvTGlzdENvbnRyb2xsZXInLCBQZWRpZG9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9MaXN0Q29udHJvbGxlcihQZWRpZG8sIEZpbHRlciwgVGFibGVIZWFkZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdwZWRpZG9zJywgdm0sIHtcbiAgICAgICAgICAgICdwZWRpZG9zLmNvZGlnb19tYXJrZXRwbGFjZSc6ICdMSUtFJyxcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICdMSUtFJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdwZWRpZG9zJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbih0ZXN0ZSkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFBlZGlkby5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9zLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldG9ybmEgYSBjbGFzc2UgZGUgc3RhdHVzIGRvIHBlZGlkb1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtQZWRpZG99IHBlZGlkb1xuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5wYXJzZVN0YXR1c0NsYXNzID0gZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBlZGlkby5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2luZm8nO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdzdWNjZXNzJztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Rhbmdlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQaUZvcm1Db250cm9sbGVyJywgUGlGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaUZvcm1Db250cm9sbGVyKFBpLCAkc2NvcGUsIHRvYXN0ZXIsICR3aW5kb3csICRodHRwUGFyYW1TZXJpYWxpemVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2bS5waSA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5waSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGFzIGluZm9ybWHDp8O1ZXMgZGEgUElcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFBpLnNhdmUodm0ucGksIHZtLnBpLnJhc3RyZWlvX2lkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZGUgaW5mb3JtYcOnw6NvIHNhbHZvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9wZW4gUElcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5QaSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZm9QaSA9IHtcbiAgICAgICAgICAgICAgICByYXN0cmVpbzogdm0ucmFzdHJlaW8ucmFzdHJlaW8sXG4gICAgICAgICAgICAgICAgbm9tZTogdm0ucmFzdHJlaW8ucGVkaWRvLmNsaWVudGUubm9tZSxcbiAgICAgICAgICAgICAgICBjZXA6IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jZXAsXG4gICAgICAgICAgICAgICAgZW5kZXJlY286IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5ydWEsXG4gICAgICAgICAgICAgICAgbnVtZXJvOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28ubnVtZXJvLFxuICAgICAgICAgICAgICAgIGNvbXBsZW1lbnRvOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28uY29tcGxlbWVudG8sXG4gICAgICAgICAgICAgICAgYmFpcnJvOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28uYmFpcnJvLFxuICAgICAgICAgICAgICAgIGRhdGE6IHZtLnJhc3RyZWlvLmRhdGFfZW52aW9fcmVhZGFibGUsXG4gICAgICAgICAgICAgICAgdGlwbzogdm0ucmFzdHJlaW8uc2VydmljbyxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICh2bS5yYXN0cmVpby5zdGF0dXMgPT0gMykgPyAnZScgOiAnYSdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbignaHR0cDovL3d3dzIuY29ycmVpb3MuY29tLmJyL3Npc3RlbWFzL2ZhbGVjb21vc2NvcnJlaW9zLz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoaW5mb1BpKSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQaVBlbmRlbnRlTGlzdENvbnRyb2xsZXInLCBQaVBlbmRlbnRlTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGlQZW5kZW50ZUxpc3RDb250cm9sbGVyKEZpbHRlciwgVGFibGVIZWFkZXIsIFBpLCBuZ0RpYWxvZywgdG9hc3RlciwgUmFzdHJlaW9IZWxwZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdwaXMnLCB2bSwge1xuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb19yYXN0cmVpb3MucmFzdHJlaW8nOiAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb3MuY29kaWdvX21hcmtldHBsYWNlJzogICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb19yYXN0cmVpb19waXMuY29kaWdvX3BpJzogJ0xJS0UnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3BpcycsIHZtKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnJhc3RyZWlvSGVscGVyID0gUmFzdHJlaW9IZWxwZXIuaW5pdCh2bSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgcmFzdHJlaW9zXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUGkucGVuZGluZyh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvX3Jhc3RyZWlvX3Bpcy4qJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2R1dG9Gb3JtQ29udHJvbGxlcicsIFByb2R1dG9Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQcm9kdXRvRm9ybUNvbnRyb2xsZXIoJHN0YXRlUGFyYW1zLCBQcm9kdXRvLCB0b2FzdGVyLCBUYWJzSGVscGVyLCBMaW5oYSwgTWFyY2EsIEF0cmlidXRvKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucHJvZHV0byA9IHtcbiAgICAgICAgICAgIHNrdTogJHN0YXRlUGFyYW1zLnNrdSB8fCBudWxsLFxuICAgICAgICAgICAgdW5pZGFkZTogJ3VuJyxcbiAgICAgICAgICAgIGF0aXZvOiAnMSdcbiAgICAgICAgfTtcblxuICAgICAgICB2bS50YWJzSGVscGVyID0gVGFic0hlbHBlcjtcbiAgICAgICAgdm0ubGluaGFzID0ge307XG4gICAgICAgIHZtLm1hcmNhcyA9IHt9O1xuICAgICAgICB2bS5hdHJpYnV0b3MgPSB7fTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUHJvZHV0by5nZXQodm0ucHJvZHV0by5za3UpLnRoZW4oZnVuY3Rpb24ocHJvZHV0bykge1xuICAgICAgICAgICAgICAgIHZtLnByb2R1dG8gPSBwcm9kdXRvO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF2bS5wcm9kdXRvLnVuaWRhZGUpXG4gICAgICAgICAgICAgICAgICAgIHZtLnByb2R1dG8udW5pZGFkZSA9ICd1bic7XG5cbiAgICAgICAgICAgICAgICBpZiAodm0ucHJvZHV0by5hdGl2byA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJvZHV0by5hdGl2byA9ICcxJztcblxuICAgICAgICAgICAgICAgIGlmICh2bS5wcm9kdXRvLmxpbmhhX2lkKVxuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkQXRyaWJ1dG9zKCk7XG5cbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkTWFyY2FzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgTWFyY2EuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24obWFyY2FzKSB7XG4gICAgICAgICAgICAgICAgdm0ubWFyY2FzID0gbWFyY2FzO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWRMaW5oYXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBMaW5oYS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihsaW5oYXMpIHtcbiAgICAgICAgICAgICAgICB2bS5saW5oYXMgPSBsaW5oYXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZEF0cmlidXRvcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIEF0cmlidXRvLmZyb21MaW5oYSh2bS5wcm9kdXRvLmxpbmhhX2lkKS50aGVuKGZ1bmN0aW9uKGF0cmlidXRvcykge1xuICAgICAgICAgICAgICAgIHZtLmF0cmlidXRvcyA9IGF0cmlidXRvcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodm0ucHJvZHV0by5za3UpXG4gICAgICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgaWYgKHZtLnByb2R1dG8ubGluaGFfaWQpXG4gICAgICAgICAgICB2bS5sb2FkQXRyaWJ1dG9zKCk7XG5cbiAgICAgICAgdm0ubG9hZE1hcmNhcygpO1xuICAgICAgICB2bS5sb2FkTGluaGFzKCk7XG5cbiAgICAgICAgdm0ubGluaGFDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnByb2R1dG8ubGluaGFfaWQgPSB2bS5wcm9kdXRvLmxpbmhhLmlkO1xuICAgICAgICAgICAgdm0ubG9hZEF0cmlidXRvcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBvIHByb2R1dG9cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFByb2R1dG8uc2F2ZSh2bS5wcm9kdXRvLCB2bS5wcm9kdXRvLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUHJvZHV0byBzYWx2byBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGNsdWkgbyBwcm9kdXRvXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBQcm9kdXRvLmRlbGV0ZSh2bS5wcm9kdXRvLmlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1Byb2R1dG8gZXhjbHVpZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9kdXRvTGlzdENvbnRyb2xsZXInLCBQcm9kdXRvTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUHJvZHV0b0xpc3RDb250cm9sbGVyKEZpbHRlciwgVGFibGVIZWFkZXIsIFByb2R1dG8pIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdwcm9kdXRvcycsIHZtLCB7XG4gICAgICAgICAgICAncHJvZHV0b3MudGl0dWxvJzogJ0xJS0UnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3Byb2R1dG9zJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQcm9kdXRvLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ3Byb2R1dG9zLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdFZGl0YXJDb250cm9sbGVyJywgRWRpdGFyQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBFZGl0YXJDb250cm9sbGVyKFJlc3Rhbmd1bGFyLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIsIFJhc3RyZWlvKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2bS5yYXN0cmVpbyA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5yYXN0cmVpbyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBSYXN0cmVpby5zYXZlKHZtLnJhc3RyZWlvLCB2bS5yYXN0cmVpby5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGVkaXRhZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdSYXN0cmVpb0ltcG9ydGFudGVMaXN0Q29udHJvbGxlcicsIFJhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFJhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyKFJhc3RyZWlvLCBGaWx0ZXIsIFRhYmxlSGVhZGVyLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgncmFzdHJlaW9zJywgdm0sIHtcbiAgICAgICAgICAgICdwZWRpZG9zLmNvZGlnb19tYXJrZXRwbGFjZSc6ICdMSUtFJyxcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9fcmFzdHJlaW9zLnJhc3RyZWlvJzogICdMSUtFJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdyYXN0cmVpb3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJhc3RyZWlvLmltcG9ydGFudCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvX3Jhc3RyZWlvcy4qJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZW5oYUZvcm1Db250cm9sbGVyJywgU2VuaGFGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBTZW5oYUZvcm1Db250cm9sbGVyKFNlbmhhLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZW5oYSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnNlbmhhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgYXMgaW5mb3JtYcOnw7VlcyBkYSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBTZW5oYS5zYXZlKHZtLnNlbmhhLCB2bS5zZW5oYS5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlbmhhTGlzdENvbnRyb2xsZXInLCBTZW5oYUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFNlbmhhTGlzdENvbnRyb2xsZXIoU2VuaGEsIFRhYmxlSGVhZGVyLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3NlbmhhcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcbiBcbiAgICAgICAgICAgIFNlbmhhLmZyb21Vc2VyKCRzdGF0ZVBhcmFtcy5pZCwge1xuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2UsIFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkZSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuRm9ybSA9IGZ1bmN0aW9uKHNlbmhhKSB7XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL3NlbmhhL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NlbmhhRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1NlbmhhRm9ybScsIFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VuaGE6IHNlbmhhIHx8IHsgdXN1YXJpb19pZDogJHN0YXRlUGFyYW1zLmlkIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYSBzZW5oYVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtICB7aW50fSBzZW5oYSBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gICAgICAgXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIFNlbmhhLmRlbGV0ZShpZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTZW5oYSBkZWxldGFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9Gb3JtQ29udHJvbGxlcicsIFVzdWFyaW9Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvRm9ybUNvbnRyb2xsZXIoVXN1YXJpbywgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXN1YXJpbyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLnVzdWFyaW8pO1xuXG4gICAgICAgIC8vIEFwZW5hcyBwYXJhIGVkacOnw6NvXG4gICAgICAgIHZtLnVzdWFyaW8ubm92YXNSb2xlcyA9IFtdO1xuICAgICAgICBpZiAodm0udXN1YXJpby5oYXNPd25Qcm9wZXJ0eSgncm9sZXMnKSkge1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnVzdWFyaW8ucm9sZXMsIGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgICAgICAgICB2bS51c3VhcmlvLm5vdmFzUm9sZXNbcm9sZS5pZF0gPSByb2xlLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBVc3VhcmlvLnNhdmUodm0udXN1YXJpbywgdm0udXN1YXJpby5pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1VzdcOhcmlvIHNhbHZvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIgXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdVc3VhcmlvTGlzdENvbnRyb2xsZXInLCBVc3VhcmlvTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVXN1YXJpb0xpc3RDb250cm9sbGVyKFVzdWFyaW8sIFRhYmxlSGVhZGVyLCBuZ0RpYWxvZywgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3VzdWFyaW9zJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBVc3VhcmlvLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuRm9ybSA9IGZ1bmN0aW9uKHVzdWFyaW8pIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvdXN1YXJpby9mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc3VhcmlvRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ1VzdWFyaW9Gb3JtJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzdWFyaW86IHVzdWFyaW8gfHwge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgbyB1c3XDoXJpb1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtICB7aW50fSAgaWQgXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9ICAgIFxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBVc3VhcmlvLmRlbGV0ZShpZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdVc3XDoXJpbyBkZWxldGFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VuZGVyZWNvRm9ybUNvbnRyb2xsZXInLCBFbmRlcmVjb0Zvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVuZGVyZWNvRm9ybUNvbnRyb2xsZXIoQ2xpZW50ZSwgJHNjb3BlLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uY2xpZW50ZSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLmNsaWVudGUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBhcyBpbmZvcm1hw6fDtWVzIGRhIGNsaWVudGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIENsaWVudGUuc2F2ZSh2bS5jbGllbnRlLCB2bS5jbGllbnRlLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnRW5kZXJlw6dvKHMpIHNhbHZvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
