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
        var vm    = this;
        var limit = 9;

        /**
         * @type {Object}
         */
        vm.comentarioHelper = ComentarioHelper;

        /**
         * @type {Object}
         */
        vm.pedidoHelper = PedidoHelper;

        vm.noResults = false;
        vm.term      = null;
        vm.prevTerm  = null;
        vm.loading   = false;
        vm.hasMore   = false;
        vm.nLoads    = 0;

        vm.categories = {
            pedidos : true,
            clientes: false,
            produtos: false
        };
        vm.prevCategories = vm.categories;

        vm.data = {
            pedidos  : [],
            produtos : [],
            clientes : []
        };

        /**
         * Ativa/desativa categorias
         * @param  {string} category 
         * @return {void}
         */
        vm.toggleCategory = function(category) {
            vm.categories[category] = ! vm.categories[category];
            vm.load();
        }

        /**
         * Vai até a rota e fecha a busca
         *
         * @param  {string} to
         * @param  {Object} params
         * @return {void}
         */
        vm.goTo = function(to, params) {
            vm.close();
            $state.go(to, params);
        };

        /**
         * Checa se os parametros foram atualizados
         * @return {void}
         */
        vm.checkUpdates = function() {
            if (vm.term !== vm.prevTerm) {
                vm.nLoads = 0;
            }
            vm.prevTerm = vm.term;

            vm.checkUpdates = function() {
                if (vm.term !== vm.prevTerm) {
                    vm.nLoads = 0;
                }
                vm.prevTerm = vm.term;

                if (vm.categories !== vm.prevCategories) {
                    vm.nLoads = 0;
                }
                vm.prevCategories = vm.categories;
            }
        };

        /**
         * Organiza os parametros e faz a Busca
         * @param  {bool} more
         * @return {void}
         */
        vm.load = function(more) {
            more = (typeof more === 'undefined' || !more) ? false : true;

            if (typeof vm.term !== 'undefined' && vm.term && vm.term.length > 2) {
                if (!more) {
                    vm.noResults = false;
                    vm.loading   = true;
                    vm.data      = {
                        pedidos  : [],
                        produtos : [],
                        clientes : []
                    };
                }

                var categories = '';
                for (var key in vm.categories) {
                    if (vm.categories[key]) {
                        categories += key + ',';
                    }
                }

                vm.checkUpdates();

                Restangular.one('search').get({
                    categories: categories,
                    term      : vm.term,
                    offset    : vm.nLoads * limit
                 }).then(function(data) {
                    vm.loading = false;
                    vm.hasMore = true;

                    for (var key in data.pedidos) {
                        vm.data.pedidos.push(data.pedidos[key]);
                    }

                    for (var key in data.clientes) {
                        vm.data.clientes.push(data.clientes[key]);
                    }

                    for (var key in data.produtos) {
                        vm.data.produtos.push(data.produtos[key]);
                    }

                    vm.data.offset = data.offset;

                    if (data.pedidos.length + data.clientes.length + data.produtos.length < limit) {
                        vm.hasMore = false;
                    }

                    if (!vm.data.pedidos.length && !vm.data.produtos.length && !vm.data.clientes.length) {
                        vm.noResults = true;
                    }
                });
            }
        };

        /**
         * Infinite scroll
         * @return {void}
         */
        vm.more = function() {
            vm.nLoads++;
            vm.load(true);
        };

        /**
         * Fecha busca
         * @return {void}
         */
        vm.close = function() {
            $rootScope.$broadcast('closeSearch');
            vm.term     = null;
            vm.prevTerm = null;
            vm.nLoads   = 0;
        };
    }
})();
