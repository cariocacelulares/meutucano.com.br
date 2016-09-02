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
            atributos: [],
            removidos: {
                atributos: [],
                opcoes: []
            }
        };

        vm.load = function() {
            vm.loading = true;

            Linha.get(vm.linha.id).then(function(linha) {
                vm.linha = linha;
                vm.loading = false;

                vm.linha.removidos = {
                    atributos: [],
                    opcoes: []
                };
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
            vm.linha.removidos.atributos.push(
                vm.linha.atributos[index].id
            );

            vm.linha.atributos.splice(index, 1);
        };

        /**
         * Quando uma tag é removida
         *
         * @return {void}
         */
        vm.removeTag = function(tag) {
            vm.linha.removidos.opcoes.push(tag.id);
        };

        /**
         * Quando di que a tag é invalda
         * Checa e entao adiciona
         *
         * @return {void}
         */
        vm.checkTag = function(tag, index) {
            if (tag) {
                tag.id = null;
                vm.linha.atributos[index].opcoes.push(tag);
            }
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
                template: 'views/produto/marca/form.html',
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

        /*
         * Recarrega as linhas ao alterar
         */
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
            console.log(vm.produto.atributos);
            Produto.save(vm.produto, vm.produto.sku || null).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto salvo com sucesso!');
            });
        };

        /**
         * Exclui o produto
         *
         * @return {void}
         */
        vm.destroy = function() {
            Produto.delete(vm.produto.sku).then(function() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdXRoL0F1dGhDb250cm9sbGVyLmpzIiwiRGV2b2x1Y2FvL0Rldm9sdWNhb0Zvcm1Db250cm9sbGVyLmpzIiwiRGV2b2x1Y2FvL0Rldm9sdWNhb1BlbmRlbnRlTGlzdENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0NsaWVudGVEZXRhbGhlQ29udHJvbGxlci5qcyIsIkNsaWVudGUvQ2xpZW50ZUxpc3RDb250cm9sbGVyLmpzIiwiRmF0dXJhbWVudG8vRmF0dXJhbWVudG9Db250cm9sbGVyLmpzIiwiTGluaGEvTGluaGFGb3JtQ29udHJvbGxlci5qcyIsIkxpbmhhL0xpbmhhTGlzdENvbnRyb2xsZXIuanMiLCJMb2dpc3RpY2EvTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIuanMiLCJNYXJjYS9NYXJjYUZvcm1Db250cm9sbGVyLmpzIiwiTWFyY2EvTWFyY2FMaXN0Q29udHJvbGxlci5qcyIsIk1hcmtldGluZy9UZW1wbGF0ZW1sQ29udHJvbGxlci5qcyIsIlBhcnRpYWxzL1NlYXJjaENvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvTGlzdENvbnRyb2xsZXIuanMiLCJQaS9QaUZvcm1Db250cm9sbGVyLmpzIiwiUGkvUGlQZW5kZW50ZUxpc3RDb250cm9sbGVyLmpzIiwiUHJvZHV0by9Qcm9kdXRvRm9ybUNvbnRyb2xsZXIuanMiLCJQcm9kdXRvL1Byb2R1dG9MaXN0Q29udHJvbGxlci5qcyIsIlJhc3RyZWlvL1Jhc3RyZWlvRWRpdEZvcm1Db250cm9sbGVyLmpzIiwiUmFzdHJlaW8vUmFzdHJlaW9JbXBvcnRhbnRlTGlzdENvbnRyb2xsZXIuanMiLCJTZW5oYS9TZW5oYUZvcm1Db250cm9sbGVyLmpzIiwiU2VuaGEvU2VuaGFMaXN0Q29udHJvbGxlci5qcyIsIlVzdWFyaW8vVXN1YXJpb0Zvcm1Db250cm9sbGVyLmpzIiwiVXN1YXJpby9Vc3VhcmlvTGlzdENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0VuZGVyZWNvL0VuZGVyZWNvRm9ybUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsaUJBQUE7O0lBRUEsU0FBQSxjQUFBLFlBQUEsT0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsV0FBQTs7Ozs7UUFLQSxHQUFBLGFBQUEsV0FBQTtZQUNBLEdBQUEsYUFBQTtZQUNBLE1BQUE7Ozs7OztRQU1BLFdBQUEsSUFBQSxlQUFBLFVBQUE7WUFDQSxHQUFBLGFBQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLHNCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztBQ1JBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGtCQUFBOztJQUVBLFNBQUEsZUFBQSxZQUFBLGFBQUEsWUFBQSxTQUFBLHNCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztRQUtBLEdBQUEsb0JBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLHNCQUFBLHFCQUFBOzs7Ozs7QUNsQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLE9BQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxhQUFBLFFBQUE7UUFDQSxJQUFBLEdBQUEsVUFBQTtZQUNBLE1BQUE7ZUFDQTtZQUNBLE1BQUE7Ozs7OztR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OztJQUVBLFNBQUEsb0JBQUEsWUFBQSxRQUFBLFFBQUEsY0FBQSxPQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsSUFBQSxPQUFBLE9BQUEsYUFBQSxTQUFBLGFBQUE7WUFDQSxHQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtlQUNBO1lBQ0EsR0FBQSxRQUFBOzs7UUFHQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsS0FBQSxTQUFBLE9BQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQTs7OztRQUlBLElBQUEsR0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBOzs7Ozs7OztRQVFBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsTUFBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsVUFBQSxXQUFBO1lBQ0EsTUFBQSxPQUFBLEdBQUEsTUFBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7O0FDakRBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsT0FBQSxRQUFBLGFBQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxhQUFBLE9BQUEsS0FBQSxVQUFBLElBQUE7WUFDQSxpQkFBQTs7Ozs7OztRQU9BLEdBQUEsY0FBQSxZQUFBLEtBQUEsVUFBQTs7UUFFQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLFFBQUE7Z0JBQ0EsVUFBQSxDQUFBO2dCQUNBLFVBQUEsR0FBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7Ozs7UUFPQSxHQUFBLFdBQUEsU0FBQSxPQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsT0FBQSxTQUFBOztlQUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLFVBQUEsTUFBQSxHQUFBOzs7OztBQ3JEQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx3QkFBQTs7SUFFQSxTQUFBLHFCQUFBLGFBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7O1FBS0EsR0FBQSxtQkFBQSxXQUFBO1lBQ0EsUUFBQSxJQUFBLEdBQUE7O1lBRUEsWUFBQSxJQUFBLG9CQUFBLFVBQUEsSUFBQTtjQUNBLEtBQUEsR0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsV0FBQSxTQUFBOzs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsb0JBQUE7U0FDQSxPQUFBLHNCQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsU0FBQSxNQUFBLFFBQUE7Z0JBQ0EsSUFBQSxRQUFBLE9BQUEsT0FBQSxNQUFBLFFBQUEsSUFBQSxPQUFBLElBQUEsT0FBQSxLQUFBO29CQUNBOztnQkFFQSxPQUFBLEtBQUEsWUFBQTs7OztJQUlBLFNBQUEsaUJBQUEsYUFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsU0FBQTtRQUNBLEdBQUEsaUJBQUE7UUFDQSxHQUFBLGVBQUE7O1FBRUEsV0FBQSxJQUFBLFVBQUEsV0FBQTtZQUNBLEdBQUE7OztRQUdBLFdBQUEsSUFBQSxXQUFBLFdBQUE7WUFDQSxHQUFBLGVBQUE7OztRQUdBLFdBQUEsSUFBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxlQUFBOzs7Ozs7UUFNQSxHQUFBLFFBQUEsV0FBQTtZQUNBLFdBQUEsV0FBQTs7Ozs7O1FBTUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxJQUFBLEdBQUEsT0FBQSxVQUFBLEdBQUE7Z0JBQ0EsR0FBQSxpQkFBQTttQkFDQTtnQkFDQSxHQUFBLGVBQUE7O2dCQUVBLFlBQUEsSUFBQSxVQUFBLFVBQUEsSUFBQSxDQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsU0FBQSxPQUFBO29CQUNBLEdBQUEsZUFBQTtvQkFDQSxHQUFBLGlCQUFBOzs7Ozs7O0FDcERBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDhCQUFBOztJQUVBLFNBQUEsMkJBQUEsWUFBQSxjQUFBLGFBQUEsU0FBQSxVQUFBLFlBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBLGFBQUE7UUFDQSxHQUFBLFVBQUE7Ozs7O1FBS0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsV0FBQSxhQUFBLEdBQUEsV0FBQSxLQUFBLFNBQUEsYUFBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsR0FBQSxjQUFBOzs7O1FBSUEsR0FBQTs7Ozs7UUFLQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxXQUFBLEtBQUE7Z0JBQ0EsY0FBQSxHQUFBO2dCQUNBLGNBQUEsR0FBQTtlQUNBLEtBQUEsV0FBQTtnQkFDQSxHQUFBLFVBQUE7Z0JBQ0EsR0FBQSxhQUFBO2dCQUNBLEdBQUEsZUFBQTs7Z0JBRUEsR0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7O1FBT0EsR0FBQSxVQUFBLFNBQUEsWUFBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxXQUFBLE9BQUEsWUFBQSxLQUFBLFdBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLEdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7QUN4REEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsMkJBQUE7O0lBRUEsU0FBQSx3QkFBQSxZQUFBLFFBQUEsY0FBQSxhQUFBLFFBQUEsU0FBQSxnQkFBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsYUFBQSxhQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxhQUFBOzs7OztRQUtBLEdBQUEsaUJBQUEsZUFBQSxLQUFBOztRQUVBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLE9BQUEsSUFBQSxHQUFBLFdBQUEsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQTs7O1FBR0EsR0FBQTs7Ozs7UUFLQSxHQUFBLGVBQUEsU0FBQSxRQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxrQkFBQSxHQUFBLE9BQUEsSUFBQSxVQUFBO2dCQUNBLFVBQUE7ZUFDQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOztnQkFFQSxJQUFBLFVBQUEsR0FBQTtvQkFDQSxPQUFBLEdBQUE7dUJBQ0E7b0JBQ0EsR0FBQTtvQkFDQSxHQUFBLFVBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxpQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLFlBQUEsSUFBQSxzQkFBQSxHQUFBLE9BQUEsSUFBQSxVQUFBO2dCQUNBLGNBQUEsRUFBQSxHQUFBLE9BQUE7ZUFDQSxLQUFBLFNBQUEsUUFBQTtnQkFDQSxHQUFBO2dCQUNBLEdBQUEsVUFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7UUFTQSxHQUFBLG1CQUFBLFdBQUE7WUFDQSxRQUFBLEdBQUEsT0FBQTtnQkFDQSxLQUFBO2dCQUNBLEtBQUE7b0JBQ0EsT0FBQTtnQkFDQSxLQUFBO29CQUNBLE9BQUE7Z0JBQ0EsS0FBQTtnQkFDQSxLQUFBO29CQUNBLE9BQUE7Ozs7Ozs7OztRQVNBLEdBQUEsMkJBQUEsU0FBQSxVQUFBO1lBQ0EsUUFBQSxTQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxLQUFBO29CQUNBLE9BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxPQUFBO2dCQUNBLEtBQUE7b0JBQ0EsT0FBQTtnQkFDQSxLQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsS0FBQTtvQkFDQSxPQUFBOzs7OztBQ3RHQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx3QkFBQTs7SUFFQSxTQUFBLHFCQUFBLFFBQUEsUUFBQSxhQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGFBQUEsT0FBQSxLQUFBLFdBQUEsSUFBQTtZQUNBLDhCQUFBO1lBQ0EsOEJBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFdBQUE7O1FBRUEsR0FBQSxPQUFBLFNBQUEsT0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxPQUFBLFFBQUE7Z0JBQ0EsVUFBQSxDQUFBO2dCQUNBLFVBQUEsR0FBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxtQkFBQSxTQUFBLFFBQUE7WUFDQSxRQUFBLE9BQUE7Z0JBQ0EsS0FBQTtnQkFDQSxLQUFBO29CQUNBLE9BQUE7Z0JBQ0EsS0FBQTtvQkFDQSxPQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsS0FBQTtvQkFDQSxPQUFBOzs7Ozs7QUN2REEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsb0JBQUE7O0lBRUEsU0FBQSxpQkFBQSxJQUFBLFFBQUEsU0FBQSxTQUFBLHNCQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLElBQUEsT0FBQSxPQUFBLGFBQUEsWUFBQSxhQUFBO1lBQ0EsR0FBQSxLQUFBLE9BQUEsYUFBQTtlQUNBO1lBQ0EsR0FBQSxLQUFBOzs7Ozs7OztRQVFBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxLQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsZUFBQSxNQUFBLEtBQUEsV0FBQTtnQkFDQSxPQUFBLGdCQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Ozs7Ozs7UUFPQSxHQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsU0FBQTtnQkFDQSxVQUFBLEdBQUEsU0FBQTtnQkFDQSxNQUFBLEdBQUEsU0FBQSxPQUFBLFFBQUE7Z0JBQ0EsS0FBQSxHQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBLFVBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQSxPQUFBLFNBQUE7Z0JBQ0EsYUFBQSxHQUFBLFNBQUEsT0FBQSxTQUFBO2dCQUNBLFFBQUEsR0FBQSxTQUFBLE9BQUEsU0FBQTtnQkFDQSxNQUFBLEdBQUEsU0FBQTtnQkFDQSxNQUFBLEdBQUEsU0FBQTtnQkFDQSxRQUFBLENBQUEsR0FBQSxTQUFBLFVBQUEsS0FBQSxNQUFBOzs7WUFHQSxRQUFBLEtBQUEsNkRBQUEscUJBQUE7Ozs7O0FDN0NBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDRCQUFBOztJQUVBLFNBQUEseUJBQUEsUUFBQSxhQUFBLElBQUEsVUFBQSxTQUFBLGdCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGFBQUEsT0FBQSxLQUFBLE9BQUEsSUFBQTtZQUNBLGlDQUFBO1lBQ0EsaUNBQUE7WUFDQSxpQ0FBQTtZQUNBLGlDQUFBOzs7Ozs7O1FBT0EsR0FBQSxjQUFBLFlBQUEsS0FBQSxPQUFBOzs7OztRQUtBLEdBQUEsaUJBQUEsZUFBQSxLQUFBOzs7OztRQUtBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBOztZQUVBLEdBQUEsUUFBQTtnQkFDQSxVQUFBLENBQUE7Z0JBQ0EsVUFBQSxHQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7O0FDaERBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsY0FBQSxTQUFBLFNBQUEsWUFBQSxPQUFBLE9BQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFVBQUE7WUFDQSxLQUFBLGFBQUEsT0FBQTtZQUNBLFNBQUE7WUFDQSxPQUFBOzs7UUFHQSxHQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsUUFBQSxJQUFBLEdBQUEsUUFBQSxLQUFBLEtBQUEsU0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTs7Z0JBRUEsSUFBQSxDQUFBLEdBQUEsUUFBQTtvQkFDQSxHQUFBLFFBQUEsVUFBQTs7Z0JBRUEsSUFBQSxHQUFBLFFBQUEsVUFBQTtvQkFDQSxHQUFBLFFBQUEsUUFBQTs7Z0JBRUEsSUFBQSxHQUFBLFFBQUE7b0JBQ0EsR0FBQTs7Z0JBRUEsR0FBQSxVQUFBOzs7O1FBSUEsR0FBQSxhQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsTUFBQSxVQUFBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLFVBQUE7Ozs7UUFJQSxHQUFBLGFBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLFVBQUEsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTs7OztRQUlBLEdBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxTQUFBLFVBQUEsR0FBQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFdBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsVUFBQTs7OztRQUlBLElBQUEsR0FBQSxRQUFBO1lBQ0EsR0FBQTs7UUFFQSxJQUFBLEdBQUEsUUFBQTtZQUNBLEdBQUE7O1FBRUEsR0FBQTtRQUNBLEdBQUE7Ozs7O1FBS0EsR0FBQSxjQUFBLFdBQUE7WUFDQSxHQUFBLFFBQUEsV0FBQSxHQUFBLFFBQUEsTUFBQTtZQUNBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxRQUFBLElBQUEsR0FBQSxRQUFBO1lBQ0EsUUFBQSxLQUFBLEdBQUEsU0FBQSxHQUFBLFFBQUEsT0FBQSxNQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7Ozs7UUFTQSxHQUFBLFVBQUEsV0FBQTtZQUNBLFFBQUEsT0FBQSxHQUFBLFFBQUEsS0FBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7QUN2R0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxRQUFBLGFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxhQUFBLE9BQUEsS0FBQSxZQUFBLElBQUE7WUFDQSxtQkFBQTs7Ozs7OztRQU9BLEdBQUEsY0FBQSxZQUFBLEtBQUEsWUFBQTs7UUFFQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxRQUFBLFFBQUE7Z0JBQ0EsVUFBQSxDQUFBO2dCQUNBLFVBQUEsR0FBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7Ozs7UUFJQSxHQUFBOzs7QUN0Q0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsb0JBQUE7O0lBRUEsU0FBQSxpQkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsSUFBQSxPQUFBLE9BQUEsYUFBQSxZQUFBLGFBQUE7WUFDQSxHQUFBLFdBQUEsT0FBQSxhQUFBO2VBQ0E7WUFDQSxHQUFBLFdBQUE7Ozs7OztRQU1BLEdBQUEsT0FBQSxXQUFBO1lBQ0EsU0FBQSxL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XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQXBwQ29udHJvbGxlcicsIEFwcENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQXBwQ29udHJvbGxlcigkcm9vdFNjb3BlLCBmb2N1cykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlYXJjaE9wZW4gPSBmYWxzZTtcbiAgICAgICAgdm0udXNlciA9ICRyb290U2NvcGUuY3VycmVudFVzZXI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9wZW4gc2VhcmNoIG92ZXJsYXlcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5TZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnNlYXJjaE9wZW4gPSB0cnVlO1xuICAgICAgICAgICAgZm9jdXMoJ3NlYXJjaElucHV0Jyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsb3NlIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICAkcm9vdFNjb3BlLiRvbihcImNsb3NlU2VhcmNoXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2bS5zZWFyY2hPcGVuID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZENvbnRyb2xsZXInLCBEYXNoYm9hcmRDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIERhc2hib2FyZENvbnRyb2xsZXIoKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ljbXNDb250cm9sbGVyJywgSWNtc0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gSWNtc0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIGVudlNlcnZpY2UsICR3aW5kb3csICRodHRwUGFyYW1TZXJpYWxpemVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlcmEgcmVsYXTDs3Jpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZ2VuZXJhdGVSZWxhdG9yaW8gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHRva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdGVsbGl6ZXJfdG9rZW5cIilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICR3aW5kb3cub3BlbihlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9yZWxhdG9yaW9zL2ljbXM/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGF1dGgpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBBdXRoQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBdXRoQ29udHJvbGxlcigkYXV0aCwgJGh0dHAsICRzdGF0ZSwgJHJvb3RTY29wZSwgZm9jdXMsIGVudlNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsYXN0VXNlcicpO1xuICAgICAgICBpZiAodm0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIGZvY3VzKCdwYXNzd29yZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9jdXMoJ3VzZXJuYW1lJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9naW5cbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhc3RVc2VyJywgdm0udXNlcm5hbWUpO1xuICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB2bS51c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdm0ucGFzc3dvcmRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRhdXRoLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoZW52U2VydmljZS5yZWFkKCdhcGlVcmwnKSArICcvYXV0aGVudGljYXRlL3VzZXInKTtcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5kYXRhLnVzZXIpO1xuXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCB1c2VyKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmF1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGEudXNlcjtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGV2b2x1Y2FvRm9ybUNvbnRyb2xsZXInLCBEZXZvbHVjYW9Gb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9Gb3JtQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIsIERldm9sdWNhbykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0uZGV2b2x1Y2FvID0gJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF2bS5kZXZvbHVjYW8pIHtcbiAgICAgICAgICAgIHZtLmRldm9sdWNhbyA9IHtcbiAgICAgICAgICAgICAgICAvKm1vdGl2b19zdGF0dXM6IHZtLmRldm9sdWNhby5zdGF0dXMsXG4gICAgICAgICAgICAgICAgcmFzdHJlaW9fcmVmOiB7IHZhbG9yOiB2bS5kZXZvbHVjYW8udmFsb3IgfSwqL1xuICAgICAgICAgICAgICAgIHBhZ29fY2xpZW50ZTogJzAnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBEZXZvbHVjYW8uc2F2ZSh2bS5kZXZvbHVjYW8sIHZtLmRldm9sdWNhby5yYXN0cmVpb19pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0Rldm9sdcOnw6NvIGNyaWFkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEZXZvbHVjYW9QZW5kZW50ZUxpc3RDb250cm9sbGVyJywgRGV2b2x1Y2FvUGVuZGVudGVMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBEZXZvbHVjYW9QZW5kZW50ZUxpc3RDb250cm9sbGVyKEZpbHRlciwgVGFibGVIZWFkZXIsIERldm9sdWNhbywgUmFzdHJlaW9IZWxwZXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdkZXZvbHVjb2VzJywgdm0sIHtcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb19yYXN0cmVpb3MucmFzdHJlaW8nOiAgICAgICAgICAgICAgICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvX2Rldm9sdWNvZXMuY29kaWdvX2Rldm9sdWNhbyc6ICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9zLmlkJzogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdkZXZvbHVjb2VzJywgdm0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmFzdHJlaW9IZWxwZXIgPSBSYXN0cmVpb0hlbHBlci5pbml0KHZtKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBEZXZvbHVjYW8ucGVuZGluZyh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvX3Jhc3RyZWlvX2Rldm9sdWNvZXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDbGllbnRlRGV0YWxoZUNvbnRyb2xsZXInLCBDbGllbnRlRGV0YWxoZUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQ2xpZW50ZURldGFsaGVDb250cm9sbGVyKCRzdGF0ZVBhcmFtcywgQ2xpZW50ZSwgQ2xpZW50ZUVuZGVyZWNvSGVscGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uY2xpZW50ZV9pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0uY2xpZW50ZSAgICA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nICAgID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5jbGllbnRlRW5kZXJlY29IZWxwZXIgPSBDbGllbnRlRW5kZXJlY29IZWxwZXIuaW5pdCh2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uY2xpZW50ZSA9IHt9O1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIENsaWVudGUuZGV0YWlsKHZtLmNsaWVudGVfaWQpLnRoZW4oZnVuY3Rpb24oY2xpZW50ZSkge1xuICAgICAgICAgICAgICAgIHZtLmNsaWVudGUgPSBjbGllbnRlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDbGllbnRlTGlzdENvbnRyb2xsZXInLCBDbGllbnRlTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQ2xpZW50ZUxpc3RDb250cm9sbGVyKENsaWVudGUsIEZpbHRlciwgVGFibGVIZWFkZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpczsgXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgnY2xpZW50ZXMnLCB2bSwge1xuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAnTElLRScsXG4gICAgICAgICAgICAnY2xpZW50ZXMudGF4dmF0JzogICAgICdMSUtFJ1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ2NsaWVudGVzJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlOyBcbiBcbiAgICAgICAgICAgIENsaWVudGUuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnY2xpZW50ZXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGYXR1cmFtZW50b0NvbnRyb2xsZXInLCBGYXR1cmFtZW50b0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRmF0dXJhbWVudG9Db250cm9sbGVyKCRyb290U2NvcGUsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ubm90YXMgPSBbXTtcbiAgICAgICAgdm0uY29kaWdvID0ge1xuICAgICAgICAgICAgc2VydmljbzogJzAnXG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdm0uZ2VuZXJhdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1cGxvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2xvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIG5vdGFzXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5ub3RhcyA9IFtdO1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbCgnbm90YXMvZmF0dXJhbWVudG8nKS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihub3Rhcykge1xuICAgICAgICAgICAgICAgIHZtLm5vdGFzID0gbm90YXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgcmFzdHJlaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlQ29kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gJ0dlcmFuZG8uLi4nO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJjb2RpZ29zL2dlcmFyXCIsIHZtLmNvZGlnby5zZXJ2aWNvKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gcmVzcG9uc2UuY29kaWdvO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KCdlcnJvcicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNvZGlnby5yYXN0cmVpbyA9ICdDw7NkaWdvcyBlc2dvdGFkb3MhJzsgXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsICdFcnJvJywgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnbXNnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3dhcm5pbmcnLCAnQXRlbsOnw6NvJywgcmVzcG9uc2UubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdm0uY29kaWdvLm1lbnNhZ2VtID0gcmVzcG9uc2UubXNnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZhdHVyYXIgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5mYXR1cmFyID0gZnVuY3Rpb24ocGVkaWRvX2lkKSB7XG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJub3Rhcy9mYXR1cmFyXCIsIHBlZGlkb19pZCkuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBmYXR1cmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTGluaGFGb3JtQ29udHJvbGxlcicsIExpbmhhRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTGluaGFGb3JtQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIExpbmhhLCB0b2FzdGVyLCBuZ0RpYWxvZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmxpbmhhID0ge1xuICAgICAgICAgICAgaWQ6ICRzdGF0ZVBhcmFtcy5pZCB8fCBudWxsLFxuICAgICAgICAgICAgYXRyaWJ1dG9zOiBbXSxcbiAgICAgICAgICAgIHJlbW92aWRvczoge1xuICAgICAgICAgICAgICAgIGF0cmlidXRvczogW10sXG4gICAgICAgICAgICAgICAgb3Bjb2VzOiBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBMaW5oYS5nZXQodm0ubGluaGEuaWQpLnRoZW4oZnVuY3Rpb24obGluaGEpIHtcbiAgICAgICAgICAgICAgICB2bS5saW5oYSA9IGxpbmhhO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHZtLmxpbmhhLnJlbW92aWRvcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXRyaWJ1dG9zOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgb3Bjb2VzOiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodm0ubGluaGEuaWQpIHtcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGljaW9uYSB1bSBhdHJpYnV0b1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uYWRkQXR0cmlidXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5saW5oYS5hdHJpYnV0b3MudW5zaGlmdCh7fSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSB1bSBhdHJpYnV0b1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmVtb3ZlQXR0cmlidXRlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgIHZtLmxpbmhhLnJlbW92aWRvcy5hdHJpYnV0b3MucHVzaChcbiAgICAgICAgICAgICAgICB2bS5saW5oYS5hdHJpYnV0b3NbaW5kZXhdLmlkXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2bS5saW5oYS5hdHJpYnV0b3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUXVhbmRvIHVtYSB0YWcgw6kgcmVtb3ZpZGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnJlbW92ZVRhZyA9IGZ1bmN0aW9uKHRhZykge1xuICAgICAgICAgICAgdm0ubGluaGEucmVtb3ZpZG9zLm9wY29lcy5wdXNoKHRhZy5pZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFF1YW5kbyBkaSBxdWUgYSB0YWcgw6kgaW52YWxkYVxuICAgICAgICAgKiBDaGVjYSBlIGVudGFvIGFkaWNpb25hXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5jaGVja1RhZyA9IGZ1bmN0aW9uKHRhZywgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgICAgICB0YWcuaWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZtLmxpbmhhLmF0cmlidXRvc1tpbmRleF0ub3Bjb2VzLnB1c2godGFnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgYSBsaW5oYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTGluaGEuc2F2ZSh2bS5saW5oYSwgdm0ubGluaGEuaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdMaW5oYSBzYWx2YSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdXRvcy5saW5oYXMuaW5kZXgnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGNsdWkgYSBsaW5oYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTGluaGEuZGVsZXRlKHZtLmxpbmhhLmlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0xpbmhhIGV4Y2x1aWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnByb2R1dG9zLmxpbmhhcy5pbmRleCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTGluaGFMaXN0Q29udHJvbGxlcicsIExpbmhhTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTGluaGFMaXN0Q29udHJvbGxlcihMaW5oYSwgRmlsdGVyLCBUYWJsZUhlYWRlciwgbmdEaWFsb2cpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpczsgIFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ2xpbmhhcycsIHZtLCB7XG4gICAgICAgICAgICAnbGluaGFzLnRpdHVsbyc6ICdMSUtFJ1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ2xpbmhhcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTsgXG4gXG4gICAgICAgICAgICBMaW5oYS5nZXRMaXN0KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydsaW5oYXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignTG9naXN0aWNhRm9ybUNvbnRyb2xsZXInLCBMb2dpc3RpY2FGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMb2dpc3RpY2FGb3JtQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSwgJHNjb3BlLCB0b2FzdGVyLCBMb2dpc3RpY2EpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZtLmxvZ2lzdGljYSA9ICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgIGlmICghdm0ubG9naXN0aWNhLmFjYW8pIHsgLy8gQXBlbmFzIGZvaSBjYWRhc3RyYWRhIGEgUElcbiAgICAgICAgICAgIHZtLnByZVNlbmQgICAgICAgICAgICAgICAgPSB0cnVlO1xuICAgICAgICAgICAgdm0ubG9naXN0aWNhLnJhc3RyZWlvX3JlZiA9IHsgdmFsb3I6IHZtLnJhc3RyZWlvLnZhbG9yIH07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5sb2dpc3RpY2EpO1xuICAgICAgICB9XG4gICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgdGhlIG9ic2VydmF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBMb2dpc3RpY2Euc2F2ZSh2bS5sb2dpc3RpY2EsIHZtLmxvZ2lzdGljYS5yYXN0cmVpb19pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTG9naXN0aWNhIHJldmVyc2Egc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01hcmNhRm9ybUNvbnRyb2xsZXInLCBNYXJjYUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIE1hcmNhRm9ybUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTWFyY2EsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mICRzY29wZS5uZ0RpYWxvZ0RhdGEubWFyY2EgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZtLm1hcmNhID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEubWFyY2EpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ubWFyY2EgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBNYXJjYS5nZXQodm0ubWFyY2EuaWQpLnRoZW4oZnVuY3Rpb24obWFyY2EpIHtcbiAgICAgICAgICAgICAgICB2bS5tYXJjYSAgID0gbWFyY2E7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHZtLm1hcmNhLmlkKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgYSBtYXJjYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWFyY2Euc2F2ZSh2bS5tYXJjYSwgdm0ubWFyY2EuaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdNYXJjYSBzYWx2YSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4Y2x1aSBhIG1hcmNhXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBNYXJjYS5kZWxldGUodm0ubWFyY2EuaWQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTWFyY2EgZXhjbHVpZGEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01hcmNhTGlzdENvbnRyb2xsZXInLCBNYXJjYUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIE1hcmNhTGlzdENvbnRyb2xsZXIoTWFyY2EsIEZpbHRlciwgVGFibGVIZWFkZXIsIG5nRGlhbG9nKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgnbWFyY2FzJywgdm0sIHtcbiAgICAgICAgICAgICdtYXJjYXMudGl0dWxvJzogJ0xJS0UnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ21hcmNhcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgTWFyY2EuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnbWFyY2FzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFicmUgbyBmb3JtdWzDoXJpbyBkYSBhbXJjYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlbkZvcm0gPSBmdW5jdGlvbihtYXJjYSkge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9wcm9kdXRvL21hcmNhL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hcmNhRm9ybUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ01hcmNhRm9ybScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBtYXJjYTogbWFyY2EgfHwge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jbG9zZVByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudmFsdWUgPT09IHRydWUpIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RlbXBsYXRlbWxDb250cm9sbGVyJywgVGVtcGxhdGVtbENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gVGVtcGxhdGVtbENvbnRyb2xsZXIoUmVzdGFuZ3VsYXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgdGVtcGxhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZtLmdlbmVyYXRlVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnVybCk7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcInRlbXBsYXRlbWwvZ2VyYXJcIikuY3VzdG9tR0VUKFwiXCIsIHtcbiAgICAgICAgICAgICAgdXJsOiB2bS51cmxcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50ZW1wbGF0ZSA9IHJlc3BvbnNlLnRlbXBsYXRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZWFyY2hDb250cm9sbGVyJywgU2VhcmNoQ29udHJvbGxlcilcbiAgICAgICAgLmZpbHRlcignaGlnaGxpZ2h0JywgZnVuY3Rpb24oJHNjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQsIHBocmFzZSkge1xuICAgICAgICAgICAgICAgIGlmIChwaHJhc2UpIHRleHQgPSBTdHJpbmcodGV4dCkucmVwbGFjZShuZXcgUmVnRXhwKCcoJytwaHJhc2UrJyknLCAnZ2knKSxcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidW5kZXJsaW5lXCI+JDE8L3NwYW4+Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbCh0ZXh0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gU2VhcmNoQ29udHJvbGxlcihSZXN0YW5ndWxhciwgJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlYXJjaCA9ICcnO1xuICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbigndXBsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdsb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignc3RvcC1sb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsb3NlIHNlYXJjaCBvdmVybGF5XG4gICAgICAgICAqL1xuICAgICAgICB2bS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiY2xvc2VTZWFyY2hcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgc2VhcmNoIHJlc3VsdHNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh2bS5zZWFyY2gubGVuZ3RoIDw9IDMpIHtcbiAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IHt9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKFwic2VhcmNoXCIpLmN1c3RvbUdFVChcIlwiLCB7c2VhcmNoOiB2bS5zZWFyY2h9KS50aGVuKGZ1bmN0aW9uKGJ1c2NhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmJ1c2NhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2bS5yZXN1bHRhZG9CdXNjYSA9IGJ1c2NhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXInLCBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQZWRpZG9Db21lbnRhcmlvQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCB0b2FzdGVyLCBuZ0RpYWxvZywgQ29tZW50YXJpbykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLmNvbWVudGFyaW9zID0gW107XG4gICAgICAgIHZtLnBlZGlkb19pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIGNvbWVudGFyaW9zXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgQ29tZW50YXJpby5nZXRGcm9tT3JkZXIodm0ucGVkaWRvX2lkKS50aGVuKGZ1bmN0aW9uKGNvbWVudGFyaW9zKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZtLmNvbWVudGFyaW9zID0gY29tZW50YXJpb3M7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgY29tZW50YXJpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIENvbWVudGFyaW8uc2F2ZSh7XG4gICAgICAgICAgICAgICAgJ3BlZGlkb19pZCc6ICB2bS5wZWRpZG9faWQsXG4gICAgICAgICAgICAgICAgJ2NvbWVudGFyaW8nOiB2bS5jb21lbnRhcmlvXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2bS5mb3JtQ29tZW50YXJpby4kc2V0UHJpc3RpbmUoKTtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdDb21lbnTDoXJpbyBjYWRhc3RyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlc3Ryb3kgY29tZW50w6FyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihjb21lbnRhcmlvKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgQ29tZW50YXJpby5kZWxldGUoY29tZW50YXJpbykudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0NvbWVudMOhcmlvIGV4Y2x1w61kbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0RldGFsaGVDb250cm9sbGVyJywgUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFJlc3Rhbmd1bGFyLCBQZWRpZG8sIHRvYXN0ZXIsIFJhc3RyZWlvSGVscGVyLCBOb3RhSGVscGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ucGVkaWRvX2lkICA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0ucGVkaWRvICAgICA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nICAgID0gZmFsc2U7XG4gICAgICAgIHZtLm5vdGFIZWxwZXIgPSBOb3RhSGVscGVyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmFzdHJlaW9IZWxwZXIgPSBSYXN0cmVpb0hlbHBlci5pbml0KHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5wZWRpZG8gID0ge307XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUGVkaWRvLmdldCh2bS5wZWRpZG9faWQpLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucGVkaWRvICA9IHBlZGlkbztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbHRlcmFyIHN0YXR1cyBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmNoYW5nZVN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZSgncGVkaWRvcy9zdGF0dXMnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHN0YXR1c1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdTdGF0dXMgZG8gcGVkaWRvIGFsdGVyYWRvIGNvbSBzdWNlc3NvIScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLnBlZGlkb3MuaW5kZXgnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUHJpb3JpemFyIHBlZGlkb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uY2hhbmdlUHJpb3JpdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3MvcHJpb3JpZGFkZScsIHZtLnBlZGlkby5pZCkuY3VzdG9tUFVUKHtcbiAgICAgICAgICAgICAgICAncHJpb3JpemFkbyc6ICEodm0ucGVkaWRvLnByaW9yaXphZG8pXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIHByaW9yaXphZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0b3JuYSBhIGNsYXNzZSBkZSBzdGF0dXMgZG8gcGVkaWRvXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHZtLnBhcnNlU3RhdHVzQ2xhc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodm0ucGVkaWRvLnN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnaW5mbyc7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGFuZ2VyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0b3JuYSBhIGNsYXNzZSBkZSBzdGF0dXMgZG8gcmFzdHJlaW9cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucGFyc2VSYXN0cmVpb1N0YXR1c0NsYXNzID0gZnVuY3Rpb24ocmFzdHJlaW8pIHtcbiAgICAgICAgICAgIHN3aXRjaCAocmFzdHJlaW8uc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnaW5mbyc7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3dhcm5pbmcnO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdzdWNjZXNzJztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkYW5nZXInO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0xpc3RDb250cm9sbGVyJywgUGVkaWRvTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvTGlzdENvbnRyb2xsZXIoUGVkaWRvLCBGaWx0ZXIsIFRhYmxlSGVhZGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgncGVkaWRvcycsIHZtLCB7XG4gICAgICAgICAgICAncGVkaWRvcy5jb2RpZ29fbWFya2V0cGxhY2UnOiAnTElLRScsXG4gICAgICAgICAgICAnY2xpZW50ZXMubm9tZSc6ICAgICAgICAgICAgICAnTElLRSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncGVkaWRvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24odGVzdGUpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQZWRpZG8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncGVkaWRvcy4qJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXRvcm5hIGEgY2xhc3NlIGRlIHN0YXR1cyBkbyBwZWRpZG9cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7UGVkaWRvfSBwZWRpZG9cbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucGFyc2VTdGF0dXNDbGFzcyA9IGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgc3dpdGNoIChwZWRpZG8uc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdpbmZvJztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnc3VjY2Vzcyc7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdkYW5nZXInO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGlGb3JtQ29udHJvbGxlcicsIFBpRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGlGb3JtQ29udHJvbGxlcihQaSwgJHNjb3BlLCB0b2FzdGVyLCAkd2luZG93LCAkaHR0cFBhcmFtU2VyaWFsaXplcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0ucGkgPSAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ucGkgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBhcyBpbmZvcm1hw6fDtWVzIGRhIFBJXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5zYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBQaS5zYXZlKHZtLnBpLCB2bS5waS5yYXN0cmVpb19pZCB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGRlIGluZm9ybWHDp8OjbyBzYWx2byBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVuIFBJXG4gICAgICAgICAqL1xuICAgICAgICB2bS5vcGVuUGkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmZvUGkgPSB7XG4gICAgICAgICAgICAgICAgcmFzdHJlaW86IHZtLnJhc3RyZWlvLnJhc3RyZWlvLFxuICAgICAgICAgICAgICAgIG5vbWU6IHZtLnJhc3RyZWlvLnBlZGlkby5jbGllbnRlLm5vbWUsXG4gICAgICAgICAgICAgICAgY2VwOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28uY2VwLFxuICAgICAgICAgICAgICAgIGVuZGVyZWNvOiB2bS5yYXN0cmVpby5wZWRpZG8uZW5kZXJlY28ucnVhLFxuICAgICAgICAgICAgICAgIG51bWVybzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLm51bWVybyxcbiAgICAgICAgICAgICAgICBjb21wbGVtZW50bzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmNvbXBsZW1lbnRvLFxuICAgICAgICAgICAgICAgIGJhaXJybzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmJhaXJybyxcbiAgICAgICAgICAgICAgICBkYXRhOiB2bS5yYXN0cmVpby5kYXRhX2VudmlvX3JlYWRhYmxlLFxuICAgICAgICAgICAgICAgIHRpcG86IHZtLnJhc3RyZWlvLnNlcnZpY28sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAodm0ucmFzdHJlaW8uc3RhdHVzID09IDMpID8gJ2UnIDogJ2EnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkd2luZG93Lm9wZW4oJ2h0dHA6Ly93d3cyLmNvcnJlaW9zLmNvbS5ici9zaXN0ZW1hcy9mYWxlY29tb3Njb3JyZWlvcy8/JyArICRodHRwUGFyYW1TZXJpYWxpemVyKGluZm9QaSkpO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUGlQZW5kZW50ZUxpc3RDb250cm9sbGVyJywgUGlQZW5kZW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBpUGVuZGVudGVMaXN0Q29udHJvbGxlcihGaWx0ZXIsIFRhYmxlSGVhZGVyLCBQaSwgbmdEaWFsb2csIHRvYXN0ZXIsIFJhc3RyZWlvSGVscGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgncGlzJywgdm0sIHtcbiAgICAgICAgICAgICdjbGllbnRlcy5ub21lJzogICAgICAgICAgICAgICAgICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9fcmFzdHJlaW9zLnJhc3RyZWlvJzogICAgICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9zLmNvZGlnb19tYXJrZXRwbGFjZSc6ICAgICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9fcmFzdHJlaW9fcGlzLmNvZGlnb19waSc6ICdMSUtFJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdwaXMnLCB2bSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5yYXN0cmVpb0hlbHBlciA9IFJhc3RyZWlvSGVscGVyLmluaXQodm0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFBpLnBlbmRpbmcoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ3BlZGlkb19yYXN0cmVpb19waXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQcm9kdXRvRm9ybUNvbnRyb2xsZXInLCBQcm9kdXRvRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUHJvZHV0b0Zvcm1Db250cm9sbGVyKCRzdGF0ZVBhcmFtcywgUHJvZHV0bywgdG9hc3RlciwgVGFic0hlbHBlciwgTGluaGEsIE1hcmNhLCBBdHJpYnV0bykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnByb2R1dG8gPSB7XG4gICAgICAgICAgICBza3U6ICRzdGF0ZVBhcmFtcy5za3UgfHwgbnVsbCxcbiAgICAgICAgICAgIHVuaWRhZGU6ICd1bicsXG4gICAgICAgICAgICBhdGl2bzogJzEnXG4gICAgICAgIH07XG5cbiAgICAgICAgdm0udGFic0hlbHBlciA9IFRhYnNIZWxwZXI7XG4gICAgICAgIHZtLmxpbmhhcyA9IHt9O1xuICAgICAgICB2bS5tYXJjYXMgPSB7fTtcbiAgICAgICAgdm0uYXRyaWJ1dG9zID0ge307XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFByb2R1dG8uZ2V0KHZtLnByb2R1dG8uc2t1KS50aGVuKGZ1bmN0aW9uKHByb2R1dG8pIHtcbiAgICAgICAgICAgICAgICB2bS5wcm9kdXRvID0gcHJvZHV0bztcblxuICAgICAgICAgICAgICAgIGlmICghdm0ucHJvZHV0by51bmlkYWRlKVxuICAgICAgICAgICAgICAgICAgICB2bS5wcm9kdXRvLnVuaWRhZGUgPSAndW4nO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLnByb2R1dG8uYXRpdm8gPT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIHZtLnByb2R1dG8uYXRpdm8gPSAnMSc7XG5cbiAgICAgICAgICAgICAgICBpZiAodm0ucHJvZHV0by5saW5oYV9pZClcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZEF0cmlidXRvcygpO1xuXG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZE1hcmNhcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIE1hcmNhLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKG1hcmNhcykge1xuICAgICAgICAgICAgICAgIHZtLm1hcmNhcyA9IG1hcmNhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkTGluaGFzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgTGluaGEuZ2V0TGlzdCgpLnRoZW4oZnVuY3Rpb24obGluaGFzKSB7XG4gICAgICAgICAgICAgICAgdm0ubGluaGFzID0gbGluaGFzO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWRBdHJpYnV0b3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBBdHJpYnV0by5mcm9tTGluaGEodm0ucHJvZHV0by5saW5oYV9pZCkudGhlbihmdW5jdGlvbihhdHJpYnV0b3MpIHtcbiAgICAgICAgICAgICAgICB2bS5hdHJpYnV0b3MgPSBhdHJpYnV0b3M7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHZtLnByb2R1dG8uc2t1KVxuICAgICAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIGlmICh2bS5wcm9kdXRvLmxpbmhhX2lkKVxuICAgICAgICAgICAgdm0ubG9hZEF0cmlidXRvcygpO1xuXG4gICAgICAgIHZtLmxvYWRNYXJjYXMoKTtcbiAgICAgICAgdm0ubG9hZExpbmhhcygpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFJlY2FycmVnYSBhcyBsaW5oYXMgYW8gYWx0ZXJhclxuICAgICAgICAgKi9cbiAgICAgICAgdm0ubGluaGFDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLnByb2R1dG8ubGluaGFfaWQgPSB2bS5wcm9kdXRvLmxpbmhhLmlkO1xuICAgICAgICAgICAgdm0ubG9hZEF0cmlidXRvcygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBvIHByb2R1dG9cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnByb2R1dG8uYXRyaWJ1dG9zKTtcbiAgICAgICAgICAgIFByb2R1dG8uc2F2ZSh2bS5wcm9kdXRvLCB2bS5wcm9kdXRvLnNrdSB8fCBudWxsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1Byb2R1dG8gc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhjbHVpIG8gcHJvZHV0b1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUHJvZHV0by5kZWxldGUodm0ucHJvZHV0by5za3UpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUHJvZHV0byBleGNsdWlkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2R1dG9MaXN0Q29udHJvbGxlcicsIFByb2R1dG9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQcm9kdXRvTGlzdENvbnRyb2xsZXIoRmlsdGVyLCBUYWJsZUhlYWRlciwgUHJvZHV0bykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3Byb2R1dG9zJywgdm0sIHtcbiAgICAgICAgICAgICdwcm9kdXRvcy50aXR1bG8nOiAnTElLRSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncHJvZHV0b3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFByb2R1dG8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncHJvZHV0b3MuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRhckNvbnRyb2xsZXInLCBFZGl0YXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVkaXRhckNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgUmFzdHJlaW8pIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvID0gJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJhc3RyZWlvLnNhdmUodm0ucmFzdHJlaW8sIHZtLnJhc3RyZWlvLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZWRpdGFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Jhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyJywgUmFzdHJlaW9JbXBvcnRhbnRlTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUmFzdHJlaW9JbXBvcnRhbnRlTGlzdENvbnRyb2xsZXIoUmFzdHJlaW8sIEZpbHRlciwgVGFibGVIZWFkZXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdyYXN0cmVpb3MnLCB2bSwge1xuICAgICAgICAgICAgJ3BlZGlkb3MuY29kaWdvX21hcmtldHBsYWNlJzogJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb19yYXN0cmVpb3MucmFzdHJlaW8nOiAgJ0xJS0UnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3Jhc3RyZWlvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmFzdHJlaW8uaW1wb3J0YW50KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9fcmFzdHJlaW9zLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlbmhhRm9ybUNvbnRyb2xsZXInLCBTZW5oYUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFNlbmhhRm9ybUNvbnRyb2xsZXIoU2VuaGEsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlbmhhID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuc2VuaGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBhcyBpbmZvcm1hw6fDtWVzIGRhIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFNlbmhhLnNhdmUodm0uc2VuaGEsIHZtLnNlbmhhLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU2VuaGEgc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignU2VuaGFMaXN0Q29udHJvbGxlcicsIFNlbmhhTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gU2VuaGFMaXN0Q29udHJvbGxlcihTZW5oYSwgVGFibGVIZWFkZXIsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgnc2VuaGFzJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuIFxuICAgICAgICAgICAgU2VuaGEuZnJvbVVzZXIoJHN0YXRlUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZSwgXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyZSBvIGZvcm11bMOhcmlvIGRlIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24oc2VuaGEpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3Mvc2VuaGEvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VuaGFGb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnU2VuaGFGb3JtJywgXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZW5oYTogc2VuaGEgfHwgeyB1c3VhcmlvX2lkOiAkc3RhdGVQYXJhbXMuaWQgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gIHtpbnR9IHNlbmhhIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSAgICAgICBcbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgU2VuaGEuZGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIGRlbGV0YWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXN1YXJpb0Zvcm1Db250cm9sbGVyJywgVXN1YXJpb0Zvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFVzdWFyaW9Gb3JtQ29udHJvbGxlcihVc3VhcmlvLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c3VhcmlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEudXN1YXJpbyk7XG5cbiAgICAgICAgLy8gQXBlbmFzIHBhcmEgZWRpw6fDo29cbiAgICAgICAgdm0udXN1YXJpby5ub3Zhc1JvbGVzID0gW107XG4gICAgICAgIGlmICh2bS51c3VhcmlvLmhhc093blByb3BlcnR5KCdyb2xlcycpKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udXN1YXJpby5yb2xlcywgZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgIHZtLnVzdWFyaW8ubm92YXNSb2xlc1tyb2xlLmlkXSA9IHJvbGUuaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFVzdWFyaW8uc2F2ZSh2bS51c3VhcmlvLCB2bS51c3VhcmlvLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnVXN1w6FyaW8gc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhciBcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9MaXN0Q29udHJvbGxlcicsIFVzdWFyaW9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvTGlzdENvbnRyb2xsZXIoVXN1YXJpbywgVGFibGVIZWFkZXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgndXN1YXJpb3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFVzdWFyaW8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyZSBvIGZvcm11bMOhcmlvIGRvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24odXN1YXJpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy91c3VhcmlvL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzdWFyaW9Gb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVXN1YXJpb0Zvcm0nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXN1YXJpbzogdXN1YXJpbyB8fCB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gIHtpbnR9ICBpZCBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gICAgXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIFVzdWFyaW8uZGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1VzdcOhcmlvIGRlbGV0YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRW5kZXJlY29Gb3JtQ29udHJvbGxlcicsIEVuZGVyZWNvRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRW5kZXJlY29Gb3JtQ29udHJvbGxlcihDbGllbnRlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5jbGllbnRlID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuY2xpZW50ZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGFzIGluZm9ybWHDp8O1ZXMgZGEgY2xpZW50ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQ2xpZW50ZS5zYXZlKHZtLmNsaWVudGUsIHZtLmNsaWVudGUuaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdFbmRlcmXDp28ocykgc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
