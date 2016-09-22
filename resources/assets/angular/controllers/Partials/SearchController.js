(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('SearchController', SearchController)
        .filter('highlight', function($sce) {
            return function(text, phrase) {
                if (phrase) text = String(text).replace(new RegExp('('+phrase+')', 'gi'),
                    '<span class="underline">$1</span>');

                return $sce.trustAsHtml(text);
            };
        });

    function SearchController($rootScope, $state, Restangular, PedidoHelper, ComentarioHelper) {
        var vm = this;

        /**
         * @type {Object}
         */
        vm.comentarioHelper = ComentarioHelper;

        vm.term = null;
        vm.loading = false;
        vm.data = {
            pedidos: null,
            produtos: null,
            clientes: null,
            rastreios: null
        };

        vm.goTo = function(to, params) {
            vm.close();
            $state.go(to, params);
        };

        vm.pedidoHelper = PedidoHelper;

        vm.load = function() {
            if (typeof vm.term !== 'undefined' && vm.term && vm.term.length > 2) {
                vm.data = {};
                vm.loading = true;

                Restangular.one('search').get({ term: vm.term }).then(function(data) {
                    vm.data = data;
                    vm.loading = false;
                });
            }
        };

        vm.close = function() {
            $rootScope.$broadcast('closeSearch');
        };
    }
})();