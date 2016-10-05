(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RelatorioPedidosController', RelatorioPedidosController);

    function RelatorioPedidosController(Restangular) {
        var vm = this;

        vm.gerar = function() {
            Restangular.one('relatorios/pedido').customPOST({
                filter: vm.filter,
                group: vm.group,
                fields: vm.fields,
                order: vm.order,
                relation: vm.relation
            }).then(function(response) {
                console.log(response);
            });
        };

        vm.defaults = function() {
            vm.filter = {
                total: {operator: 'BETWEEN'},
                'pedidos.created_at': {operator: 'BETWEEN'},
                estimated_delivery: {operator: 'BETWEEN'},
                status: {operator: 'IN', value: {}},
                marketplace: {operator: 'IN', value: {}},
                'cliente_enderecos.uf': {},
                'cliente_enderecos.cidade': {}
            };

            vm.list = {};
            vm.list.cities = {};

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

            vm.listFieldsPedido = {
                codigo_api: 'Código',
                frete_valor: 'Valor Frete',
                frete_metodo: 'Método Frete',
                pagamento_metodo: 'Método pagamento',
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
                created_at: 'Data'
            };

            vm.listFieldsCliente = {
                'cliente.nome': 'Nome (cliente)',
                'cliente.taxvat': 'Documento (cliente)',
                'cliente.fone': 'Telefone (cliente)',
                'cliente.email': 'E-mai (cliente)',
                'cliente.created_at': 'Data (cliente)'
            };

            vm.listFieldsEndereco = {
                'endereco.rua': 'Rua (endereço)',
                'endereco.numero': 'Número (endereço)',
                'endereco.bairro': 'Bairro (endereço)',
                'endereco.complemento': 'Complemento (endereço)',
                'endereco.cidade': 'Cidade (endereço)',
                'endereco.uf': 'UF (endereço)',
                'endereco.cep': 'CEP (endereço)'
            };

            vm.list.fields = vm.listFieldsPedido;

            vm.setFilters = {
                status: '',
                marketplace: ''
            };

            vm.relation = {
                cliente: false,
                endereco: false
            };

            vm.group = null;

            vm.order = {};
            vm.setOrder = '';
            vm.fields = {};
            vm.setField = '';
        };

        vm.limpar = function() {
            vm.defaults();
        };

        vm.load = function() {
            vm.defaults();
        };

        vm.load();

        vm.loadCities = function() {
                Restangular.one('pedidos/cidades', vm.filter['cliente_enderecos.uf'].value).getList().then(function(response) {
                    vm.list.cities = response;
                });
        };

        vm.changeRelation = function() {
            var key = null;
            var fields = _.clone(vm.listFieldsPedido);

            if (vm.relation.cliente === true) {
                fields = _.extend(fields, vm.listFieldsCliente);
            }

            if (vm.relation.endereco === true) {
                fields = _.extend(fields, vm.listFieldsEndereco);
            }

            vm.list.fields = fields;
        };

        vm.addFilter = function(key) {
            vm.filter[key].value[vm.setFilters[key]] = vm.list[key][vm.setFilters[key]];
            vm.setFilters[key] = '';
        };

        vm.removeFilter = function(key, index) {
            delete vm.filter[key].value[index];
        };

        vm.addOrder = function() {
            vm.order[vm.setOrder] = {
                name: vm.list.fields[vm.setOrder],
                order: 'asc'
            };

            vm.setOrder = '';
        };

        vm.changeOrder = function(key) {
            vm.order[key].order = (vm.order[key].order == 'asc') ? 'desc' : 'asc';
        };

        vm.removeOrder = function(key) {
            delete vm.order[key];
        };

        vm.addField = function() {
            vm.fields[vm.setField] = vm.list.fields[vm.setField];
            vm.setField = '';
        };

        vm.removeField = function(key) {
            delete vm.fields[key];
        };
    }

})();