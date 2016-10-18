(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AppController', AppController)
        .filter('digits', function() {
            return function(text) {
                return String(text).replace(/[^0-9\.]+/g,  '');
            };
        })
        .filter('propsFilter', function() {
            return function(items, props) {
                var out = [];

                if (angular.isArray(items)) {
                    var keys = Object.keys(props);

                    items.forEach(function(item) {
                        var itemMatches = false;

                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    // Let the output be the input untouched
                    out = items;
                }

                return out;
            };
        });

    function AppController($rootScope, focus, envService) {
        var vm = this;

        vm.searchOpen = false;
        vm.user = $rootScope.currentUser;

        $rootScope.asset = function(assetUrl) {
            return envService.read('assetUrl') + assetUrl;
        };

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