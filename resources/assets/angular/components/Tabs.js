(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('tabs', {
            transclude: true,
            templateUrl: 'views/components/tabs.html'
        });

})();