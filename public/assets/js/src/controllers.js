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
                vm.linha = linha;

                var aux = [];
                for (var i in vm.linha.atributos) {
                    if (vm.linha.atributos[i].opcoes.length) {
                        for (var j in vm.linha.atributos[i].opcoes) {
                            aux.push(vm.linha.atributos[i].opcoes[j].valor);
                        }
                        vm.linha.atributos[i].opcoes = aux;
                    }
                }
                aux = null;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcENvbnRyb2xsZXIuanMiLCJEYXNoYm9hcmRDb250cm9sbGVyLmpzIiwiQWRtaW4vSWNtc0NvbnRyb2xsZXIuanMiLCJBdXRoL0F1dGhDb250cm9sbGVyLmpzIiwiQ2xpZW50ZS9DbGllbnRlRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJDbGllbnRlL0NsaWVudGVMaXN0Q29udHJvbGxlci5qcyIsIkRldm9sdWNhby9EZXZvbHVjYW9Gb3JtQ29udHJvbGxlci5qcyIsIkRldm9sdWNhby9EZXZvbHVjYW9QZW5kZW50ZUxpc3RDb250cm9sbGVyLmpzIiwiRmF0dXJhbWVudG8vRmF0dXJhbWVudG9Db250cm9sbGVyLmpzIiwiTGluaGEvTGluaGFGb3JtQ29udHJvbGxlci5qcyIsIkxpbmhhL0xpbmhhTGlzdENvbnRyb2xsZXIuanMiLCJMb2dpc3RpY2EvTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIuanMiLCJNYXJjYS9NYXJjYUZvcm1Db250cm9sbGVyLmpzIiwiTWFyY2EvTWFyY2FMaXN0Q29udHJvbGxlci5qcyIsIk1hcmtldGluZy9UZW1wbGF0ZW1sQ29udHJvbGxlci5qcyIsIlBhcnRpYWxzL1NlYXJjaENvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvRGV0YWxoZUNvbnRyb2xsZXIuanMiLCJQZWRpZG8vUGVkaWRvTGlzdENvbnRyb2xsZXIuanMiLCJQaS9QaUZvcm1Db250cm9sbGVyLmpzIiwiUGkvUGlQZW5kZW50ZUxpc3RDb250cm9sbGVyLmpzIiwiUHJvZHV0by9Qcm9kdXRvRm9ybUNvbnRyb2xsZXIuanMiLCJQcm9kdXRvL1Byb2R1dG9MaXN0Q29udHJvbGxlci5qcyIsIlJhc3RyZWlvL1Jhc3RyZWlvRWRpdEZvcm1Db250cm9sbGVyLmpzIiwiUmFzdHJlaW8vUmFzdHJlaW9JbXBvcnRhbnRlTGlzdENvbnRyb2xsZXIuanMiLCJTZW5oYS9TZW5oYUZvcm1Db250cm9sbGVyLmpzIiwiU2VuaGEvU2VuaGFMaXN0Q29udHJvbGxlci5qcyIsIlVzdWFyaW8vVXN1YXJpb0Zvcm1Db250cm9sbGVyLmpzIiwiVXN1YXJpby9Vc3VhcmlvTGlzdENvbnRyb2xsZXIuanMiLCJDbGllbnRlL0VuZGVyZWNvL0VuZGVyZWNvRm9ybUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsaUJBQUE7O0lBRUEsU0FBQSxjQUFBLFlBQUEsT0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsV0FBQTs7Ozs7UUFLQSxHQUFBLGFBQUEsV0FBQTtZQUNBLEdBQUEsYUFBQTtZQUNBLE1BQUE7Ozs7OztRQU1BLFdBQUEsSUFBQSxlQUFBLFVBQUE7WUFDQSxHQUFBLGFBQUE7Ozs7QUN6QkEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLHNCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztBQ1JBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLGtCQUFBOztJQUVBLFNBQUEsZUFBQSxZQUFBLGFBQUEsWUFBQSxTQUFBLHNCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztRQUtBLEdBQUEsb0JBQUEsV0FBQTtZQUNBLElBQUEsT0FBQTtnQkFDQSxPQUFBLGFBQUEsUUFBQTs7O1lBR0EsUUFBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLHNCQUFBLHFCQUFBOzs7Ozs7QUNsQkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsa0JBQUE7O0lBRUEsU0FBQSxlQUFBLE9BQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxZQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsV0FBQSxhQUFBLFFBQUE7UUFDQSxJQUFBLEdBQUEsVUFBQTtZQUNBLE1BQUE7ZUFDQTtZQUNBLE1BQUE7Ozs7OztR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LFNBQUEsVUFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBOzs7Ozs7QUNyRUEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsdUJBQUE7O0lBRUEsU0FBQSxvQkFBQSxZQUFBLFFBQUEsY0FBQSxhQUFBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsUUFBQTtZQUNBLElBQUEsYUFBQSxNQUFBO1lBQ0EsV0FBQTs7O1FBR0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsTUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLEtBQUEsU0FBQSxPQUFBO2dCQUNBLEdBQUEsUUFBQTs7Z0JBRUEsSUFBQSxNQUFBO2dCQUNBLEtBQUEsSUFBQSxLQUFBLEdBQUEsTUFBQSxXQUFBO29CQUNBLElBQUEsR0FBQSxNQUFBLFVBQUEsR0FBQSxPQUFBLFFBQUE7d0JBQ0EsS0FBQSxJQUFBLEtBQUEsR0FBQSxNQUFBLFVBQUEsR0FBQSxRQUFBOzRCQUNBLElBQUEsS0FBQSxHQUFBLE1BQUEsVUFBQSxHQUFBLE9BQUEsR0FBQTs7d0JBRUEsR0FBQSxNQUFBLFVBQUEsR0FBQSxTQUFBOzs7Z0JBR0EsTUFBQTs7Z0JBRUEsR0FBQSxVQUFBOzs7O1FBSUEsSUFBQSxHQUFBLE1BQUEsSUFBQTtZQUNBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxlQUFBLFdBQUE7WUFDQSxHQUFBLE1BQUEsVUFBQSxRQUFBOzs7Ozs7OztRQVFBLEdBQUEsa0JBQUEsU0FBQSxPQUFBO1lBQ0EsR0FBQSxNQUFBLFVBQUEsT0FBQSxPQUFBOzs7Ozs7OztRQVFBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsTUFBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7O1FBU0EsR0FBQSxVQUFBLFdBQUE7WUFDQSxNQUFBLE9BQUEsR0FBQSxNQUFBLElBQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxHQUFBOzs7OztBQzlFQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSx1QkFBQTs7SUFFQSxTQUFBLG9CQUFBLE9BQUEsUUFBQSxhQUFBLFVBQUE7UUFDQSxJQUFBLEtBQUE7Ozs7OztRQU1BLEdBQUEsYUFBQSxPQUFBLEtBQUEsVUFBQSxJQUFBO1lBQ0EsaUJBQUE7Ozs7Ozs7UUFPQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFVBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsTUFBQSxRQUFBO2dCQUNBLFVBQUEsQ0FBQTtnQkFDQSxVQUFBLEdBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7ZUFDQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxHQUFBLFlBQUE7Z0JBQ0EsR0FBQSxZQUFBOzs7UUFHQSxHQUFBOzs7QUNyQ0EsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEsMkJBQUE7O0lBRUEsU0FBQSx3QkFBQSxhQUFBLFlBQUEsUUFBQSxTQUFBLFdBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsSUFBQSxPQUFBLE9BQUEsYUFBQSxZQUFBLGFBQUE7WUFDQSxHQUFBLFlBQUEsT0FBQSxhQUFBO2VBQ0E7WUFDQSxHQUFBLFlBQUE7Ozs7Ozs7Ozs7Ozs7O1FBY0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxVQUFBLEtBQUEsR0FBQSxXQUFBLEdBQUEsVUFBQSxlQUFBLE1BQUEsS0FBQSxXQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTs7Ozs7O0FDOUJBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsWUFBQSxRQUFBLFFBQUEsY0FBQSxPQUFBLFNBQUE7UUFDQSxJQUFBLEtBQUE7O1FBRUEsSUFBQSxPQUFBLE9BQUEsYUFBQSxTQUFBLGFBQUE7WUFDQSxHQUFBLFFBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTtlQUNBO1lBQ0EsR0FBQSxRQUFBOzs7UUFHQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsS0FBQSxTQUFBLE9BQUE7Z0JBQ0EsR0FBQSxVQUFBO2dCQUNBLEdBQUEsVUFBQTs7OztRQUlBLElBQUEsR0FBQSxNQUFBLElBQUE7WUFDQSxHQUFBOzs7Ozs7OztRQVFBLEdBQUEsT0FBQSxXQUFBO1lBQ0EsTUFBQSxLQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsTUFBQSxNQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7Ozs7OztRQVNBLEdBQUEsVUFBQSxXQUFBO1lBQ0EsTUFBQSxPQUFBLEdBQUEsTUFBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7O0FDakRBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOztJQUVBLFNBQUEsb0JBQUEsT0FBQSxRQUFBLGFBQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7O1FBTUEsR0FBQSxhQUFBLE9BQUEsS0FBQSxVQUFBLElBQUE7WUFDQSxpQkFBQTs7Ozs7OztRQU9BLEdBQUEsY0FBQSxZQUFBLEtBQUEsVUFBQTs7UUFFQSxHQUFBLE9BQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLFFBQUE7Z0JBQ0EsVUFBQSxDQUFBO2dCQUNBLFVBQUEsR0FBQSxXQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7Ozs7UUFPQSxHQUFBLFdBQUEsU0FBQSxP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QUEsWUFBQSxPQUFBLE9BQUEsVUFBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFVBQUE7WUFDQSxLQUFBLGFBQUEsT0FBQTtZQUNBLFNBQUE7WUFDQSxPQUFBOzs7UUFHQSxHQUFBLGFBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFNBQUE7UUFDQSxHQUFBLFlBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsUUFBQSxJQUFBLEdBQUEsUUFBQSxLQUFBLEtBQUEsU0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTs7Z0JBRUEsSUFBQSxDQUFBLEdBQUEsUUFBQTtvQkFDQSxHQUFBLFFBQUEsVUFBQTs7Z0JBRUEsSUFBQSxHQUFBLFFBQUEsVUFBQTtvQkFDQSxHQUFBLFFBQUEsUUFBQTs7Z0JBRUEsSUFBQSxHQUFBLFFBQUE7b0JBQ0EsR0FBQTs7Z0JBRUEsR0FBQSxVQUFBOzs7O1FBSUEsR0FBQSxhQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsTUFBQSxVQUFBLEtBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLFVBQUE7Ozs7UUFJQSxHQUFBLGFBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxNQUFBLFVBQUEsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxTQUFBO2dCQUNBLEdBQUEsVUFBQTs7OztRQUlBLEdBQUEsZ0JBQUEsV0FBQTtZQUNBLEdBQUEsVUFBQTs7WUFFQSxTQUFBLFVBQUEsR0FBQSxRQUFBLFVBQUEsS0FBQSxTQUFBLFdBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsVUFBQTs7OztRQUlBLElBQUEsR0FBQSxRQUFBO1lBQ0EsR0FBQTs7UUFFQSxJQUFBLEdBQUEsUUFBQTtZQUNBLEdBQUE7O1FBRUEsR0FBQTtRQUNBLEdBQUE7O1FBRUEsR0FBQSxjQUFBLFdBQUE7WUFDQSxHQUFBLFFBQUEsV0FBQSxHQUFBLFFBQUEsTUFBQTtZQUNBLEdBQUE7Ozs7Ozs7O1FBUUEsR0FBQSxPQUFBLFdBQUE7WUFD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VUFBQSxHQUFBLFlBQUEsV0FBQTtnQkFDQSxVQUFBLEdBQUEsWUFBQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsR0FBQSxZQUFBO2dCQUNBLEdBQUEsWUFBQTs7O1FBR0EsR0FBQTs7Ozs7OztRQU9BLEdBQUEsV0FBQSxTQUFBLE9BQUE7WUFDQSxTQUFBLEtBQUE7Z0JBQ0EsVUFBQTtnQkFDQSxZQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsTUFBQTtvQkFDQSxPQUFBLFNBQUEsRUFBQSxZQUFBLGFBQUE7O2VBRUEsYUFBQSxLQUFBLFNBQUEsTUFBQTtnQkFDQSxJQUFBLEtBQUEsVUFBQSxNQUFBLEdBQUE7Ozs7Ozs7Ozs7UUFVQSxHQUFBLFVBQUEsU0FBQSxJQUFBO1lBQ0EsTUFBQSxPQUFBLElBQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsR0FBQTs7Ozs7O0FDeERBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHlCQUFBOztJQUVBLFNBQUEsc0JBQUEsU0FBQSxZQUFBLFFBQUEsU0FBQTtRQUNBLElBQUEsS0FBQTs7UUFFQSxHQUFBLFVBQUEsUUFBQSxLQUFBLE9BQUEsYUFBQTs7O1FBR0EsR0FBQSxRQUFBLGFBQUE7UUFDQSxJQUFBLEdBQUEsUUFBQSxlQUFBLFVBQUE7WUFDQSxRQUFBLFFBQUEsR0FBQSxRQUFBLE9BQUEsU0FBQSxNQUFBO2dCQUNBLEdBQUEsUUFBQSxXQUFBLEtBQUEsTUFBQSxLQUFBOzs7Ozs7Ozs7UUFTQSxHQUFBLE9BQUEsV0FBQTtZQUNBLFFBQUEsS0FBQSxHQUFBLFNBQUEsR0FBQSxRQUFBLE1BQUEsTUFBQSxLQUFBLFdBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUEsWUFBQTtnQkFDQSxPQUFBLGdCQUFBOzs7Ozs7QUM1QkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFdBQUEseUJBQUE7O0lBRUEsU0FBQSxzQkFBQSxTQUFBLGFBQUEsVUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOzs7Ozs7UUFNQSxHQUFBLGNBQUEsWUFBQSxLQUFBLFlBQUE7O1FBRUEsR0FBQSxPQUFBLFdBQUE7WUFDQSxHQUFBLFVBQUE7O1lBRUEsUUFBQSxRQUFBO2dCQUNBLFVBQUEsR0FBQSxZQUFBLFdBQUE7Z0JBQ0EsVUFBQSxHQUFBLFlBQUEsV0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNBLEdBQUEsWUFBQTtnQkFDQSxHQUFBLFlBQUE7OztRQUdBLEdBQUE7Ozs7Ozs7UUFPQSxHQUFBLFdBQUEsU0FBQSxTQUFBO1lBQ0EsU0FBQSxLQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLE1BQUE7b0JBQ0EsU0FBQSxXQUFBOztlQUVBLGFBQUEsS0FBQSxTQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLFVBQUEsTUFBQSxHQUFBOzs7Ozs7Ozs7O1FBVUEsR0FBQSxVQUFBLFNBQUEsSUFBQTtZQUNBLFFBQUEsT0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxZQUFBO2dCQUNBLEdBQUE7Ozs7OztBQ3hEQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsV0FBQSwwQkFBQTs7SUFFQSxTQUFBLHVCQUFBLFNBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsVUFBQSxRQUFBLEtBQUEsT0FBQSxhQUFBOzs7Ozs7O1FBT0EsR0FBQSxPQUFBLFdBQUE7WUFDQSxRQUFBLEtBQUEsR0FBQSxTQUFBLEdBQUEsUUFBQSxNQUFBLE1BQUEsS0FBQSxXQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLFlBQUE7Z0JBQ0EsT0FBQSxnQkFBQTs7Ozs7S0FLQSIsImZpbGUiOiJjb250cm9sbGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgQXBwQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBBcHBDb250cm9sbGVyKCRyb290U2NvcGUsIGZvY3VzKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uc2VhcmNoT3BlbiA9IGZhbHNlO1xuICAgICAgICB2bS51c2VyID0gJHJvb3RTY29wZS5jdXJyZW50VXNlcjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uc2VhcmNoT3BlbiA9IHRydWU7XG4gICAgICAgICAgICBmb2N1cygnc2VhcmNoSW5wdXQnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xvc2Ugc2VhcmNoIG92ZXJsYXlcbiAgICAgICAgICovXG4gICAgICAgICRyb290U2NvcGUuJG9uKFwiY2xvc2VTZWFyY2hcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZtLnNlYXJjaE9wZW4gPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRGFzaGJvYXJkQ29udHJvbGxlcicsIERhc2hib2FyZENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRGFzaGJvYXJkQ29udHJvbGxlcigpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignSWNtc0NvbnRyb2xsZXInLCBJY21zQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBJY21zQ29udHJvbGxlcigkcm9vdFNjb3BlLCBSZXN0YW5ndWxhciwgZW52U2VydmljZSwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VyYSByZWxhdMOzcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZVJlbGF0b3JpbyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGF1dGggPSB7XG4gICAgICAgICAgICAgICAgdG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F0ZWxsaXplcl90b2tlblwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKGVudlNlcnZpY2UucmVhZCgnYXBpVXJsJykgKyAnL3JlbGF0b3Jpb3MvaWNtcz8nICsgJGh0dHBQYXJhbVNlcmlhbGl6ZXIoYXV0aCkpO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBdXRoQ29udHJvbGxlcicsIEF1dGhDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEF1dGhDb250cm9sbGVyKCRhdXRoLCAkaHR0cCwgJHN0YXRlLCAkcm9vdFNjb3BlLCBmb2N1cywgZW52U2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnVzZXJuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xhc3RVc2VyJyk7XG4gICAgICAgIGlmICh2bS51c2VybmFtZSkge1xuICAgICAgICAgICAgZm9jdXMoJ3Bhc3N3b3JkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb2N1cygndXNlcm5hbWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2dpblxuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdFVzZXInLCB2bS51c2VybmFtZSk7XG4gICAgICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHZtLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB2bS5wYXNzd29yZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJGF1dGgubG9naW4oY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChlbnZTZXJ2aWNlLnJlYWQoJ2FwaVVybCcpICsgJy9hdXRoZW50aWNhdGUvdXNlcicpO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlciA9IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmRhdGEudXNlcik7XG5cbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIHVzZXIpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuYXV0aGVudGljYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gcmVzcG9uc2UuZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDbGllbnRlRGV0YWxoZUNvbnRyb2xsZXInLCBDbGllbnRlRGV0YWxoZUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQ2xpZW50ZURldGFsaGVDb250cm9sbGVyKCRzdGF0ZVBhcmFtcywgQ2xpZW50ZSwgQ2xpZW50ZUVuZGVyZWNvSGVscGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uY2xpZW50ZV9pZCA9ICRzdGF0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0uY2xpZW50ZSAgICA9IHt9O1xuICAgICAgICB2bS5sb2FkaW5nICAgID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5jbGllbnRlRW5kZXJlY29IZWxwZXIgPSBDbGllbnRlRW5kZXJlY29IZWxwZXIuaW5pdCh2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uY2xpZW50ZSA9IHt9O1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIENsaWVudGUuZGV0YWlsKHZtLmNsaWVudGVfaWQpLnRoZW4oZnVuY3Rpb24oY2xpZW50ZSkge1xuICAgICAgICAgICAgICAgIHZtLmNsaWVudGUgPSBjbGllbnRlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWQoKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDbGllbnRlTGlzdENvbnRyb2xsZXInLCBDbGllbnRlTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gQ2xpZW50ZUxpc3RDb250cm9sbGVyKENsaWVudGUsIEZpbHRlciwgVGFibGVIZWFkZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpczsgXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRyb3NcbiAgICAgICAgICogQHR5cGUge0ZpbHRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZpbHRlckxpc3QgPSBGaWx0ZXIuaW5pdCgnY2xpZW50ZXMnLCB2bSwge1xuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAnTElLRScsXG4gICAgICAgICAgICAnY2xpZW50ZXMudGF4dmF0JzogICAgICdMSUtFJ1xuICAgICAgICB9KTtcbiBcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn0gXG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ2NsaWVudGVzJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlOyBcbiBcbiAgICAgICAgICAgIENsaWVudGUuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnY2xpZW50ZXMuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdEZXZvbHVjYW9Gb3JtQ29udHJvbGxlcicsIERldm9sdWNhb0Zvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIERldm9sdWNhb0Zvcm1Db250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgRGV2b2x1Y2FvKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2bS5kZXZvbHVjYW8gPSAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uZGV2b2x1Y2FvID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXZtLmRldm9sdWNhbykge1xuICAgICAgICAgICAgdm0uZGV2b2x1Y2FvID0ge1xuICAgICAgICAgICAgICAgIC8qbW90aXZvX3N0YXR1czogdm0uZGV2b2x1Y2FvLnN0YXR1cyxcbiAgICAgICAgICAgICAgICByYXN0cmVpb19yZWY6IHsgdmFsb3I6IHZtLmRldm9sdWNhby52YWxvciB9LCovXG4gICAgICAgICAgICAgICAgcGFnb19jbGllbnRlOiAnMCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIERldm9sdWNhby5zYXZlKHZtLmRldm9sdWNhbywgdm0uZGV2b2x1Y2FvLnJhc3RyZWlvX2lkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnRGV2b2x1w6fDo28gY3JpYWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Rldm9sdWNhb1BlbmRlbnRlTGlzdENvbnRyb2xsZXInLCBEZXZvbHVjYW9QZW5kZW50ZUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIERldm9sdWNhb1BlbmRlbnRlTGlzdENvbnRyb2xsZXIoRmlsdGVyLCBUYWJsZUhlYWRlciwgRGV2b2x1Y2FvLCBSYXN0cmVpb0hlbHBlciwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ2Rldm9sdWNvZXMnLCB2bSwge1xuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvcy5yYXN0cmVpbyc6ICAgICAgICAgICAgICAgICAgICdMSUtFJyxcbiAgICAgICAgICAgICdwZWRpZG9fcmFzdHJlaW9fZGV2b2x1Y29lcy5jb2RpZ29fZGV2b2x1Y2FvJzogJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb3MuaWQnOiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTElLRScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ2Rldm9sdWNvZXMnLCB2bSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5yYXN0cmVpb0hlbHBlciA9IFJhc3RyZWlvSGVscGVyLmluaXQodm0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHJhc3RyZWlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIERldm9sdWNhby5wZW5kaW5nKHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9fcmFzdHJlaW9fZGV2b2x1Y29lcy4qJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZhdHVyYW1lbnRvQ29udHJvbGxlcicsIEZhdHVyYW1lbnRvQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBGYXR1cmFtZW50b0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgUmVzdGFuZ3VsYXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5ub3RhcyA9IFtdO1xuICAgICAgICB2bS5jb2RpZ28gPSB7XG4gICAgICAgICAgICBzZXJ2aWNvOiAnMCdcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB2bS5nZW5lcmF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdzdG9wLWxvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWQgbm90YXNcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLm5vdGFzID0gW107XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIuYWxsKCdub3Rhcy9mYXR1cmFtZW50bycpLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKG5vdGFzKSB7XG4gICAgICAgICAgICAgICAgdm0ubm90YXMgPSBub3RhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSByYXN0cmVpb1xuICAgICAgICAgKi9cbiAgICAgICAgdm0uZ2VuZXJhdGVDb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSAnR2VyYW5kby4uLic7XG5cbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcImNvZGlnb3MvZ2VyYXJcIiwgdm0uY29kaWdvLnNlcnZpY28pLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ucmFzdHJlaW8gPSByZXNwb25zZS5jb2RpZ287XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ2Vycm9yJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uY29kaWdvLnJhc3RyZWlvID0gJ0PDs2RpZ29zIGVzZ290YWRvcyEnOyBcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ2Vycm9yJywgJ0Vycm8nLCByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmhhc093blByb3BlcnR5KCdtc2cnKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnd2FybmluZycsICdBdGVuw6fDo28nLCByZXNwb25zZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2bS5jb2RpZ28ubWVuc2FnZW0gPSByZXNwb25zZS5tc2c7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmF0dXJhciBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmZhdHVyYXIgPSBmdW5jdGlvbihwZWRpZG9faWQpIHtcbiAgICAgICAgICAgIFJlc3Rhbmd1bGFyLm9uZShcIm5vdGFzL2ZhdHVyYXJcIiwgcGVkaWRvX2lkKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUGVkaWRvIGZhdHVyYWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdMaW5oYUZvcm1Db250cm9sbGVyJywgTGluaGFGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBMaW5oYUZvcm1Db250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgTGluaGEsIHRvYXN0ZXIsIG5nRGlhbG9nKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ubGluaGEgPSB7XG4gICAgICAgICAgICBpZDogJHN0YXRlUGFyYW1zLmlkIHx8IG51bGwsXG4gICAgICAgICAgICBhdHJpYnV0b3M6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIExpbmhhLmdldCh2bS5saW5oYS5pZCkudGhlbihmdW5jdGlvbihsaW5oYSkge1xuICAgICAgICAgICAgICAgIHZtLmxpbmhhID0gbGluaGE7XG5cbiAgICAgICAgICAgICAgICB2YXIgYXV4ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB2bS5saW5oYS5hdHJpYnV0b3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmxpbmhhLmF0cmlidXRvc1tpXS5vcGNvZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIHZtLmxpbmhhLmF0cmlidXRvc1tpXS5vcGNvZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXgucHVzaCh2bS5saW5oYS5hdHJpYnV0b3NbaV0ub3Bjb2VzW2pdLnZhbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxpbmhhLmF0cmlidXRvc1tpXS5vcGNvZXMgPSBhdXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXV4ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2bS5saW5oYS5pZCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkaWNpb25hIHVtIGF0cmlidXRvXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxpbmhhLmF0cmlidXRvcy51bnNoaWZ0KHt9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIHVtIGF0cmlidXRvXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5yZW1vdmVBdHRyaWJ1dGUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgdm0ubGluaGEuYXRyaWJ1dG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGEgbGluaGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIExpbmhhLnNhdmUodm0ubGluaGEsIHZtLmxpbmhhLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTGluaGEgc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAucHJvZHV0b3MubGluaGFzLmluZGV4Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhjbHVpIGEgbGluaGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIExpbmhhLmRlbGV0ZSh2bS5saW5oYS5pZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdMaW5oYSBleGNsdWlkYSBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wcm9kdXRvcy5saW5oYXMuaW5kZXgnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpbmhhTGlzdENvbnRyb2xsZXInLCBMaW5oYUxpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIExpbmhhTGlzdENvbnRyb2xsZXIoTGluaGEsIEZpbHRlciwgVGFibGVIZWFkZXIsIG5nRGlhbG9nKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7ICBcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdsaW5oYXMnLCB2bSwge1xuICAgICAgICAgICAgJ2xpbmhhcy50aXR1bG8nOiAnTElLRSdcbiAgICAgICAgfSk7XG4gXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9IFxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdsaW5oYXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7IFxuIFxuICAgICAgICAgICAgTGluaGEuZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsnbGluaGFzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvZ2lzdGljYUZvcm1Db250cm9sbGVyJywgTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gTG9naXN0aWNhRm9ybUNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgTG9naXN0aWNhKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2bS5sb2dpc3RpY2EgPSAkc2NvcGUubmdEaWFsb2dEYXRhLnJhc3RyZWlvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0ubG9naXN0aWNhID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICBpZiAoIXZtLmxvZ2lzdGljYS5hY2FvKSB7IC8vIEFwZW5hcyBmb2kgY2FkYXN0cmFkYSBhIFBJXG4gICAgICAgICAgICB2bS5wcmVTZW5kICAgICAgICAgICAgICAgID0gdHJ1ZTtcbiAgICAgICAgICAgIHZtLmxvZ2lzdGljYS5yYXN0cmVpb19yZWYgPSB7IHZhbG9yOiB2bS5yYXN0cmVpby52YWxvciB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2codm0ubG9naXN0aWNhKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIHRoZSBvYnNlcnZhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTG9naXN0aWNhLnNhdmUodm0ubG9naXN0aWNhLCB2bS5sb2dpc3RpY2EucmFzdHJlaW9faWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ0xvZ2lzdGljYSByZXZlcnNhIHNhbHZhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdNYXJjYUZvcm1Db250cm9sbGVyJywgTWFyY2FGb3JtQ29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNYXJjYUZvcm1Db250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIE1hcmNhLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc2NvcGUubmdEaWFsb2dEYXRhLm1hcmNhICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2bS5tYXJjYSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubmdEaWFsb2dEYXRhLm1hcmNhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLm1hcmNhID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgTWFyY2EuZ2V0KHZtLm1hcmNhLmlkKS50aGVuKGZ1bmN0aW9uKG1hcmNhKSB7XG4gICAgICAgICAgICAgICAgdm0ubWFyY2EgICA9IG1hcmNhO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2bS5tYXJjYS5pZCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGEgbWFyY2FcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIE1hcmNhLnNhdmUodm0ubWFyY2EsIHZtLm1hcmNhLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnTWFyY2Egc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGNsdWkgYSBtYXJjYVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWFyY2EuZGVsZXRlKHZtLm1hcmNhLmlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ01hcmNhIGV4Y2x1aWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVRoaXNEaWFsb2codHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdNYXJjYUxpc3RDb250cm9sbGVyJywgTWFyY2FMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBNYXJjYUxpc3RDb250cm9sbGVyKE1hcmNhLCBGaWx0ZXIsIFRhYmxlSGVhZGVyLCBuZ0RpYWxvZykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ21hcmNhcycsIHZtLCB7XG4gICAgICAgICAgICAnbWFyY2FzLnRpdHVsbyc6ICdMSUtFJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FiZcOnYWxobyBkYSB0YWJlbGFcbiAgICAgICAgICogQHR5cGUge1RhYmxlSGVhZGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0udGFibGVIZWFkZXIgPSBUYWJsZUhlYWRlci5pbml0KCdtYXJjYXMnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIE1hcmNhLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ21hcmNhcy4qJ10sXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAgIHZtLmZpbHRlckxpc3QucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBwYWdlOiAgICAgdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgIHBlcl9wYWdlOiB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBlcl9wYWdlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBYnJlIG8gZm9ybXVsw6FyaW8gZGEgYW1yY2FcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24obWFyY2EpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvcHJvZHV0by9tYXJjYS9mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXJjYUZvcm1Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdNYXJjYUZvcm0nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbWFyY2E6IG1hcmNhIHx8IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2xvc2VQcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlID09PSB0cnVlKSB2bS5sb2FkKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdUZW1wbGF0ZW1sQ29udHJvbGxlcicsIFRlbXBsYXRlbWxDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFRlbXBsYXRlbWxDb250cm9sbGVyKFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIHRlbXBsYXRlXG4gICAgICAgICAqL1xuICAgICAgICB2bS5nZW5lcmF0ZVRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS51cmwpO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoXCJ0ZW1wbGF0ZW1sL2dlcmFyXCIpLmN1c3RvbUdFVChcIlwiLCB7XG4gICAgICAgICAgICAgIHVybDogdm0udXJsXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGVtcGxhdGUgPSByZXNwb25zZS50ZW1wbGF0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFNlYXJjaENvbnRyb2xsZXIpXG4gICAgICAgIC5maWx0ZXIoJ2hpZ2hsaWdodCcsIGZ1bmN0aW9uKCRzY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0ZXh0LCBwaHJhc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocGhyYXNlKSB0ZXh0ID0gU3RyaW5nKHRleHQpLnJlcGxhY2UobmV3IFJlZ0V4cCgnKCcrcGhyYXNlKycpJywgJ2dpJyksXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInVuZGVybGluZVwiPiQxPC9zcGFuPicpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwodGV4dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIFNlYXJjaENvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5zZWFyY2ggPSAnJztcbiAgICAgICAgdm0ucmVzdWx0YWRvQnVzY2EgPSB7fTtcbiAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3VwbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ3N0b3AtbG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbG9zZSBzZWFyY2ggb3ZlcmxheVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChcImNsb3NlU2VhcmNoXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHNlYXJjaCByZXN1bHRzXG4gICAgICAgICAqL1xuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodm0uc2VhcmNoLmxlbmd0aCA8PSAzKSB7XG4gICAgICAgICAgICAgICAgdm0ucmVzdWx0YWRvQnVzY2EgPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdm0uYnVzY2FMb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIFJlc3Rhbmd1bGFyLmFsbChcInNlYXJjaFwiKS5jdXN0b21HRVQoXCJcIiwge3NlYXJjaDogdm0uc2VhcmNofSkudGhlbihmdW5jdGlvbihidXNjYSkge1xuICAgICAgICAgICAgICAgICAgICB2bS5idXNjYUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdm0ucmVzdWx0YWRvQnVzY2EgPSBidXNjYTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BlZGlkb0NvbWVudGFyaW9Db250cm9sbGVyJywgUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUGVkaWRvQ29tZW50YXJpb0NvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgdG9hc3RlciwgbmdEaWFsb2csIENvbWVudGFyaW8pIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5jb21lbnRhcmlvcyA9IFtdO1xuICAgICAgICB2bS5wZWRpZG9faWQgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCBjb21lbnRhcmlvc1xuICAgICAgICAgKi9cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIENvbWVudGFyaW8uZ2V0RnJvbU9yZGVyKHZtLnBlZGlkb19pZCkudGhlbihmdW5jdGlvbihjb21lbnRhcmlvcykge1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2bS5jb21lbnRhcmlvcyA9IGNvbWVudGFyaW9zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIGNvbWVudGFyaW9cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBDb21lbnRhcmlvLnNhdmUoe1xuICAgICAgICAgICAgICAgICdwZWRpZG9faWQnOiAgdm0ucGVkaWRvX2lkLFxuICAgICAgICAgICAgICAgICdjb21lbnRhcmlvJzogdm0uY29tZW50YXJpb1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0uY29tZW50YXJpbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdm0uZm9ybUNvbWVudGFyaW8uJHNldFByaXN0aW5lKCk7XG5cbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnQ29tZW50w6FyaW8gY2FkYXN0cmFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXN0cm95IGNvbWVudMOhcmlvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oY29tZW50YXJpbykge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIENvbWVudGFyaW8uZGVsZXRlKGNvbWVudGFyaW8pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdDb21lbnTDoXJpbyBleGNsdcOtZG8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9EZXRhbGhlQ29udHJvbGxlcicsIFBlZGlkb0RldGFsaGVDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0RldGFsaGVDb250cm9sbGVyKCRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBSZXN0YW5ndWxhciwgUGVkaWRvLCB0b2FzdGVyLCBSYXN0cmVpb0hlbHBlciwgTm90YUhlbHBlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnBlZGlkb19pZCAgPSAkc3RhdGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLnBlZGlkbyAgICAgPSB7fTtcbiAgICAgICAgdm0ubG9hZGluZyAgICA9IGZhbHNlO1xuICAgICAgICB2bS5ub3RhSGVscGVyID0gTm90YUhlbHBlcjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnJhc3RyZWlvSGVscGVyID0gUmFzdHJlaW9IZWxwZXIuaW5pdCh2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucGVkaWRvICA9IHt9O1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFBlZGlkby5nZXQodm0ucGVkaWRvX2lkKS50aGVuKGZ1bmN0aW9uKHBlZGlkbykge1xuICAgICAgICAgICAgICAgIHZtLnBlZGlkbyAgPSBwZWRpZG87XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWx0ZXJhciBzdGF0dXMgcGVkaWRvXG4gICAgICAgICAqL1xuICAgICAgICB2bS5jaGFuZ2VTdGF0dXMgPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBSZXN0YW5ndWxhci5vbmUoJ3BlZGlkb3Mvc3RhdHVzJywgdm0ucGVkaWRvLmlkKS5jdXN0b21QVVQoe1xuICAgICAgICAgICAgICAgICdzdGF0dXMnOiBzdGF0dXNcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocGVkaWRvKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU3RhdHVzIGRvIHBlZGlkbyBhbHRlcmFkbyBjb20gc3VjZXNzbyEnKTtcblxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gNSkge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5wZWRpZG9zLmluZGV4Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByaW9yaXphciBwZWRpZG9cbiAgICAgICAgICovXG4gICAgICAgIHZtLmNoYW5nZVByaW9yaXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmVzdGFuZ3VsYXIub25lKCdwZWRpZG9zL3ByaW9yaWRhZGUnLCB2bS5wZWRpZG8uaWQpLmN1c3RvbVBVVCh7XG4gICAgICAgICAgICAgICAgJ3ByaW9yaXphZG8nOiAhKHZtLnBlZGlkby5wcmlvcml6YWRvKVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgICAgICB2bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBwcmlvcml6YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldG9ybmEgYSBjbGFzc2UgZGUgc3RhdHVzIGRvIHBlZGlkb1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5wYXJzZVN0YXR1c0NsYXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHZtLnBlZGlkby5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2luZm8nO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdzdWNjZXNzJztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Rhbmdlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldG9ybmEgYSBjbGFzc2UgZGUgc3RhdHVzIGRvIHJhc3RyZWlvXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHZtLnBhcnNlUmFzdHJlaW9TdGF0dXNDbGFzcyA9IGZ1bmN0aW9uKHJhc3RyZWlvKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHJhc3RyZWlvLnN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2luZm8nO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd3YXJuaW5nJztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnc3VjY2Vzcyc7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGFuZ2VyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5jb250cm9sbGVyKCdQZWRpZG9MaXN0Q29udHJvbGxlcicsIFBlZGlkb0xpc3RDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBlZGlkb0xpc3RDb250cm9sbGVyKFBlZGlkbywgRmlsdGVyLCBUYWJsZUhlYWRlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3BlZGlkb3MnLCB2bSwge1xuICAgICAgICAgICAgJ3BlZGlkb3MuY29kaWdvX21hcmtldHBsYWNlJzogJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAgICAgICAgJ0xJS0UnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3BlZGlkb3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKHRlc3RlKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUGVkaWRvLmdldExpc3Qoe1xuICAgICAgICAgICAgICAgIGZpZWxkczogICBbJ3BlZGlkb3MuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0b3JuYSBhIGNsYXNzZSBkZSBzdGF0dXMgZG8gcGVkaWRvXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge1BlZGlkb30gcGVkaWRvXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHZtLnBhcnNlU3RhdHVzQ2xhc3MgPSBmdW5jdGlvbihwZWRpZG8pIHtcbiAgICAgICAgICAgIHN3aXRjaCAocGVkaWRvLnN0YXR1cykge1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnaW5mbyc7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnZGFuZ2VyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpRm9ybUNvbnRyb2xsZXInLCBQaUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFBpRm9ybUNvbnRyb2xsZXIoUGksICRzY29wZSwgdG9hc3RlciwgJHdpbmRvdywgJGh0dHBQYXJhbVNlcmlhbGl6ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZtLnBpID0gJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnBpID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2FsdmEgYXMgaW5mb3JtYcOnw7VlcyBkYSBQSVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUGkuc2F2ZSh2bS5waSwgdm0ucGkucmFzdHJlaW9faWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VUaGlzRGlhbG9nKHRydWUpO1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1BlZGlkbyBkZSBpbmZvcm1hw6fDo28gc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBQSVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ub3BlblBpID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaW5mb1BpID0ge1xuICAgICAgICAgICAgICAgIHJhc3RyZWlvOiB2bS5yYXN0cmVpby5yYXN0cmVpbyxcbiAgICAgICAgICAgICAgICBub21lOiB2bS5yYXN0cmVpby5wZWRpZG8uY2xpZW50ZS5ub21lLFxuICAgICAgICAgICAgICAgIGNlcDogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLmNlcCxcbiAgICAgICAgICAgICAgICBlbmRlcmVjbzogdm0ucmFzdHJlaW8ucGVkaWRvLmVuZGVyZWNvLnJ1YSxcbiAgICAgICAgICAgICAgICBudW1lcm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5udW1lcm8sXG4gICAgICAgICAgICAgICAgY29tcGxlbWVudG86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5jb21wbGVtZW50byxcbiAgICAgICAgICAgICAgICBiYWlycm86IHZtLnJhc3RyZWlvLnBlZGlkby5lbmRlcmVjby5iYWlycm8sXG4gICAgICAgICAgICAgICAgZGF0YTogdm0ucmFzdHJlaW8uZGF0YV9lbnZpb19yZWFkYWJsZSxcbiAgICAgICAgICAgICAgICB0aXBvOiB2bS5yYXN0cmVpby5zZXJ2aWNvLFxuICAgICAgICAgICAgICAgIHN0YXR1czogKHZtLnJhc3RyZWlvLnN0YXR1cyA9PSAzKSA/ICdlJyA6ICdhJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Mi5jb3JyZWlvcy5jb20uYnIvc2lzdGVtYXMvZmFsZWNvbW9zY29ycmVpb3MvPycgKyAkaHR0cFBhcmFtU2VyaWFsaXplcihpbmZvUGkpKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BpUGVuZGVudGVMaXN0Q29udHJvbGxlcicsIFBpUGVuZGVudGVMaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQaVBlbmRlbnRlTGlzdENvbnRyb2xsZXIoRmlsdGVyLCBUYWJsZUhlYWRlciwgUGksIG5nRGlhbG9nLCB0b2FzdGVyLCBSYXN0cmVpb0hlbHBlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3BpcycsIHZtLCB7XG4gICAgICAgICAgICAnY2xpZW50ZXMubm9tZSc6ICAgICAgICAgICAgICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvcy5yYXN0cmVpbyc6ICAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvcy5jb2RpZ29fbWFya2V0cGxhY2UnOiAgICAnTElLRScsXG4gICAgICAgICAgICAncGVkaWRvX3Jhc3RyZWlvX3Bpcy5jb2RpZ29fcGknOiAnTElLRSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncGlzJywgdm0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdm0ucmFzdHJlaW9IZWxwZXIgPSBSYXN0cmVpb0hlbHBlci5pbml0KHZtKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCByYXN0cmVpb3NcbiAgICAgICAgICovXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQaS5wZW5kaW5nKHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9fcmFzdHJlaW9fcGlzLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignUHJvZHV0b0Zvcm1Db250cm9sbGVyJywgUHJvZHV0b0Zvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFByb2R1dG9Gb3JtQ29udHJvbGxlcigkc3RhdGVQYXJhbXMsIFByb2R1dG8sIHRvYXN0ZXIsIFRhYnNIZWxwZXIsIExpbmhhLCBNYXJjYSwgQXRyaWJ1dG8pIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5wcm9kdXRvID0ge1xuICAgICAgICAgICAgc2t1OiAkc3RhdGVQYXJhbXMuc2t1IHx8IG51bGwsXG4gICAgICAgICAgICB1bmlkYWRlOiAndW4nLFxuICAgICAgICAgICAgYXRpdm86ICcxJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLnRhYnNIZWxwZXIgPSBUYWJzSGVscGVyO1xuICAgICAgICB2bS5saW5oYXMgPSB7fTtcbiAgICAgICAgdm0ubWFyY2FzID0ge307XG4gICAgICAgIHZtLmF0cmlidXRvcyA9IHt9O1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBQcm9kdXRvLmdldCh2bS5wcm9kdXRvLnNrdSkudGhlbihmdW5jdGlvbihwcm9kdXRvKSB7XG4gICAgICAgICAgICAgICAgdm0ucHJvZHV0byA9IHByb2R1dG87XG5cbiAgICAgICAgICAgICAgICBpZiAoIXZtLnByb2R1dG8udW5pZGFkZSlcbiAgICAgICAgICAgICAgICAgICAgdm0ucHJvZHV0by51bmlkYWRlID0gJ3VuJztcblxuICAgICAgICAgICAgICAgIGlmICh2bS5wcm9kdXRvLmF0aXZvID09PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICB2bS5wcm9kdXRvLmF0aXZvID0gJzEnO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZtLnByb2R1dG8ubGluaGFfaWQpXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRBdHJpYnV0b3MoKTtcblxuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvYWRNYXJjYXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBNYXJjYS5nZXRMaXN0KCkudGhlbihmdW5jdGlvbihtYXJjYXMpIHtcbiAgICAgICAgICAgICAgICB2bS5tYXJjYXMgPSBtYXJjYXM7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZExpbmhhcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIExpbmhhLmdldExpc3QoKS50aGVuKGZ1bmN0aW9uKGxpbmhhcykge1xuICAgICAgICAgICAgICAgIHZtLmxpbmhhcyA9IGxpbmhhcztcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5sb2FkQXRyaWJ1dG9zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgQXRyaWJ1dG8uZnJvbUxpbmhhKHZtLnByb2R1dG8ubGluaGFfaWQpLnRoZW4oZnVuY3Rpb24oYXRyaWJ1dG9zKSB7XG4gICAgICAgICAgICAgICAgdm0uYXRyaWJ1dG9zID0gYXRyaWJ1dG9zO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh2bS5wcm9kdXRvLnNrdSlcbiAgICAgICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICBpZiAodm0ucHJvZHV0by5saW5oYV9pZClcbiAgICAgICAgICAgIHZtLmxvYWRBdHJpYnV0b3MoKTtcblxuICAgICAgICB2bS5sb2FkTWFyY2FzKCk7XG4gICAgICAgIHZtLmxvYWRMaW5oYXMoKTtcblxuICAgICAgICB2bS5saW5oYUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ucHJvZHV0by5saW5oYV9pZCA9IHZtLnByb2R1dG8ubGluaGEuaWQ7XG4gICAgICAgICAgICB2bS5sb2FkQXRyaWJ1dG9zKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIG8gcHJvZHV0b1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUHJvZHV0by5zYXZlKHZtLnByb2R1dG8sIHZtLnByb2R1dG8uaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQcm9kdXRvIHNhbHZvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4Y2x1aSBvIHByb2R1dG9cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFByb2R1dG8uZGVsZXRlKHZtLnByb2R1dG8uaWQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnUHJvZHV0byBleGNsdWlkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb2R1dG9MaXN0Q29udHJvbGxlcicsIFByb2R1dG9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBQcm9kdXRvTGlzdENvbnRyb2xsZXIoRmlsdGVyLCBUYWJsZUhlYWRlciwgUHJvZHV0bykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0cm9zXG4gICAgICAgICAqIEB0eXBlIHtGaWx0ZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS5maWx0ZXJMaXN0ID0gRmlsdGVyLmluaXQoJ3Byb2R1dG9zJywgdm0sIHtcbiAgICAgICAgICAgICdwcm9kdXRvcy50aXR1bG8nOiAnTElLRSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgncHJvZHV0b3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFByb2R1dG8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgZmllbGRzOiAgIFsncHJvZHV0b3MuKiddLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogICB2bS5maWx0ZXJMaXN0LnBhcnNlKCksXG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0ubG9hZCgpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRhckNvbnRyb2xsZXInLCBFZGl0YXJDb250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIEVkaXRhckNvbnRyb2xsZXIoUmVzdGFuZ3VsYXIsICRyb290U2NvcGUsICRzY29wZSwgdG9hc3RlciwgUmFzdHJlaW8pIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mICRzY29wZS5uZ0RpYWxvZ0RhdGEucmFzdHJlaW8gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvID0gJHNjb3BlLm5nRGlhbG9nRGF0YS5yYXN0cmVpbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnJhc3RyZWlvID0ge307XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSB0aGUgb2JzZXJ2YXRpb25cbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFJhc3RyZWlvLnNhdmUodm0ucmFzdHJlaW8sIHZtLnJhc3RyZWlvLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdQZWRpZG8gZWRpdGFkbyBjb20gc3VjZXNzbyEnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Jhc3RyZWlvSW1wb3J0YW50ZUxpc3RDb250cm9sbGVyJywgUmFzdHJlaW9JbXBvcnRhbnRlTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gUmFzdHJlaW9JbXBvcnRhbnRlTGlzdENvbnRyb2xsZXIoUmFzdHJlaW8sIEZpbHRlciwgVGFibGVIZWFkZXIsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdHJvc1xuICAgICAgICAgKiBAdHlwZSB7RmlsdGVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uZmlsdGVyTGlzdCA9IEZpbHRlci5pbml0KCdyYXN0cmVpb3MnLCB2bSwge1xuICAgICAgICAgICAgJ3BlZGlkb3MuY29kaWdvX21hcmtldHBsYWNlJzogJ0xJS0UnLFxuICAgICAgICAgICAgJ2NsaWVudGVzLm5vbWUnOiAgICAgICAgICAgICAgJ0xJS0UnLFxuICAgICAgICAgICAgJ3BlZGlkb19yYXN0cmVpb3MucmFzdHJlaW8nOiAgJ0xJS0UnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWJlw6dhbGhvIGRhIHRhYmVsYVxuICAgICAgICAgKiBAdHlwZSB7VGFibGVIZWFkZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB2bS50YWJsZUhlYWRlciA9IFRhYmxlSGVhZGVyLmluaXQoJ3Jhc3RyZWlvcycsIHZtKTtcblxuICAgICAgICB2bS5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgUmFzdHJlaW8uaW1wb3J0YW50KHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6ICAgWydwZWRpZG9fcmFzdHJlaW9zLionXSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICAgdm0uZmlsdGVyTGlzdC5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICAgICB2bS50YWJsZUhlYWRlci5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgcGVyX3BhZ2U6IHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGVyX3BhZ2VcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2bS50YWJsZURhdGEgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nICAgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2bS5sb2FkKCk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1NlbmhhRm9ybUNvbnRyb2xsZXInLCBTZW5oYUZvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFNlbmhhRm9ybUNvbnRyb2xsZXIoU2VuaGEsICRzY29wZSwgdG9hc3Rlcikge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIHZtLnNlbmhhID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuc2VuaGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBhcyBpbmZvcm1hw6fDtWVzIGRhIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFNlbmhhLnNhdmUodm0uc2VuaGEsIHZtLnNlbmhhLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnU2VuaGEgc2FsdmEgY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignU2VuaGFMaXN0Q29udHJvbGxlcicsIFNlbmhhTGlzdENvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gU2VuaGFMaXN0Q29udHJvbGxlcihTZW5oYSwgVGFibGVIZWFkZXIsICRzdGF0ZVBhcmFtcywgUmVzdGFuZ3VsYXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgnc2VuaGFzJywgdm0pO1xuXG4gICAgICAgIHZtLmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZtLmxvYWRpbmcgPSB0cnVlO1xuIFxuICAgICAgICAgICAgU2VuaGEuZnJvbVVzZXIoJHN0YXRlUGFyYW1zLmlkLCB7XG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZSwgXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgdm0udGFibGVEYXRhID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdm0ubG9hZGluZyAgID0gZmFsc2U7IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyZSBvIGZvcm11bMOhcmlvIGRlIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24oc2VuaGEpIHtcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3Mvc2VuaGEvZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2VuaGFGb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnU2VuaGFGb3JtJywgXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBzZW5oYTogc2VuaGEgfHwgeyB1c3VhcmlvX2lkOiAkc3RhdGVQYXJhbXMuaWQgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhIHNlbmhhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gIHtpbnR9IHNlbmhhIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSAgICAgICBcbiAgICAgICAgICovXG4gICAgICAgIHZtLmRlc3Ryb3kgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgU2VuaGEuZGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1NlbmhhIGRlbGV0YWRhIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignVXN1YXJpb0Zvcm1Db250cm9sbGVyJywgVXN1YXJpb0Zvcm1Db250cm9sbGVyKTtcblxuICAgIGZ1bmN0aW9uIFVzdWFyaW9Gb3JtQ29udHJvbGxlcihVc3VhcmlvLCAkcm9vdFNjb3BlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS51c3VhcmlvID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEudXN1YXJpbyk7XG5cbiAgICAgICAgLy8gQXBlbmFzIHBhcmEgZWRpw6fDo29cbiAgICAgICAgdm0udXN1YXJpby5ub3Zhc1JvbGVzID0gW107XG4gICAgICAgIGlmICh2bS51c3VhcmlvLmhhc093blByb3BlcnR5KCdyb2xlcycpKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udXN1YXJpby5yb2xlcywgZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgIHZtLnVzdWFyaW8ubm92YXNSb2xlc1tyb2xlLmlkXSA9IHJvbGUuaWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYWx2YSBvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLnNhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFVzdWFyaW8uc2F2ZSh2bS51c3VhcmlvLCB2bS51c3VhcmlvLmlkIHx8IG51bGwpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCAnU3VjZXNzbyEnLCAnVXN1w6FyaW8gc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhciBcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzdWFyaW9MaXN0Q29udHJvbGxlcicsIFVzdWFyaW9MaXN0Q29udHJvbGxlcik7XG5cbiAgICBmdW5jdGlvbiBVc3VhcmlvTGlzdENvbnRyb2xsZXIoVXN1YXJpbywgVGFibGVIZWFkZXIsIG5nRGlhbG9nLCB0b2FzdGVyKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhYmXDp2FsaG8gZGEgdGFiZWxhXG4gICAgICAgICAqIEB0eXBlIHtUYWJsZUhlYWRlcn1cbiAgICAgICAgICovXG4gICAgICAgIHZtLnRhYmxlSGVhZGVyID0gVGFibGVIZWFkZXIuaW5pdCgndXN1YXJpb3MnLCB2bSk7XG5cbiAgICAgICAgdm0ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdm0ubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIFVzdWFyaW8uZ2V0TGlzdCh7XG4gICAgICAgICAgICAgICAgcGFnZTogICAgIHZtLnRhYmxlSGVhZGVyLnBhZ2luYXRpb24ucGFnZSxcbiAgICAgICAgICAgICAgICBwZXJfcGFnZTogdm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wZXJfcGFnZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHZtLnRhYmxlRGF0YSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgICA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHZtLmxvYWQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWJyZSBvIGZvcm11bMOhcmlvIGRvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfSBcbiAgICAgICAgICovXG4gICAgICAgIHZtLm9wZW5Gb3JtID0gZnVuY3Rpb24odXN1YXJpbykge1xuICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy91c3VhcmlvL2Zvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzdWFyaW9Gb3JtQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnVXN1YXJpb0Zvcm0nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXN1YXJpbzogdXN1YXJpbyB8fCB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNsb3NlUHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PT0gdHJ1ZSkgdm0ubG9hZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBvIHVzdcOhcmlvXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gIHtpbnR9ICBpZCBcbiAgICAgICAgICogQHJldHVybiB7dm9pZH0gICAgXG4gICAgICAgICAqL1xuICAgICAgICB2bS5kZXN0cm95ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIFVzdWFyaW8uZGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgJ1N1Y2Vzc28hJywgJ1VzdcOhcmlvIGRlbGV0YWRvIGNvbSBzdWNlc3NvIScpO1xuICAgICAgICAgICAgICAgIHZtLmxvYWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuY29udHJvbGxlcignRW5kZXJlY29Gb3JtQ29udHJvbGxlcicsIEVuZGVyZWNvRm9ybUNvbnRyb2xsZXIpO1xuXG4gICAgZnVuY3Rpb24gRW5kZXJlY29Gb3JtQ29udHJvbGxlcihDbGllbnRlLCAkc2NvcGUsIHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICB2bS5jbGllbnRlID0gYW5ndWxhci5jb3B5KCRzY29wZS5uZ0RpYWxvZ0RhdGEuY2xpZW50ZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbHZhIGFzIGluZm9ybWHDp8O1ZXMgZGEgY2xpZW50ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQ2xpZW50ZS5zYXZlKHZtLmNsaWVudGUsIHZtLmNsaWVudGUuaWQgfHwgbnVsbCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsICdTdWNlc3NvIScsICdFbmRlcmXDp28ocykgc2Fsdm8gY29tIHN1Y2Vzc28hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlVGhpc0RpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
