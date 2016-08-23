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

    angular
        .module('MeuTucano')
        .service('Filter', ["$rootScope", "$timeout", "$localStorage", function ($rootScope, $timeout, $localStorage) {
            var vm, name, operators;

            return {
                init: function(name, vm, operators) {
                    this.name      = name;
                    this.vm        = vm;
                    this.operators = operators;

                    if (!$localStorage.filter) $localStorage.filter = {};

                    if ($localStorage.filter.hasOwnProperty(this.name)) {
                        this.vm.filter = $localStorage.filter[this.name];
                    }

                    var initializing = true;
                    $rootScope.$watch(function() {
                        return vm.filter;
                    }, function() {
                        if (initializing) {
                            $timeout(function() { initializing = false; });
                        } else {
                            angular.forEach(this.vm.filter, function(value, key) {
                                if (value.length === 0) 
                                    delete this.vm.filter[key];
                            }, this);

                            $localStorage.filter[this.name] = angular.extend($localStorage.filter[this.name] || {}, this.vm.filter);

                            if (this.vm.hasOwnProperty('tableHeader')) {
                                this.vm.tableHeader.pagination.page = 1;
                            }

                            this.vm.load();
                        }
                    }.bind(this), true);

                    return this;
                },

                parse: function() {
                    this.parsedFilter = [];

                    angular.forEach(this.vm.filter, function(value, key) {
                        var op = this.operators[key] || '=';

                        this.parsedFilter.push({
                            'column':   key,
                            'operator': op,
                            'value':    value
                        });
                    }, this);

                    return this.parsedFilter;
                },

                clear: function() {
                    this.vm.filter = {};
                    $localStorage.filter[this.name] = {};
                }
            };
    }]);
})();

