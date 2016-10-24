(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('caixaSugestao', {
            bindings: {
                title: '@'
            },
            templateUrl: 'views/components/dashboard/caixa-sugestao.html',
            controller: function(SugestaoHelper) {
                var vm = this;

                /**
                 * @type {Object}
                 */
                vm.sugestaoHelper = SugestaoHelper.init(vm);
            }
        });

})();