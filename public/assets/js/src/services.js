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
                                this.vm.tableHeader.reset();
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
                    if (params) {
                        angular.forEach(['join', 'filter', 'fields'], function(value) {
                            if (this.hasOwnProperty(value)) {
                                this[value] = JSON.stringify(this[value]);
                            }
                        }, params);
                    }

                    return Restangular.all(this.baseUrl).customGET("", params || {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudmlyb25tZW50LmpzIiwiRmlsdGVyLmpzIiwiUmVzdC5qcyIsIlRvYXN0ZXJJbnRlcmNlcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxTQUFBLGNBQUEsWUFBQTtZQUNBLEtBQUEsY0FBQTtZQUNBLEtBQUEsT0FBQTs7WUFFQSxLQUFBLFNBQUEsVUFBQSxRQUFBO2dCQUNBLEtBQUEsT0FBQTs7O1lBR0EsS0FBQSxNQUFBLFVBQUEsYUFBQTtnQkFDQSxLQUFBLGNBQUE7OztZQUdBLEtBQUEsTUFBQSxZQUFBO2dCQUNBLE9BQUEsS0FBQTs7O1lBR0EsS0FBQSxPQUFBLFVBQUEsVUFBQTtnQkFDQSxJQUFBLGFBQUEsT0FBQTtvQkFDQSxPQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTs7O2dCQUdBLE9BQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTs7O1lBR0EsS0FBQSxLQUFBLFVBQUEsYUFBQTtnQkFDQSxRQUFBLGdCQUFBLEtBQUE7OztZQUdBLEtBQUEsUUFBQSxZQUFBO2dCQUNBLElBQUEsV0FBQSxPQUFBLFNBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxTQUFBLFVBQUEsR0FBQSxHQUFBO29CQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsR0FBQTt3QkFDQSxJQUFBLFNBQUEsTUFBQSxPQUFBLElBQUE7NEJBQ0EsS0FBQSxjQUFBOzs7Ozs7WUFNQSxLQUFBLE9BQUEsWUFBQTtnQkFDQSxPQUFBOzs7OztBQy9DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLHNEQUFBLFVBQUEsWUFBQSxVQUFBLGVBQUE7WUFDQSxJQUFBLElBQUEsTUFBQTs7WUFFQSxPQUFBO2dCQUNBLE1BQUEsU0FBQSxNQUFBLElBQUEsV0FBQTtvQkFDQSxLQUFBLFlBQUE7b0JBQ0EsS0FBQSxZQUFBO29CQUNBLEtBQUEsWUFBQTs7b0JBRUEsSUFBQSxDQUFBLGNBQUEsUUFBQSxjQUFBLFNBQUE7O29CQUVBLElBQUEsY0FBQSxPQUFBLGVBQUEsS0FBQSxPQUFBO3dCQUNBLEtBQUEsR0FBQSxTQUFBLGNBQUEsT0FBQSxLQUFBOzs7b0JBR0EsSUFBQSxlQUFBO29CQUNBLFdBQUEsT0FBQSxXQUFBO3dCQUNBLE9BQUEsR0FBQTt1QkFDQSxXQUFBO3dCQUNBLElBQUEsY0FBQTs0QkFDQSxTQUFBLFdBQUEsRUFBQSxlQUFBOytCQUNBOzRCQUNBLFFBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsS0FBQTtnQ0FDQSxJQUFBLE1BQUEsV0FBQTtvQ0FDQSxPQUFBLEtBQUEsR0FBQSxPQUFBOytCQUNBOzs0QkFFQSxjQUFBLE9BQUEsS0FBQSxRQUFBLFFBQUEsT0FBQSxjQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxHQUFBOzs0QkFFQSxJQUFBLEtBQUEsR0FBQSxlQUFBLGdCQUFBO2dDQUNBLEtBQUEsR0FBQSxZQUFBOzs7NEJBR0EsS0FBQSxHQUFBOztzQkFFQSxLQUFBLE9BQUE7O29CQUVBLE9BQUE7OztnQkFHQSxPQUFBLFdBQUE7b0JBQ0EsS0FBQSxlQUFBOztvQkFFQSxRQUFBLFFBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7d0JBQ0EsSUFBQSxLQUFBLEtBQUEsVUFBQSxRQUFBOzt3QkFFQSxLQUFBLGFBQUEsS0FBQTs0QkFDQSxZQUFBOzRCQUNBLFlBQUE7NEJBQ0EsWUFBQTs7dUJBRUE7O29CQUVBLE9BQUEsS0FBQTs7O2dCQUdBLE9BQUEsV0FBQTtvQkFDQSxLQUFBLEdBQUEsU0FBQTtvQkFDQSxjQUFBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7QUMvREEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSx3QkFBQSxVQUFBLGFBQUE7WUFDQSxPQUFBO2dCQUNBLFdBQUE7Ozs7Ozs7O2dCQVFBLFNBQUEsU0FBQSxRQUFBO29CQUNBLElBQUEsUUFBQTt3QkFDQSxRQUFBLFFBQUEsQ0FBQSxRQUFBLFVBQUEsV0FBQSxTQUFBLE9BQUE7NEJBQ0EsSUFBQSxLQUFBLGVBQUEsUUFBQTtnQ0FDQSxLQUFBLFNBQUEsS0FBQSxVQUFBLEtBQUE7OzJCQUVBOzs7b0JBR0EsT0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBLFVBQUEsSUFBQSxVQUFBOzs7Ozs7Ozs7Z0JBU0EsS0FBQSxTQUFBLElBQUE7b0JBQ0EsT0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBLElBQUE7Ozs7Ozs7OztnQkFTQSxRQUFBLFNBQUEsUUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7OztnQkFVQSxRQUFBLFNBQUEsSUFBQSxRQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBLFVBQUEsVUFBQTs7Ozs7Ozs7OztnQkFVQSxNQUFBLFNBQUEsUUFBQSxJQUFBO29CQUNBLElBQUEsSUFBQTt3QkFDQSxPQUFBLEtBQUEsT0FBQSxJQUFBOzJCQUNBO3dCQUNBLE9BQUEsS0FBQSxPQUFBOzs7Ozs7Ozs7O2dCQVVBLFFBQUEsU0FBQSxJQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBOzs7Ozs7QUNoRkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsc0JBQUE7OztJQUdBLFNBQUEsbUJBQUEsSUFBQSxTQUFBO1FBQ0EsT0FBQTtZQUNBLGVBQUEsU0FBQSxXQUFBO2dCQUNBLElBQUEsVUFBQSxLQUFBLGVBQUEsUUFBQTtvQkFDQSxRQUFBLElBQUEsU0FBQSxxQkFBQSxVQUFBLEtBQUE7O2dCQUVBLE9BQUEsR0FBQSxPQUFBOzs7OztLQUtBIiwiZmlsZSI6InNlcnZpY2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnByb3ZpZGVyKCdlbnZTZXJ2aWNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9ICdkZXZlbG9wbWVudCc7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gY29uZmlnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zZXQgPSBmdW5jdGlvbiAoZW52aXJvbm1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMucmVhZCA9IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZSAhPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YXJzW3RoaXMuZ2V0KCldW3ZhcmlhYmxlXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhcnNbdGhpcy5nZXQoKV07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmlzID0gZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChlbnZpcm9ubWVudCA9PT0gdGhpcy5lbnZpcm9ubWVudCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNoZWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLmRhdGEuZG9tYWlucywgZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHYsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24ubWF0Y2goJy8vJyArIHYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbnZpcm9ubWVudCA9IGs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnRmlsdGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICR0aW1lb3V0LCAkbG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICB2YXIgdm0sIG5hbWUsIG9wZXJhdG9ycztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbihuYW1lLCB2bSwgb3BlcmF0b3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSAgICAgID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bSAgICAgICAgPSB2bTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVyYXRvcnMgPSBvcGVyYXRvcnM7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkbG9jYWxTdG9yYWdlLmZpbHRlcikgJGxvY2FsU3RvcmFnZS5maWx0ZXIgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJGxvY2FsU3RvcmFnZS5maWx0ZXIuaGFzT3duUHJvcGVydHkodGhpcy5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5maWx0ZXIgPSAkbG9jYWxTdG9yYWdlLmZpbHRlclt0aGlzLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRpYWxpemluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLmZpbHRlcjtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbGl6aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7IGluaXRpYWxpemluZyA9IGZhbHNlOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoaXMudm0uZmlsdGVyLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudm0uZmlsdGVyW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxTdG9yYWdlLmZpbHRlclt0aGlzLm5hbWVdID0gYW5ndWxhci5leHRlbmQoJGxvY2FsU3RvcmFnZS5maWx0ZXJbdGhpcy5uYW1lXSB8fCB7fSwgdGhpcy52bS5maWx0ZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudm0uaGFzT3duUHJvcGVydHkoJ3RhYmxlSGVhZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52bS50YWJsZUhlYWRlci5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkRmlsdGVyID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoaXMudm0uZmlsdGVyLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3AgPSB0aGlzLm9wZXJhdG9yc1trZXldIHx8ICc9JztcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZWRGaWx0ZXIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbHVtbic6ICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcGVyYXRvcic6IG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6ICAgIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkRmlsdGVyO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0uZmlsdGVyID0ge307XG4gICAgICAgICAgICAgICAgICAgICRsb2NhbFN0b3JhZ2UuZmlsdGVyW3RoaXMubmFtZV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdSZXN0JywgZnVuY3Rpb24gKFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGJhc2VVcmw6ICAgJycsXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBSZXRvcm5hIHVtYSBsaXN0YSBkbyByZWN1cnNvXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXl9ICAgICAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXRMaXN0OiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKFsnam9pbicsICdmaWx0ZXInLCAnZmllbGRzJ10sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbdmFsdWVdID0gSlNPTi5zdHJpbmdpZnkodGhpc1t2YWx1ZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIuYWxsKHRoaXMuYmFzZVVybCkuY3VzdG9tR0VUKFwiXCIsIHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSwgXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBCdXNjYSB1bSByZWdpc3RybyBkZSByZWN1cnNvXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7aW50fSAgICBpZCBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLm9uZSh0aGlzLmJhc2VVcmwsIGlkKS5nZXQoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQ3JpYSB1bSBub3ZvIHJlZ2lzdHJvIGRvIHJlY3Vyc29cbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCh0aGlzLmJhc2VVcmwpLnBvc3QocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQXR1YWxpemEgdW0gcmVnaXN0cm8gZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgaWQgICAgIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihpZCwgcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUodGhpcy5iYXNlVXJsLCBpZCkuY3VzdG9tUFVUKHBhcmFtcyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEF0dWFsaXphIG91IGNyaWEgdW0gcmVnaXN0cm8gZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gaWQgICAgIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKHBhcmFtcywgaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGUoaWQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBEZWxldGEgdW0gcmVnaXN0cm8gZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgaWQgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBkZWxldGU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUodGhpcy5iYXNlVXJsLCBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuZmFjdG9yeSgnVG9hc3RlckludGVyY2VwdG9yJywgVG9hc3RlckludGVyY2VwdG9yKTtcblxuXG4gICAgZnVuY3Rpb24gVG9hc3RlckludGVyY2VwdG9yKCRxLCB0b2FzdGVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZWplY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVqZWN0aW9uLmRhdGEuaGFzT3duUHJvcGVydHkoJ21zZycpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdlcnJvcicsIFwiSG91dmUgdW0gcHJvYmxlbWFcIiwgcmVqZWN0aW9uLmRhdGEubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
