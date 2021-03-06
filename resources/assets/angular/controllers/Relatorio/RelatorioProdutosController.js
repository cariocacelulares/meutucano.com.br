(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RelatorioProdutosController', RelatorioProdutosController);

    function RelatorioProdutosController($window, $location, $anchorScroll, $httpParamSerializer, envService, toaster, Restangular) {
        var vm = this;

        // configuração do drag and drop
        vm.dragControlListeners = {
            clone: false,
            allowDuplicates: false,
            containment: '#horizontal-container',
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            }
        };

        vm.result = false;
        vm.labels = [];
        vm.groupedResult = false;
        vm.totalResults = 0;

        // Colhe os parametros e gera o resultado
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

                    $window.open(envService.read('apiUrl') + '/relatorios/produto/' + tipo + '?params=' + JSON.stringify(params) + '&' + $httpParamSerializer(auth), 'relatorio-produto');
                } else {
                    vm.result = false;
                    vm.labels = [];
                    Restangular.one('relatorios/produto', tipo || null).customPOST(params).then(function(response) {
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

        // valores padrão
        vm.defaults = function() {
            vm.result = false;
            vm.labels = [];

            vm.params = {
                filter: [],
                group: '',
                fields: [
                    {label: 'Título', name: 'titulo'},
                    {label: 'SKU', name: 'sku'},
                    {label: 'Estoque', name: 'estoque'},
                    {label: 'Estado', name: 'estado'},
                    {label: 'Preço de venda', name: 'valor'},
                    {label: 'Data de criação', name: 'created_at'}
                ],
                order: [],
                relation: {
                    pedido: false
                }
            };

            vm.list = {};

            vm.list['pedidos.status'] = {
                0: 'Pendente',
                1: 'Pago',
                2: 'Enviado',
                3: 'Entregue',
                5: 'Cancelado'
            };

            vm.list['pedidos.marketplace'] = {
                b2w: 'B2W',
                cnova: 'CNOVA',
                mercadolivre: 'Mercado Livre',
                walmart: 'Walmart',
                site: 'Site'
            };

            vm.list.fields = {};

            vm.list.fields.produto = {
                titulo: 'Título',
                sku: 'SKU',
                estoque: 'Estoque',
                estado: 'Estado',
                valor: 'Preço de venda',
                created_at: 'Data de criação'
            };

            vm.list.fields.pedido = {
                'pedido_produtos.valor': 'Valor do produto',
                'pedidos.codigo_marketplace': 'Código marketplace',
                'pedidos.marketplace': 'Marketplace',
                'pedidos.status': 'Status',
                'pedidos.total': 'Valor total',
                'pedidos.estimated_delivery': 'Entrega estimada',
                'pedidos.created_at': 'Data do pedido'
            };

            vm.list.fields.all = _.extend(vm.list.fields.all, vm.list.fields.produto);
            vm.list.fields.all = _.extend(vm.list.fields.all, vm.list.fields.pedido);

            vm.params.filter = {
                sku: {operator: 'LIKE'},
                titulo: {operator: 'LIKE'},
                estado: {operator: '='},
                'produtos.created_at': {operator: 'BETWEEN'},
                'pedido_produtos.imei': {operator: 'LIKE'},
                'pedido_produtos.valor': {operator: 'BETWEEN'},
                'pedidos.marketplace': {operator: 'IN', value: {}},
                'pedidos.status': {operator: 'IN', value: {}},
                'pedidos.total': {operator: 'BETWEEN'},
                'pedidos.created_at': {operator: 'BETWEEN'},
                'pedidos.estimated_delivery': {operator: 'BETWEEN'}
            };

            vm.setFilters = {
                'pedidos.status': '',
                'pedidos.marketplace': ''
            };

            vm.setField = '';
            vm.setOrder = '';
        };

        // limpa os campos
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

        // Dispara ao alterar uma relacao, limpando os paramtros da relacao antiga
        vm.changeRelation = function() {
            if (vm.params.relation.pedido !== true) {
                vm.params.filter['pedido_produtos.valor'] = {operator: 'BETWEEN'};
                vm.params.filter['pedidos.marketplace'] = {operator: 'IN', value: {}};
                vm.params.filter['pedidos.status'] = {operator: 'IN', value: {}};
                vm.params.filter['pedidos.total'] = {operator: 'BETWEEN'};
                vm.params.filter['pedidos.created_at'] = {operator: 'BETWEEN'};
                vm.params.filter['pedidos.estimated_delivery'] = {operator: 'BETWEEN'};
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

        // altera o sentido de uma ordenacao
        vm.changeOrder = function(index) {
            vm.params.order[index].order = (vm.params.order[index].order == 'asc') ? 'desc' : 'asc';
        };

        // remove uma ordenacao
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
