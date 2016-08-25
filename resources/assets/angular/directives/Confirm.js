(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .directive('confirm', confirm);

    function confirm($rootScope) {
        return {
            restrict: 'A',
            scope: {
                confirm: '&'
            },
            link: function(scope, element, attrs, controllers) {
                element.on('click', function() {
                    swal({
                        title: "Tem certeza?",
                        text: "Este item será excluido!",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "Não",
                        confirmButtonColor: "#F55752",
                        confirmButtonText: "Sim!"
                    }, function() {
                        scope.confirm();
                    });
                });
            }
        };
    }

})();