(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('metas', {
            templateUrl: 'views/components/metas.html',
            controller: function($rootScope, Restangular) {
                var vm = this;

                vm.data = {};
                vm.loading = false;

                vm.loadMeta = function() {
                    vm.loading = true;

                    Restangular.one('metas/atual').customGET().then(function(metas) {
                        vm.data = metas;
                        vm.loading = false;
                    });
                };

                vm.loadMeta();
            },
            controllerAs: 'Metas'
        });

})();