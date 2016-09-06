(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('dropdown', {
            bindings: {
                title: '@',
                size:  '@'
            },
            transclude: true,
            templateUrl: 'views/components/dropdown.html'
        });

})();