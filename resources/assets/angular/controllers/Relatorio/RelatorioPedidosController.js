(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('RelatorioPedidosController', RelatorioPedidosController);

    function RelatorioPedidosController(Restangular) {
        var vm = this;

        vm.filter = {
            total: {operator: 'BETWEEN'},
            created_at: {operator: 'BETWEEN'},
            estimated_delivery: {operator: 'BETWEEN'},
            status: {operator: 'IN', data: {}},
            marketplace: {operator: 'IN', data: {}}
        };

        vm.list = {};

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
            mercadolivre: 'Mercado',
            walmart: 'Walmart',
            site: 'Site'
        };

        vm.setFilters = {
            status: '',
            marketplace: ''
        };

        vm.addFilter = function(key) {
            vm.filter[key].data[vm.setFilters[key]] = vm.list[key][vm.setFilters[key]];
            vm.setFilters[key] = '';
        };

        vm.removeFilter = function(key, index) {
            delete vm.filter[key].data[index];
        };

        vm.group = null;
        vm.order = {};
        vm.setOrder = '';
        vm.fields = {};
        vm.setField = '';

        vm.campos = {
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

        vm.limpar = function() {
            vm.filter = {
                total: {operator: 'BETWEEN'},
                created_at: {operator: 'BETWEEN'},
                estimated_delivery: {operator: 'BETWEEN'}
            };

            vm.group = null;
            vm.order = {};
            vm.setOrder = '';
            vm.fields = {};
            vm.setField = '';
        };

        vm.load = function() {
        };

        vm.load();

        vm.gerar = function() {
            Restangular.one('relatorios/pedido').customPOST({
                filter: vm.filter,
                group: vm.group,
                fields: vm.fields,
                order: vm.order
            }).then(function(response) {
                console.log(response);
            });
        };

        vm.addOrder = function() {
            vm.order[vm.setOrder] = {
                name: vm.campos[vm.setOrder],
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
            vm.fields[vm.setField] = vm.campos[vm.setField];
            vm.setField = '';
        };

        vm.removeField = function(key) {
            delete vm.fields[key];
        };
    }

})();