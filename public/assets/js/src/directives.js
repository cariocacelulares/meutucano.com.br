(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .directive('ngClose', ngClose);

    function ngClose() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 27) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngClose, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    }

})();

(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .directive('ngEnter', ngEnter);

    function ngEnter() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    }

})();

(function() {
    'use strict';

    roles.$inject = ["$rootScope"];
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
(function() {
    'use strict';

    staticInclude.$inject = ["$templateRequest", "$compile"];
    angular
        .module('MeuTucano')
        .directive('staticInclude', staticInclude);

    function staticInclude($templateRequest, $compile) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: false,
            link: function ($scope, element, attrs) {
                var templatePath = attrs.staticInclude;

                $templateRequest(templatePath)
                    .then(function (response) {
                        var contents = element.html(response).contents();
                        $compile(contents)($scope.$new(false, $scope.$parent));
                    });
            }
        };
    }

})();
