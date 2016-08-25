(function() {
    'use strict';

    confirm.$inject = ["$rootScope"];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmZpcm0uanMiLCJOZ0Nsb3NlLmpzIiwiTmdFbnRlci5qcyIsIlJvbGUuanMiLCJTdGF0aWNJbmNsdWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxRQUFBLFlBQUE7UUFDQSxPQUFBO1lBQ0EsVUFBQTtZQUNBLE9BQUE7Z0JBQ0EsU0FBQTs7WUFFQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUEsYUFBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQSxXQUFBO29CQUNBLEtBQUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUE7d0JBQ0Esa0JBQUE7d0JBQ0Esa0JBQUE7d0JBQ0Esb0JBQUE7d0JBQ0EsbUJBQUE7dUJBQ0EsV0FBQTt3QkFDQSxNQUFBOzs7Ozs7OztBQ3hCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxTQUFBLE9BQUEsU0FBQSxPQUFBO1lBQ0EsUUFBQSxLQUFBLG9CQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLE1BQUEsVUFBQSxJQUFBO29CQUNBLE1BQUEsT0FBQSxVQUFBO3dCQUNBLE1BQUEsTUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBOzs7b0JBR0EsTUFBQTs7Ozs7Ozs7QUNmQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxTQUFBLE9BQUEsU0FBQSxPQUFBO1lBQ0EsUUFBQSxLQUFBLG9CQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLE1BQUEsVUFBQSxJQUFBO29CQUNBLE1BQUEsT0FBQSxVQUFBO3dCQUNBLE1BQUEsTUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBOzs7b0JBR0EsTUFBQTs7Ozs7Ozs7QUNmQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxTQUFBOztJQUVBLFNBQUEsTUFBQSxZQUFBO1FBQ0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxNQUFBLFNBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQTtnQkFDQSxJQUFBLGNBQUEsV0FBQTtvQkFDQSxTQUFBLFlBQUE7OztnQkFHQSxJQUFBLGFBQUEsV0FBQTtvQkFDQSxTQUFBLFNBQUE7OztnQkFHQSxJQUFBLHNCQUFBLFdBQUE7b0JBQ0EsSUFBQTs7b0JBRUEsU0FBQTtvQkFDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUE7d0JBQ0EsSUFBQSxFQUFBLEtBQUEsV0FBQSxZQUFBLE9BQUEsQ0FBQSxNQUFBLFFBQUE7NEJBQ0EsU0FBQTs7OztvQkFJQSxJQUFBLFdBQUEsTUFBQTt3QkFDQTsyQkFDQTt3QkFDQTs7OztnQkFJQSxJQUFBLFFBQUEsT0FBQTs7Z0JBRUEsSUFBQSxNQUFBLFFBQUEsUUFBQTtvQkFDQSxRQUFBLE1BQUEsTUFBQTtxQkFDQSxJQUFBLE1BQUEsU0FBQTtvQkFDQSxRQUFBLENBQUE7O2dCQUVBLElBQUEsTUFBQSxTQUFBLEdBQUE7Ozs7OztBQzNDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxpQkFBQTs7SUFFQSxTQUFBLGNBQUEsa0JBQUEsVUFBQTtRQUNBLE9BQUE7WUFDQSxVQUFBO1lBQ0EsWUFBQTtZQUNBLFNBQUE7WUFDQSxPQUFBO1lBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxPQUFBO2dCQUNBLElBQUEsZUFBQSxNQUFBOztnQkFFQSxpQkFBQTtxQkFDQSxLQUFBLFVBQUEsVUFBQTt3QkFDQSxJQUFBLFdBQUEsUUFBQSxLQUFBLFVBQUE7d0JBQ0EsU0FBQSxVQUFBLE9BQUEsS0FBQSxPQUFBLE9BQUE7Ozs7Ozs7QUFPQSIsImZpbGUiOiJkaXJlY3RpdmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29uZmlybScsIGNvbmZpcm0pO1xuXG4gICAgZnVuY3Rpb24gY29uZmlybSgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjb25maXJtOiAnJidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJUZW0gY2VydGV6YT9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRXN0ZSBpdGVtIHNlcsOhIGV4Y2x1aWRvIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJOw6NvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0Y1NTc1MlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiU2ltIVwiXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29uZmlybSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnbmdDbG9zZScsIG5nQ2xvc2UpO1xuXG4gICAgZnVuY3Rpb24gbmdDbG9zZSgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgZWxlbWVudC5iaW5kKFwia2V5ZG93biBrZXlwcmVzc1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmKGV2ZW50LndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHJzLm5nQ2xvc2UsIHsnZXZlbnQnOiBldmVudH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ25nRW50ZXInLCBuZ0VudGVyKTtcblxuICAgIGZ1bmN0aW9uIG5nRW50ZXIoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYmluZChcImtleWRvd24ga2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZihldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kZXZhbChhdHRycy5uZ0VudGVyLCB7J2V2ZW50JzogZXZlbnR9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCdyb2xlcycsIHJvbGVzKTtcblxuICAgIGZ1bmN0aW9uIHJvbGVzKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiBsaW5rRnVuYygkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFrZVZpc2libGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgbWFrZUhpZGRlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBkZXRlcm1pbmVWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb2xlcywgZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uZmluZCgkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnJvbGVzLCB7bmFtZTogcm9sZX0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFrZVZpc2libGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VIaWRkZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgcm9sZXMgPSAkYXR0cnMucm9sZXM7XG5cbiAgICAgICAgICAgICAgICBpZiAocm9sZXMuaW5kZXhPZignfCcpID49IDApXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzID0gcm9sZXMuc3BsaXQoJ3wnKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyb2xlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgICAgICByb2xlcyA9IFtyb2xlc107XG5cbiAgICAgICAgICAgICAgICBpZiAocm9sZXMubGVuZ3RoID4gMCkgZGV0ZXJtaW5lVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCdzdGF0aWNJbmNsdWRlJywgc3RhdGljSW5jbHVkZSk7XG5cbiAgICBmdW5jdGlvbiBzdGF0aWNJbmNsdWRlKCR0ZW1wbGF0ZVJlcXVlc3QsICRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVBhdGggPSBhdHRycy5zdGF0aWNJbmNsdWRlO1xuXG4gICAgICAgICAgICAgICAgJHRlbXBsYXRlUmVxdWVzdCh0ZW1wbGF0ZVBhdGgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRzID0gZWxlbWVudC5odG1sKHJlc3BvbnNlKS5jb250ZW50cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUoY29udGVudHMpKCRzY29wZS4kbmV3KGZhbHNlLCAkc2NvcGUuJHBhcmVudCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
