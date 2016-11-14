(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('totalOrdersByDate', {
            bindings: {
                title: '@'
            },
            templateUrl: 'views/components/dashboard/total-orders-by-date.html',
            controller: function(Pedido) {
                var vm = this;

                vm.ordersDate = {};

                vm.loadTotalOrdersDate = function() {
                    vm.ordersDate = {};

                    Pedido.totalOrdersDate().then(function(response) {
                        vm.ordersDate = response;
                    });
                };

                vm.load = function() {
                    vm.loadTotalOrdersDate();
                };

                vm.load();
            }
        });

})();