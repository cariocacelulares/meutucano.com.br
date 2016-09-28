(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .directive('roles', roles);

    function roles($rootScope) {
        return {
            restrict: 'A',
            link: function linkFunc($scope, $element, $attrs) {
                var makeVisible = function() {
                    $element.removeClass('hidden');
                };

                var makeHidden = function() {
                    $element.addClass('hidden');
                };

                var determineVisibility = function() {
                    var result;

                    result = false;
                    angular.forEach(roles, function(role) {
                        if (_.find($rootScope.currentUser.roles, {name: role})) {
                            result = true;
                        }
                    });

                    if (result === true) {
                        makeVisible();
                    } else {
                        makeHidden();
                    }
                };

                var roles = $attrs.roles;

                if (roles.indexOf('|') >= 0)
                    roles = roles.split('|');
                else if (roles.length > 0)
                    roles = [roles];

                if (roles.length > 0) determineVisibility();
            }
        };
    }

})();