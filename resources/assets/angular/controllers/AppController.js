(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AppController', AppController)
        .filter('digits', function() {
            return function(text) {
                return String(text).replace(/[^0-9\.]+/g,  '');
            };
        });

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