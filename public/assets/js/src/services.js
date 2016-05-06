(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .provider('envService', function () {
            this.environment = 'development';
            this.data = {};

            this.config = function (config) {
                this.data = config;
            };

            this.set = function (environment) {
                this.environment = environment;
            };

            this.get = function () {
                return this.environment;
            };

            this.read = function (variable) {
                if (variable !== 'all') {
                    return this.data.vars[this.get()][variable];
                }

                return this.data.vars[this.get()];
            };

            this.is = function (environment) {
                return (environment === this.environment);
            };

            this.check = function () {
                var location = window.location.href,
                    self = this;

                angular.forEach(this.data.domains, function (v, k) {
                    angular.forEach(v, function (v) {
                        if (location.match('//' + v)) {
                            self.environment = k;
                        }
                    });
                });
            };

            this.$get = function () {
                return this;
            };
    });
})();

(function() {
    'use strict';

    ToasterInterceptor.$inject = ["$q", "toaster"];
    angular
        .module('MeuTucano')
        .factory('ToasterInterceptor', ToasterInterceptor);


    function ToasterInterceptor($q, toaster) {
        return {
            responseError: function(rejection) {
                if (rejection.data.hasOwnProperty('msg')) {
                    toaster.pop('error', "Houve um problema", rejection.data.msg);
                }
                return $q.reject(rejection);
            }
        };
    }

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudmlyb25tZW50LmpzIiwiVG9hc3RlckludGVyY2VwdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFNBQUEsY0FBQSxZQUFBO1lBQ0EsS0FBQSxjQUFBO1lBQ0EsS0FBQSxPQUFBOztZQUVBLEtBQUEsU0FBQSxVQUFBLFFBQUE7Z0JBQ0EsS0FBQSxPQUFBOzs7WUFHQSxLQUFBLE1BQUEsVUFBQSxhQUFBO2dCQUNBLEtBQUEsY0FBQTs7O1lBR0EsS0FBQSxNQUFBLFlBQUE7Z0JBQ0EsT0FBQSxLQUFBOzs7WUFHQSxLQUFBLE9BQUEsVUFBQSxVQUFBO2dCQUNBLElBQUEsYUFBQSxPQUFBO29CQUNBLE9BQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxPQUFBOzs7Z0JBR0EsT0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBOzs7WUFHQSxLQUFBLEtBQUEsVUFBQSxhQUFBO2dCQUNBLFFBQUEsZ0JBQUEsS0FBQTs7O1lBR0EsS0FBQSxRQUFBLFlBQUE7Z0JBQ0EsSUFBQSxXQUFBLE9BQUEsU0FBQTtvQkFDQSxPQUFBOztnQkFFQSxRQUFBLFFBQUEsS0FBQSxLQUFBLFNBQUEsVUFBQSxHQUFBLEdBQUE7b0JBQ0EsUUFBQSxRQUFBLEdBQUEsVUFBQSxHQUFBO3dCQUNBLElBQUEsU0FBQSxNQUFBLE9BQUEsSUFBQTs0QkFDQSxLQUFBLGNBQUE7Ozs7OztZQU1BLEtBQUEsT0FBQSxZQUFBO2dCQUNBLE9BQUE7Ozs7O0FDL0NBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLHNCQUFBOzs7SUFHQSxTQUFBLG1CQUFBLElBQUEsU0FBQTtRQUNBLE9BQUE7WUFDQSxlQUFBLFNBQUEsV0FBQTtnQkFDQSxJQUFBLFVBQUEsS0FBQSxlQUFBLFFBQUE7b0JBQ0EsUUFBQSxJQUFBLFNBQUEscUJBQUEsVUFBQSxLQUFBOztnQkFFQSxPQUFBLEdBQUEsT0FBQTs7Ozs7S0FLQSIsImZpbGUiOiJzZXJ2aWNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5wcm92aWRlcignZW52U2VydmljZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSAnZGV2ZWxvcG1lbnQnO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGNvbmZpZztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc2V0ID0gZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvbm1lbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnJlYWQgPSBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFyaWFibGUgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFyc1t0aGlzLmdldCgpXVt2YXJpYWJsZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YXJzW3RoaXMuZ2V0KCldO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5pcyA9IGZ1bmN0aW9uIChlbnZpcm9ubWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZW52aXJvbm1lbnQgPT09IHRoaXMuZW52aXJvbm1lbnQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jaGVjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGhpcy5kYXRhLmRvbWFpbnMsIGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2LCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLm1hdGNoKCcvLycgKyB2KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZW52aXJvbm1lbnQgPSBrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmZhY3RvcnkoJ1RvYXN0ZXJJbnRlcmNlcHRvcicsIFRvYXN0ZXJJbnRlcmNlcHRvcik7XG5cblxuICAgIGZ1bmN0aW9uIFRvYXN0ZXJJbnRlcmNlcHRvcigkcSwgdG9hc3Rlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlamVjdGlvbi5kYXRhLmhhc093blByb3BlcnR5KCdtc2cnKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCBcIkhvdXZlIHVtIHByb2JsZW1hXCIsIHJlamVjdGlvbi5kYXRhLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
