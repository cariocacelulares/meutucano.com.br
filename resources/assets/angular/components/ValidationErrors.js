(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('validation', {
            bindings: {
                errors: '='
            },
            template:
                '<div ng-if="$ctrl.errors.length" class="row">' +
                    '<div class="col-md-12 m-b-20">' +
                        '<div class="alert alert-warning">' +
                            '<ul class="p-l-20 m-t-0 m-b-0">' +
                                '<li ng-repeat="error in $ctrl.errors track by $index">{{ error }}</li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>'
        });

})();
