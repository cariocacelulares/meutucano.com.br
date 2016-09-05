(function() {
    'use strict';

    confirm.$inject = ["$rootScope", "SweetAlert"];
    angular
        .module('MeuTucano')
        .directive('confirm', confirm);

    function confirm($rootScope, SweetAlert) {
        return {
            restrict: 'A',
            scope: {
                confirm: '&'
            },
            link: function(scope, element, attrs, controllers) {
                element.on('click', function() {
                    SweetAlert.swal({
                        title: "Tem certeza?",
                        text: "Esta ação não poderá ser desfeita!",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "Não",
                        confirmButtonColor: "#F55752",
                        confirmButtonText: "Sim!"
                    }, function(isConfirm) {
                        if (isConfirm) {
                            scope.confirm();
                        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmZpcm0uanMiLCJOZ0Nsb3NlLmpzIiwiTmdFbnRlci5qcyIsIlJvbGUuanMiLCJTdGF0aWNJbmNsdWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFdBQUE7O0lBRUEsU0FBQSxRQUFBLFlBQUEsWUFBQTtRQUNBLE9BQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTtnQkFDQSxTQUFBOztZQUVBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQSxhQUFBO2dCQUNBLFFBQUEsR0FBQSxTQUFBLFdBQUE7b0JBQ0EsV0FBQSxLQUFBO3dCQUNBLE9BQUE7d0JBQ0EsTUFBQTt3QkFDQSxNQUFBO3dCQUNBLGtCQUFBO3dCQUNBLGtCQUFBO3dCQUNBLG9CQUFBO3dCQUNBLG1CQUFBO3VCQUNBLFNBQUEsV0FBQTt3QkFDQSxJQUFBLFdBQUE7NEJBQ0EsTUFBQTs7Ozs7Ozs7O0FDekJBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTs7SUFFQSxTQUFBLFVBQUE7UUFDQSxPQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7WUFDQSxRQUFBLEtBQUEsb0JBQUEsU0FBQSxPQUFBO2dCQUNBLEdBQUEsTUFBQSxVQUFBLElBQUE7b0JBQ0EsTUFBQSxPQUFBLFVBQUE7d0JBQ0EsTUFBQSxNQUFBLE1BQUEsU0FBQSxDQUFBLFNBQUE7OztvQkFHQSxNQUFBOzs7Ozs7OztBQ2ZBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTs7SUFFQSxTQUFBLFVBQUE7UUFDQSxPQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7WUFDQSxRQUFBLEtBQUEsb0JBQUEsU0FBQSxPQUFBO2dCQUNBLEdBQUEsTUFBQSxVQUFBLElBQUE7b0JBQ0EsTUFBQSxPQUFBLFVBQUE7d0JBQ0EsTUFBQSxNQUFBLE1BQUEsU0FBQSxDQUFBLFNBQUE7OztvQkFHQSxNQUFBOzs7Ozs7OztBQ2ZBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFNBQUE7O0lBRUEsU0FBQSxNQUFBLFlBQUE7UUFDQSxPQUFBO1lBQ0EsVUFBQTtZQUNBLE1BQUEsU0FBQSxTQUFBLFFBQUEsVUFBQSxRQUFBO2dCQUNBLElBQUEsY0FBQSxXQUFBO29CQUNBLFNBQUEsWUFBQTs7O2dCQUdBLElBQUEsYUFBQSxXQUFBO29CQUNBLFNBQUEsU0FBQTs7O2dCQUdBLElBQUEsc0JBQUEsV0FBQTtvQkFDQSxJQUFBOztvQkFFQSxTQUFBO29CQUNBLFFBQUEsUUFBQSxPQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLEVBQUEsS0FBQSxXQUFBLFlBQUEsT0FBQSxDQUFBLE1BQUEsUUFBQTs0QkFDQSxTQUFBOzs7O29CQUlBLElBQUEsV0FBQSxNQUFBO3dCQUNBOzJCQUNBO3dCQUNBOzs7O2dCQUlBLElBQUEsUUFBQSxPQUFBOztnQkFFQSxJQUFBLE1BQUEsUUFBQSxRQUFBO29CQUNBLFFBQUEsTUFBQSxNQUFBO3FCQUNBLElBQUEsTUFBQSxTQUFBO29CQUNBLFFBQUEsQ0FBQTs7Z0JBRUEsSUFBQSxNQUFBLFNBQUEsR0FBQTs7Ozs7O0FDM0NBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxVQUFBLGlCQUFBOztJQUVBLFNBQUEsY0FBQSxrQkFBQSxVQUFBO1FBQ0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTtZQUNBLE9BQUE7WUFDQSxNQUFBLFVBQUEsUUFBQSxTQUFBLE9BQUE7Z0JBQ0EsSUFBQSxlQUFBLE1BQUE7O2dCQUVBLGlCQUFBO3FCQUNBLEtBQUEsVUFBQSxVQUFBO3dCQUNBLElBQUEsV0FBQSxRQUFBLEtBQUEsVUFBQTt3QkFDQSxTQUFBLFVBQUEsT0FBQSxLQUFBLE9BQUEsT0FBQTs7Ozs7OztBQU9BIiwiZmlsZSI6ImRpcmVjdGl2ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCdjb25maXJtJywgY29uZmlybSk7XG5cbiAgICBmdW5jdGlvbiBjb25maXJtKCRyb290U2NvcGUsIFN3ZWV0QWxlcnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGNvbmZpcm06ICcmJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBTd2VldEFsZXJ0LnN3YWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiVGVtIGNlcnRlemE/XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkVzdGEgYcOnw6NvIG7Do28gcG9kZXLDoSBzZXIgZGVzZmVpdGEhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIk7Do29cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjRjU1NzUyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJTaW0hXCJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oaXNDb25maXJtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb25maXJtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29uZmlybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnbmdDbG9zZScsIG5nQ2xvc2UpO1xuXG4gICAgZnVuY3Rpb24gbmdDbG9zZSgpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgZWxlbWVudC5iaW5kKFwia2V5ZG93biBrZXlwcmVzc1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmKGV2ZW50LndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsKGF0dHJzLm5nQ2xvc2UsIHsnZXZlbnQnOiBldmVudH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ25nRW50ZXInLCBuZ0VudGVyKTtcblxuICAgIGZ1bmN0aW9uIG5nRW50ZXIoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYmluZChcImtleWRvd24ga2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZihldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kZXZhbChhdHRycy5uZ0VudGVyLCB7J2V2ZW50JzogZXZlbnR9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCdyb2xlcycsIHJvbGVzKTtcblxuICAgIGZ1bmN0aW9uIHJvbGVzKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiBsaW5rRnVuYygkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFrZVZpc2libGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgbWFrZUhpZGRlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHZhciBkZXRlcm1pbmVWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb2xlcywgZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uZmluZCgkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnJvbGVzLCB7bmFtZTogcm9sZX0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFrZVZpc2libGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VIaWRkZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgcm9sZXMgPSAkYXR0cnMucm9sZXM7XG5cbiAgICAgICAgICAgICAgICBpZiAocm9sZXMuaW5kZXhPZignfCcpID49IDApXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzID0gcm9sZXMuc3BsaXQoJ3wnKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyb2xlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgICAgICByb2xlcyA9IFtyb2xlc107XG5cbiAgICAgICAgICAgICAgICBpZiAocm9sZXMubGVuZ3RoID4gMCkgZGV0ZXJtaW5lVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZGlyZWN0aXZlKCdzdGF0aWNJbmNsdWRlJywgc3RhdGljSW5jbHVkZSk7XG5cbiAgICBmdW5jdGlvbiBzdGF0aWNJbmNsdWRlKCR0ZW1wbGF0ZVJlcXVlc3QsICRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICBzY29wZTogZmFsc2UsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVBhdGggPSBhdHRycy5zdGF0aWNJbmNsdWRlO1xuXG4gICAgICAgICAgICAgICAgJHRlbXBsYXRlUmVxdWVzdCh0ZW1wbGF0ZVBhdGgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRlbnRzID0gZWxlbWVudC5odG1sKHJlc3BvbnNlKS5jb250ZW50cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUoY29udGVudHMpKCRzY29wZS4kbmV3KGZhbHNlLCAkc2NvcGUuJHBhcmVudCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