(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Rest', ["Restangular", function (Restangular) {
            return {
                baseUrl:   '',

                /**
                 * Retorna uma lista do recurso
                 * 
                 * @param  {Object} params  
                 * @return {Array}        
                 */
                getList: function(params) {
                    params = this.parseParams(params);

                    return Restangular.all(this.baseUrl + '/list').customGET("", params || {});
                }, 

                /**
                 * Retorna os parâmetros manipulados
                 * 
                 * @param  {Object} params 
                 * @return {Object}        
                 */
                parseParams: function(params) {
                    if (params) {
                        angular.forEach(['join', 'filter', 'fields', 'with'], function(value) {
                            if (this.hasOwnProperty(value)) {
                                this[value] = JSON.stringify(this[value]);
                            }
                        }, params);
                    }

                    return params;
                },

                /**
                 * Busca um registro de recurso
                 * 
                 * @param  {int}    id 
                 * @return {Object}    
                 */
                get: function(id) {
                    return Restangular.one(this.baseUrl, id).get();
                },

                /**
                 * Cria um novo registro do recurso
                 * 
                 * @param  {Object} params 
                 * @return {Object}
                 */
                create: function(params) {
                    return Restangular.all(this.baseUrl).post(params);
                },

                /**
                 * Atualiza um registro do recurso
                 * 
                 * @param  {int}    id     
                 * @param  {Object} params 
                 * @return {Object}       
                 */
                update: function(id, params) {
                    return Restangular.one(this.baseUrl, id).customPUT(params || {});
                },

                /**
                 * Atualiza ou cria um registro do recurso
                 * 
                 * @param  {Object} params 
                 * @param  {int} id     
                 * @return {Object}        
                 */
                save: function(params, id) {
                    if (id) {
                        return this.update(id, params);
                    } else {
                        return this.create(params);
                    }
                },

                /**
                 * Deleta um registro do recurso
                 * 
                 * @param  {int}    id 
                 * @return {Object}    
                 */
                delete: function(id) {
                    return Restangular.one(this.baseUrl, id).remove();
                }
            };
    }]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudmlyb25tZW50LmpzIiwiRmlsdGVyLmpzIiwiUmVzdC5qcyIsIlRvYXN0ZXJJbnRlcmNlcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxTQUFBLGNBQUEsWUFBQTtZQUNBLEtBQUEsY0FBQTtZQUNBLEtBQUEsT0FBQTs7WUFFQSxLQUFBLFNBQUEsVUFBQSxRQUFBO2dCQUNBLEtBQUEsT0FBQTs7O1lBR0EsS0FBQSxNQUFBLFVBQUEsYUFBQTtnQkFDQSxLQUFBLGNBQUE7OztZQUdBLEtBQUEsTUFBQSxZQUFBO2dCQUNBLE9BQUEsS0FBQTs7O1lBR0EsS0FBQSxPQUFBLFVBQUEsVUFBQTtnQkFDQSxJQUFBLGFBQUEsT0FBQTtvQkFDQSxPQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTs7O2dCQUdBLE9BQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTs7O1lBR0EsS0FBQSxLQUFBLFVBQUEsYUFBQTtnQkFDQSxRQUFBLGdCQUFBLEtBQUE7OztZQUdBLEtBQUEsUUFBQSxZQUFBO2dCQUNBLElBQUEsV0FBQSxPQUFBLFNBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxTQUFBLFVBQUEsR0FBQSxHQUFBO29CQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsR0FBQTt3QkFDQSxJQUFBLFNBQUEsTUFBQSxPQUFBLElBQUE7NEJBQ0EsS0FBQSxjQUFBOzs7Ozs7WUFNQSxLQUFBLE9BQUEsWUFBQTtnQkFDQSxPQUFBOzs7OztBQy9DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLHNEQUFBLFVBQUEsWUFBQSxVQUFBLGVBQUE7WUFDQSxJQUFBLElBQUEsTUFBQTs7WUFFQSxPQUFBO2dCQUNBLE1BQUEsU0FBQSxNQUFBLElBQUEsV0FBQTtvQkFDQSxLQUFBLFlBQUE7b0JBQ0EsS0FBQSxZQUFBO29CQUNBLEtBQUEsWUFBQTs7b0JBRUEsSUFBQSxDQUFBLGNBQUEsUUFBQSxjQUFBLFNBQUE7O29CQUVBLElBQUEsY0FBQSxPQUFBLGVBQUEsS0FBQSxPQUFBO3dCQUNBLEtBQUEsR0FBQSxTQUFBLGNBQUEsT0FBQSxLQUFBOzs7b0JBR0EsSUFBQSxlQUFBO29CQUNBLFdBQUEsT0FBQSxXQUFBO3dCQUNBLE9BQUEsR0FBQTt1QkFDQSxXQUFBO3dCQUNBLElBQUEsY0FBQTs0QkFDQSxTQUFBLFdBQUEsRUFBQSxlQUFBOytCQUNBOzRCQUNBLFFBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsS0FBQTtnQ0FDQSxJQUFBLE1BQUEsV0FBQTtvQ0FDQSxPQUFBLEtBQUEsR0FBQSxPQUFBOytCQUNBOzs0QkFFQSxjQUFBLE9BQUEsS0FBQSxRQUFBLFFBQUEsT0FBQSxjQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxHQUFBOzs0QkFFQSxJQUFBLEtBQUEsR0FBQSxlQUFBLGdCQUFBO2dDQUNBLEtBQUEsR0FBQSxZQUFBLFdBQUEsT0FBQTs7OzRCQUdBLEtBQUEsR0FBQTs7c0JBRUEsS0FBQSxPQUFBOztvQkFFQSxPQUFBOzs7Z0JBR0EsT0FBQSxXQUFBO29CQUNBLEtBQUEsZUFBQTs7b0JBRUEsUUFBQSxRQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsT0FBQSxLQUFBO3dCQUNBLElBQUEsS0FBQSxLQUFBLFVBQUEsUUFBQTs7d0JBRUEsS0FBQSxhQUFBLEtBQUE7NEJBQ0EsWUFBQTs0QkFDQSxZQUFBOzRCQUNBLFlBQUE7O3VCQUVBOztvQkFFQSxPQUFBLEtBQUE7OztnQkFHQSxPQUFBLFdBQUE7b0JBQ0EsS0FBQSxHQUFBLFNBQUE7b0JBQ0EsY0FBQSxPQUFBLEtBQUEsUUFBQTs7Ozs7O0FDL0RBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsd0JBQUEsVUFBQSxhQUFBO1lBQ0EsT0FBQTtnQkFDQSxXQUFBOzs7Ozs7OztnQkFRQSxTQUFBLFNBQUEsUUFBQTtvQkFDQSxTQUFBLEtBQUEsWUFBQTs7b0JBRUEsT0FBQSxZQUFBLElBQUEsS0FBQSxVQUFBLFNBQUEsVUFBQSxJQUFBLFVBQUE7Ozs7Ozs7OztnQkFTQSxhQUFBLFNBQUEsUUFBQTtvQkFDQSxJQUFBLFFBQUE7d0JBQ0EsUUFBQSxRQUFBLENBQUEsUUFBQSxVQUFBLFVBQUEsU0FBQSxTQUFBLE9BQUE7NEJBQ0EsSUFBQSxLQUFBLGVBQUEsUUFBQTtnQ0FDQSxLQUFBLFNBQUEsS0FBQSxVQUFBLEtBQUE7OzJCQUVBOzs7b0JBR0EsT0FBQTs7Ozs7Ozs7O2dCQVNBLEtBQUEsU0FBQSxJQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBOzs7Ozs7Ozs7Z0JBU0EsUUFBQSxTQUFBLFFBQUE7b0JBQ0EsT0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Z0JBVUEsUUFBQSxTQUFBLElBQUEsUUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxLQUFBLFNBQUEsSUFBQSxVQUFBLFVBQUE7Ozs7Ozs7Ozs7Z0JBVUEsTUFBQSxTQUFBLFFBQUEsSUFBQTtvQkFDQSxJQUFBLElBQUE7d0JBQ0EsT0FBQSxLQUFBLE9BQUEsSUFBQTsyQkFDQTt3QkFDQSxPQUFBLEtBQUEsT0FBQTs7Ozs7Ozs7OztnQkFVQSxRQUFBLFNBQUEsSUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxLQUFBLFNBQUEsSUFBQTs7Ozs7O0FDNUZBLENBQUEsV0FBQTtJQUNBOzs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLHNCQUFBOzs7SUFHQSxTQUFBLG1CQUFBLElBQUEsU0FBQTtRQUNBLE9BQUE7WUFDQSxlQUFBLFNBQUEsV0FBQTtnQkFDQSxJQUFBLFVBQUEsS0FBQSxlQUFBLFFBQUE7b0JBQ0EsUUFBQSxJQUFBLFNBQUEscUJBQUEsVUFBQSxLQUFBOztnQkFFQSxPQUFBLEdBQUEsT0FBQTs7Ozs7S0FLQSIsImZpbGUiOiJzZXJ2aWNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5wcm92aWRlcignZW52U2VydmljZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSAnZGV2ZWxvcG1lbnQnO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGNvbmZpZztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc2V0ID0gZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvbm1lbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnJlYWQgPSBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFyaWFibGUgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFyc1t0aGlzLmdldCgpXVt2YXJpYWJsZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YXJzW3RoaXMuZ2V0KCldO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5pcyA9IGZ1bmN0aW9uIChlbnZpcm9ubWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZW52aXJvbm1lbnQgPT09IHRoaXMuZW52aXJvbm1lbnQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jaGVjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGhpcy5kYXRhLmRvbWFpbnMsIGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2LCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLm1hdGNoKCcvLycgKyB2KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZW52aXJvbm1lbnQgPSBrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH07XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnNlcnZpY2UoJ0ZpbHRlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkdGltZW91dCwgJGxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgdmFyIHZtLCBuYW1lLCBvcGVyYXRvcnM7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24obmFtZSwgdm0sIG9wZXJhdG9ycykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUgICAgICA9IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0gICAgICAgID0gdm07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlcmF0b3JzID0gb3BlcmF0b3JzO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5maWx0ZXIpICRsb2NhbFN0b3JhZ2UuZmlsdGVyID0ge307XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCRsb2NhbFN0b3JhZ2UuZmlsdGVyLmhhc093blByb3BlcnR5KHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0uZmlsdGVyID0gJGxvY2FsU3RvcmFnZS5maWx0ZXJbdGhpcy5uYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbml0aWFsaXppbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2bS5maWx0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxpemluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkgeyBpbml0aWFsaXppbmcgPSBmYWxzZTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLnZtLmZpbHRlciwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZtLmZpbHRlcltrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2FsU3RvcmFnZS5maWx0ZXJbdGhpcy5uYW1lXSA9IGFuZ3VsYXIuZXh0ZW5kKCRsb2NhbFN0b3JhZ2UuZmlsdGVyW3RoaXMubmFtZV0gfHwge30sIHRoaXMudm0uZmlsdGVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZtLmhhc093blByb3BlcnR5KCd0YWJsZUhlYWRlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0udGFibGVIZWFkZXIucGFnaW5hdGlvbi5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcGFyc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlZEZpbHRlciA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLnZtLmZpbHRlciwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9wID0gdGhpcy5vcGVyYXRvcnNba2V5XSB8fCAnPSc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkRmlsdGVyLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2x1bW4nOiAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb3BlcmF0b3InOiBvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiAgICB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlZEZpbHRlcjtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZtLmZpbHRlciA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAkbG9jYWxTdG9yYWdlLmZpbHRlclt0aGlzLm5hbWVdID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnUmVzdCcsIGZ1bmN0aW9uIChSZXN0YW5ndWxhcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBiYXNlVXJsOiAgICcnLFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSB1bWEgbGlzdGEgZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zICBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldExpc3Q6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCh0aGlzLmJhc2VVcmwgKyAnL2xpc3QnKS5jdXN0b21HRVQoXCJcIiwgcGFyYW1zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICB9LCBcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJldG9ybmEgb3MgcGFyw6JtZXRyb3MgbWFuaXB1bGFkb3NcbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBwYXJzZVBhcmFtczogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChbJ2pvaW4nLCAnZmlsdGVyJywgJ2ZpZWxkcycsICd3aXRoJ10sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbdmFsdWVdID0gSlNPTi5zdHJpbmdpZnkodGhpc1t2YWx1ZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBCdXNjYSB1bSByZWdpc3RybyBkZSByZWN1cnNvXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7aW50fSAgICBpZCBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSh0aGlzLmJhc2VVcmwsIGlkKS5nZXQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQ3JpYSB1bSBub3ZvIHJlZ2lzdHJvIGRvIHJlY3Vyc29cbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCh0aGlzLmJhc2VVcmwpLnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQXR1YWxpemEgdW0gcmVnaXN0cm8gZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgaWQgICAgIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihpZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUodGhpcy5iYXNlVXJsLCBpZCkuY3VzdG9tUFVUKHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEF0dWFsaXphIG91IGNyaWEgdW0gcmVnaXN0cm8gZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gaWQgICAgIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKHBhcmFtcywgaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGUoaWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBEZWxldGEgdW0gcmVnaXN0cm8gZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgaWQgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBkZWxldGU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUodGhpcy5iYXNlVXJsLCBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZmFjdG9yeSgnVG9hc3RlckludGVyY2VwdG9yJywgVG9hc3RlckludGVyY2VwdG9yKTtcblxuXG4gICAgZnVuY3Rpb24gVG9hc3RlckludGVyY2VwdG9yKCRxLCB0b2FzdGVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVqZWN0aW9uLmRhdGEuaGFzT3duUHJvcGVydHkoJ21zZycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiSG91dmUgdW0gcHJvYmxlbWFcIiwgcmVqZWN0aW9uLmRhdGEubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
