(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RelatorioPedidosController', RelatorioPedidosController);

    function RelatorioPedidosController($window, $location, $anchorScroll, $httpParamSerializer, envService, toaster, Restangular) {
        var vm = this;

        // configuracao do drag and drop
        vm.dragControlListeners = {
            clone: false,
            allowDuplicates: false,
            containment: '#horizontal-container',
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            }
        };

        vm.result = false;
        vm.groupedResult = false;
        vm.totalResults = 0;
        vm.labels = [];

        // gera o retorno de acordo com os parametros
        vm.gerar = function(tipo) {
            if (vm.params.fields.length) {
                var params = {
                    filter: vm.params.filter,
                    group: vm.params.group,
                    fields: vm.params.fields,
                    order: vm.params.order,
                    relation: vm.params.relation
                };

                if (tipo) {
                    var auth = {
                        token: localStorage.getItem('satellizer_token')
                    };

                    $window.open(envService.read('apiUrl') + '/relatorios/pedido/' + tipo + '?params=' + JSON.stringify(params) + '&' + $httpParamSerializer(auth), 'relatorio-pedido');
                } else {
                    vm.result = false;
                    vm.labels = [];
                    Restangular.one('relatorios/pedido', tipo || null).customPOST(params).then(function(response) {
                        vm.groupedResult  = !!vm.params.group;
                        vm.result = Restangular.copy(response, vm.result);
                        vm.result = angular.copy(response, vm.result);

                        vm.totalResults = [];
                        if (!vm.groupedResult) {
                            vm.totalResults = vm.result.length;
                            vm.totalResults = vm.totalResults + ((vm.totalResults == 1) ? ' registro encontrado' : ' registros encontrados');
                            for (var key in vm.result[0]) {
                                vm.labels.push(key);
                            }
                        } else {
                            vm.totalResults = vm.result.length;
                            vm.totalResults = vm.totalResults + ((vm.totalResults == 1) ? ' grupo encontrado' : ' grupos encontrados');
                            for (var chave in vm.result[0].data[0]) {
                                vm.labels.push(chave);
                            }
                        }

                        $location.hash('relatorio-resultado');
                        $anchorScroll();
                    });
                }
            } else {
                toaster.pop('warning', '', 'Você precisa selecionar os campos antes de gerar o relatório!');
            }
        };

        // valores padrao
        vm.defaults = function() {
            vm.result = false;
            vm.labels = [];

            vm.list = {};
            vm.list.cities = {};

            vm.params = {
                filter: [],
                group: '',
                fields: [
                    {label: 'Código marketplace', name: 'codigo_marketplace'},
                    {label: 'Marketplace', name: 'marketplace'},
                    {label: 'Status', name: 'status'},
                    {label: 'Total', name: 'total'},
                    {label: 'Data de abertura', name: 'created_at'},
                ],
                order: [],
                relation: {
                    cliente: false,
                    endereco: false,
                    produtos: false
                }
            };

            vm.list.status = {
                0: 'Pendente',
                1: 'Pago',
                2: 'Enviado',
                3: 'Entregue',
                5: 'Cancelado'
            };

            vm.list.marketplace = {
                b2w: 'B2W',
                cnova: 'CNOVA',
                mercadolivre: 'Mercado Livre',
                walmart: 'Walmart',
                site: 'Site'
            };

            vm.list.fields = {};

            vm.list.fields.pedido = {
                codigo_api: 'Código',
                frete_valor: 'Frete valor',
                frete_metodo: 'Frete método',
                pagamento_metodo: 'Pagamento método',
                codigo_marketplace: 'Código marketplace',
                marketplace: 'Marketplace',
                operacao: 'Operação',
                total: 'Total',
                estimated_delivery: 'Entrega estimada',
                status: 'Status',
                protocolo: 'Protocolo cancelamento',
                segurado: 'Segurado',
                reembolso: 'Reembolso',
                priorizado: 'Priorizado',
                created_at: 'Data de abertura'
            };

            vm.list.fields.cliente = {
                'cliente.nome': 'Nome',
                'cliente.taxvat': 'Documento',
                'cliente.fone': 'Telefone',
                'cliente.email': 'E-mail'
            };

            vm.list.fields.endereco = {
                'endereco.rua': 'Rua',
                'endereco.numero': 'Número',
                'endereco.bairro': 'Bairro',
                'endereco.complemento': 'Complemento',
                'endereco.cidade': 'Cidade',
                'endereco.uf': 'UF',
                'endereco.cep': 'CEP'
            };

            vm.list.fields.produto = {
                'produtos.titulo': 'Título',
                'produtos.estado': 'Estado',
                'pedido_produtos.produto_sku': 'SKU',
                'pedido_produtos.imei': 'IMEI',
                'pedido_produtos.quantidade': 'Quantidade',
                'pedido_produtos.valor': 'Valor'
            };

            vm.list.fields.all = _.extend(vm.list.fields.all, vm.list.fields.pedido);
            vm.list.fields.all = _.extend(vm.list.fields.all, vm.list.fields.cliente);
            vm.list.fields.all = _.extend(vm.list.fields.all, vm.list.fields.endereco);
            vm.list.fields.all = _.extend(vm.list.fields.all, vm.list.fields.produto);

            vm.params.filter = {
                total: {operator: 'BETWEEN'},
                'pedidos.created_at': {operator: 'BETWEEN'},
                estimated_delivery: {operator: 'BETWEEN'},
                status: {operator: 'IN', value: {}},
                marketplace: {operator: 'IN', value: {}},
                'cliente_enderecos.uf': '',
                'cliente_enderecos.cidade': '',
                'pedido_produtos.produto_sku': {operator: 'LIKE'},
                'pedido_produtos.imei': {operator: 'LIKE'},
                'pedido_produtos.quantidade': {operator: 'BETWEEN'},
                'pedido_produtos.valor': {operator: 'BETWEEN'},
                'produtos.estado': {operator: '='}
            };

            vm.setFilters = {
                status: '',
                marketplace: ''
            };

            vm.setField = '';
            vm.setOrder = '';
        };

        // limpa os parametros
        vm.limpar = function() {
            vm.defaults();
            $location.hash('');
            $anchorScroll();
        };

        // carrega de inicio
        vm.load = function() {
            vm.defaults();
        };

        vm.load();

        // pega as cidades daquele estado
        vm.loadCities = function() {
            vm.params.filter['cliente_enderecos.cidade'] = '';

            if (typeof vm.params.filter['cliente_enderecos.uf'].value !== 'undefined' && vm.params.filter['cliente_enderecos.uf'].value) {
                Restangular.one('pedidos/cidades', vm.params.filter['cliente_enderecos.uf'].value).getList().then(function(response) {
                    vm.list.cities = response;
                });
            }
        };

        // limpa os parametros da relacao antiga
        vm.changeRelation = function() {
            if (vm.params.relation.endereco !== true) {
                vm.params.filter['cliente_enderecos.uf'] = '';
                vm.params.filter['cliente_enderecos.cidade'] = '';
            }

            if (vm.params.relation.produtos !== true) {
                vm.params.filter['pedido_produtos.produto_sku'] = {operator: 'LIKE'};
                vm.params.filter['pedido_produtos.imei'] = {operator: 'LIKE'};
                vm.params.filter['pedido_produtos.quantidade'] = {operator: 'BETWEEN'};
                vm.params.filter['pedido_produtos.valor'] = {operator: 'BETWEEN'};
            }
        };

        // adiciona um filtro
        vm.addFilter = function(key) {
            vm.params.filter[key].value[vm.setFilters[key]] = vm.list[key][vm.setFilters[key]];
            vm.setFilters[key] = '';
        };

        // remove um filtro
        vm.removeFilter = function(key, index) {
            delete vm.params.filter[key].value[index];
        };

        // adiciona uma ordenacao
        vm.addOrder = function() {
            var exists = _.some(vm.params.order, function(p) {
                return p.name == vm.setOrder;
            });

            if (!exists) {
                vm.params.order.push({
                    label: vm.list.fields.all[vm.setOrder],
                    name: vm.setOrder,
                    order: 'asc'
                });
            }

            vm.setOrder = '';
        };

        // aletra o sentido de uma ordem
        vm.changeOrder = function(index) {
            vm.params.order[index].order = (vm.params.order[index].order == 'asc') ? 'desc' : 'asc';
        };

        // remove um ordenacao
        vm.removeOrder = function(index) {
            delete vm.params.order[index];
            vm.params.order = _.compact(vm.params.order);
        };

        // adiciona um campo
        vm.addField = function() {
            var exists = _.some(vm.params.fields, function(p) {
                return p.name == vm.setField;
            });

            if (!exists) {
                vm.params.fields.push({
                    label: vm.list.fields.all[vm.setField],
                    name: vm.setField
                });
            }

            vm.setField = '';
        };

        // remove um campo
        vm.removeField = function(index) {
            delete vm.params.fields[index];
            vm.params.fields = _.compact(vm.params.fields);
        };
    }

})();