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
                        text: "Esta ação não poderá ser desfeita!",
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmZpcm0uanMiLCJOZ0Nsb3NlLmpzIiwiTmdFbnRlci5qcyIsIlJvbGUuanMiLCJTdGF0aWNJbmNsdWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxRQUFBLFlBQUE7UUFDQSxPQUFBO1lBQ0EsVUFBQTtZQUNBLE9BQUE7Z0JBQ0EsU0FBQTs7WUFFQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUEsYUFBQTtnQkFDQSxRQUFBLEdBQUEsU0FBQSxXQUFBO29CQUNBLEtBQUE7d0JBQ0EsT0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUE7d0JBQ0Esa0JBQUE7d0JBQ0Esa0JBQUE7d0JBQ0Esb0JBQUE7d0JBQ0EsbUJBQUE7dUJBQ0EsV0FBQTt3QkFDQSxNQUFBOzs7Ozs7OztBQ3hCQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxTQUFBLE9BQUEsU0FBQSxPQUFBO1lBQ0EsUUFBQSxLQUFBLG9CQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLE1BQUEsVUFBQSxJQUFBO29CQUNBLE1BQUEsT0FBQSxVQUFBO3dCQUNBLE1BQUEsTUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBOzs7b0JBR0EsTUFBQTs7Ozs7Ozs7QUNmQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxTQUFBLE9BQUEsU0FBQSxPQUFBO1lBQ0EsUUFBQSxLQUFBLG9CQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLE1BQUEsVUFBQSxJQUFBO29CQUNBLE1BQUEsT0FBQSxVQUFBO3dCQUNBLE1BQUEsTUFBQSxNQUFBLFNBQUEsQ0FBQSxTQUFBOzs7b0JBR0EsTUFBQTs7Ozs7Ozs7QUNmQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxTQUFBOztJQUVBLFNBQUEsTUFBQSxZQUFBO1FBQ0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxNQUFBLFNBQUEsU0FBQSxRQUFBLFVBQUEsUUFBQTtnQkFDQSxJQUFBLGNBQUEsV0FBQTtvQkFDQSxTQUFBLFlBQUE7OztnQkFHQSxJQUFBLGFBQUEsV0FBQTtvQkFDQSxTQUFBLFNBQUE7OztnQkFHQSxJQUFBLHNCQUFBLFdBQUE7b0JBQ0EsSUFBQTs7b0JBRUEsU0FBQTtvQkFDQSxRQUFBLFFBQUEsT0FBQSxTQUFBLE1BQUE7d0JBQ0EsSUFBQSxFQUFBLEtBQUEsV0FBQSxZQUFBLE9BQUEsQ0FBQSxNQUFBLFFBQUE7NEJBQ0EsU0FBQTs7OztvQkFJQSxJQUFBLFdBQUEsTUFBQTt3QkFDQTsyQkFDQTt3QkFDQTs7OztnQkFJQSxJQUFBLFFBQUEsT0FBQTs7Z0JBRUEsSUFBQSxNQUFBLFFBQUEsUUFBQTtvQkFDQSxRQUFBLE1BQUEsTUFBQTtxQkFDQSxJQUFBLE1BQUEsU0FBQTtvQkFDQSxRQUFBLENBQUE7O2dCQUVBLElBQUEsTUFBQSxTQUFBLEdBQUE7Ozs7OztBQzNDQSxDQUFBLFdBQUE7SUFDQTs7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxpQkFBQTs7SUFFQSxTQUFBLGNBQUEsa0JBQUEsVUFBQTtRQUNBLE9BQUE7WUFDQSxVQUFBO1lBQ0EsWUFBQTtZQUNBLFNBQUE7WUFDQSxPQUFBO1lBQ0EsTUFBQSxVQUFBLFFBQUEsU0FBQSxPQUFBO2dCQUNBLElBQUEsZUFBQSxNQUFBOztnQkFFQSxpQkFBQTtxQkFDQSxLQUFBLFVBQUEsVUFBQTt3QkFDQSxJQUFBLFdBQUEsUUFBQSxLQUFBLFVBQUE7d0JBQ0EsU0FBQSxVQUFBLE9BQUEsS0FBQSxPQUFBLE9BQUE7Ozs7Ozs7QUFPQSIsImZpbGUiOiJkaXJlY3RpdmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29uZmlybScsIGNvbmZpcm0pO1xuXG4gICAgZnVuY3Rpb24gY29uZmlybSgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjb25maXJtOiAnJidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJUZW0gY2VydGV6YT9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiRXN0YSBhw6fDo28gbsOjbyBwb2RlcsOhIHNlciBkZXNmZWl0YSFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IFwiTsOjb1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNGNTU3NTJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlNpbSFcIlxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNvbmZpcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ25nQ2xvc2UnLCBuZ0Nsb3NlKTtcblxuICAgIGZ1bmN0aW9uIG5nQ2xvc2UoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYmluZChcImtleWRvd24ga2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZihldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kZXZhbChhdHRycy5uZ0Nsb3NlLCB7J2V2ZW50JzogZXZlbnR9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCduZ0VudGVyJywgbmdFbnRlcik7XG5cbiAgICBmdW5jdGlvbiBuZ0VudGVyKCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBlbGVtZW50LmJpbmQoXCJrZXlkb3duIGtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGV2YWwoYXR0cnMubmdFbnRlciwgeydldmVudCc6IGV2ZW50fSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmRpcmVjdGl2ZSgncm9sZXMnLCByb2xlcyk7XG5cbiAgICBmdW5jdGlvbiByb2xlcygkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gbGlua0Z1bmMoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1ha2VWaXNpYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIG1ha2VIaWRkZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgZGV0ZXJtaW5lVmlzaWJpbGl0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocm9sZXMsIGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmZpbmQoJHJvb3RTY29wZS5jdXJyZW50VXNlci5yb2xlcywge25hbWU6IHJvbGV9KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VWaXNpYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYWtlSGlkZGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvbGVzID0gJGF0dHJzLnJvbGVzO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvbGVzLmluZGV4T2YoJ3wnKSA+PSAwKVxuICAgICAgICAgICAgICAgICAgICByb2xlcyA9IHJvbGVzLnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocm9sZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgcm9sZXMgPSBbcm9sZXNdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvbGVzLmxlbmd0aCA+IDApIGRldGVybWluZVZpc2liaWxpdHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnc3RhdGljSW5jbHVkZScsIHN0YXRpY0luY2x1ZGUpO1xuXG4gICAgZnVuY3Rpb24gc3RhdGljSW5jbHVkZSgkdGVtcGxhdGVSZXF1ZXN0LCAkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVQYXRoID0gYXR0cnMuc3RhdGljSW5jbHVkZTtcblxuICAgICAgICAgICAgICAgICR0ZW1wbGF0ZVJlcXVlc3QodGVtcGxhdGVQYXRoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50cyA9IGVsZW1lbnQuaHRtbChyZXNwb25zZSkuY29udGVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb21waWxlKGNvbnRlbnRzKSgkc2NvcGUuJG5ldyhmYWxzZSwgJHNjb3BlLiRwYXJlbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
