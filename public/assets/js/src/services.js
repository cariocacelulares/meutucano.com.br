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
                baseUrl: '',

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudmlyb25tZW50LmpzIiwiRmlsdGVyLmpzIiwiUmVzdC5qcyIsIlRvYXN0ZXJJbnRlcmNlcHRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxTQUFBLGNBQUEsWUFBQTtZQUNBLEtBQUEsY0FBQTtZQUNBLEtBQUEsT0FBQTs7WUFFQSxLQUFBLFNBQUEsVUFBQSxRQUFBO2dCQUNBLEtBQUEsT0FBQTs7O1lBR0EsS0FBQSxNQUFBLFVBQUEsYUFBQTtnQkFDQSxLQUFBLGNBQUE7OztZQUdBLEtBQUEsTUFBQSxZQUFBO2dCQUNBLE9BQUEsS0FBQTs7O1lBR0EsS0FBQSxPQUFBLFVBQUEsVUFBQTtnQkFDQSxJQUFBLGFBQUEsT0FBQTtvQkFDQSxPQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsT0FBQTs7O2dCQUdBLE9BQUEsS0FBQSxLQUFBLEtBQUEsS0FBQTs7O1lBR0EsS0FBQSxLQUFBLFVBQUEsYUFBQTtnQkFDQSxRQUFBLGdCQUFBLEtBQUE7OztZQUdBLEtBQUEsUUFBQSxZQUFBO2dCQUNBLElBQUEsV0FBQSxPQUFBLFNBQUE7b0JBQ0EsT0FBQTs7Z0JBRUEsUUFBQSxRQUFBLEtBQUEsS0FBQSxTQUFBLFVBQUEsR0FBQSxHQUFBO29CQUNBLFFBQUEsUUFBQSxHQUFBLFVBQUEsR0FBQTt3QkFDQSxJQUFBLFNBQUEsTUFBQSxPQUFBLElBQUE7NEJBQ0EsS0FBQSxjQUFBOzs7Ozs7WUFNQSxLQUFBLE9BQUEsWUFBQTtnQkFDQSxPQUFBOzs7OztBQy9DQSxDQUFBLFdBQUE7SUFDQTs7SUFFQTtTQUNBLE9BQUE7U0FDQSxRQUFBLHNEQUFBLFVBQUEsWUFBQSxVQUFBLGVBQUE7WUFDQSxJQUFBLElBQUEsTUFBQTs7WUFFQSxPQUFBO2dCQUNBLE1BQUEsU0FBQSxNQUFBLElBQUEsV0FBQTtvQkFDQSxLQUFBLFlBQUE7b0JBQ0EsS0FBQSxZQUFBO29CQUNBLEtBQUEsWUFBQTs7b0JBRUEsSUFBQSxDQUFBLGNBQUEsUUFBQSxjQUFBLFNBQUE7O29CQUVBLElBQUEsY0FBQSxPQUFBLGVBQUEsS0FBQSxPQUFBO3dCQUNBLEtBQUEsR0FBQSxTQUFBLGNBQUEsT0FBQSxLQUFBOzs7b0JBR0EsSUFBQSxlQUFBO29CQUNBLFdBQUEsT0FBQSxXQUFBO3dCQUNBLE9BQUEsR0FBQTt1QkFDQSxXQUFBO3dCQUNBLElBQUEsY0FBQTs0QkFDQSxTQUFBLFdBQUEsRUFBQSxlQUFBOytCQUNBOzRCQUNBLFFBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxTQUFBLE9BQUEsS0FBQTtnQ0FDQSxJQUFBLE1BQUEsV0FBQTtvQ0FDQSxPQUFBLEtBQUEsR0FBQSxPQUFBOytCQUNBOzs0QkFFQSxjQUFBLE9BQUEsS0FBQSxRQUFBLFFBQUEsT0FBQSxjQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxHQUFBOzs0QkFFQSxJQUFBLEtBQUEsR0FBQSxlQUFBLGdCQUFBO2dDQUNBLEtBQUEsR0FBQSxZQUFBOzs7NEJBR0EsS0FBQSxHQUFBOztzQkFFQSxLQUFBLE9BQUE7O29CQUVBLE9BQUE7OztnQkFHQSxPQUFBLFdBQUE7b0JBQ0EsS0FBQSxlQUFBOztvQkFFQSxRQUFBLFFBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxPQUFBLEtBQUE7d0JBQ0EsSUFBQSxLQUFBLEtBQUEsVUFBQSxRQUFBOzt3QkFFQSxLQUFBLGFBQUEsS0FBQTs0QkFDQSxZQUFBOzRCQUNBLFlBQUE7NEJBQ0EsWUFBQTs7dUJBRUE7O29CQUVBLE9BQUEsS0FBQTs7O2dCQUdBLE9BQUEsV0FBQTtvQkFDQSxLQUFBLEdBQUEsU0FBQTtvQkFDQSxjQUFBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7QUMvREEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSx3QkFBQSxVQUFBLGFBQUE7WUFDQSxPQUFBO2dCQUNBLFNBQUE7Ozs7Ozs7O2dCQVFBLFNBQUEsU0FBQSxRQUFBO29CQUNBLElBQUEsUUFBQTt3QkFDQSxRQUFBLFFBQUEsQ0FBQSxRQUFBLFVBQUEsV0FBQSxTQUFBLE9BQUE7NEJBQ0EsSUFBQSxLQUFBLGVBQUEsUUFBQTtnQ0FDQSxLQUFBLFNBQUEsS0FBQSxVQUFBLEtBQUE7OzJCQUVBOzs7b0JBR0EsT0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBLFVBQUEsSUFBQSxVQUFBOzs7Ozs7Ozs7Z0JBU0EsS0FBQSxTQUFBLElBQUE7b0JBQ0EsT0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBLElBQUE7Ozs7Ozs7OztnQkFTQSxRQUFBLFNBQUEsUUFBQTtvQkFDQSxPQUFBLFlBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7OztnQkFVQSxRQUFBLFNBQUEsSUFBQSxRQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBLFVBQUEsVUFBQTs7Ozs7Ozs7OztnQkFVQSxNQUFBLFNBQUEsUUFBQSxJQUFBO29CQUNBLElBQUEsSUFBQTt3QkFDQSxPQUFBLEtBQUEsT0FBQSxJQUFBOzJCQUNBO3dCQUNBLE9BQUEsS0FBQSxPQUFBOzs7Ozs7Ozs7O2dCQVVBLFFBQUEsU0FBQSxJQUFBO29CQUNBLE9BQUEsWUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBOzs7Ozs7QUNoRkEsQ0FBQSxXQUFBO0lBQ0E7OztJQUVBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsc0JBQUE7OztJQUdBLFNBQUEsbUJBQUEsSUFBQSxTQUFBO1FBQ0EsT0FBQTtZQUNBLGVBQUEsU0FBQSxXQUFBO2dCQUNBLElBQUEsVUFBQSxLQUFBLGVBQUEsUUFBQTtvQkFDQSxRQUFBLElBQUEsU0FBQSxxQkFBQSxVQUFBLEtBQUE7O2dCQUVBLE9BQUEsR0FBQSxPQUFBOzs7OztLQUtBIiwiZmlsZSI6InNlcnZpY2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLnByb3ZpZGVyKCdlbnZTZXJ2aWNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudCA9ICdkZXZlbG9wbWVudCc7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gY29uZmlnO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zZXQgPSBmdW5jdGlvbiAoZW52aXJvbm1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMucmVhZCA9IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZSAhPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YXJzW3RoaXMuZ2V0KCldW3ZhcmlhYmxlXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhcnNbdGhpcy5nZXQoKV07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmlzID0gZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChlbnZpcm9ubWVudCA9PT0gdGhpcy5lbnZpcm9ubWVudCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNoZWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzLmRhdGEuZG9tYWlucywgZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHYsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24ubWF0Y2goJy8vJyArIHYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbnZpcm9ubWVudCA9IGs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfTtcbiAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKVxuICAgICAgICAuc2VydmljZSgnRmlsdGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICR0aW1lb3V0LCAkbG9jYWxTdG9yYWdlKSB7XG4gICAgICAgICAgICB2YXIgdm0sIG5hbWUsIG9wZXJhdG9ycztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbihuYW1lLCB2bSwgb3BlcmF0b3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSAgICAgID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bSAgICAgICAgPSB2bTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVyYXRvcnMgPSBvcGVyYXRvcnM7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkbG9jYWxTdG9yYWdlLmZpbHRlcikgJGxvY2FsU3RvcmFnZS5maWx0ZXIgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJGxvY2FsU3RvcmFnZS5maWx0ZXIuaGFzT3duUHJvcGVydHkodGhpcy5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5maWx0ZXIgPSAkbG9jYWxTdG9yYWdlLmZpbHRlclt0aGlzLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRpYWxpemluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZtLmZpbHRlcjtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbGl6aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7IGluaXRpYWxpemluZyA9IGZhbHNlOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoaXMudm0uZmlsdGVyLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudm0uZmlsdGVyW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxTdG9yYWdlLmZpbHRlclt0aGlzLm5hbWVdID0gYW5ndWxhci5leHRlbmQoJGxvY2FsU3RvcmFnZS5maWx0ZXJbdGhpcy5uYW1lXSB8fCB7fSwgdGhpcy52bS5maWx0ZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudm0uaGFzT3duUHJvcGVydHkoJ3RhYmxlSGVhZGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52bS50YWJsZUhlYWRlci5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwYXJzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkRmlsdGVyID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoaXMudm0uZmlsdGVyLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3AgPSB0aGlzLm9wZXJhdG9yc1trZXldIHx8ICc9JztcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZWRGaWx0ZXIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbHVtbic6ICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcGVyYXRvcic6IG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6ICAgIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VkRmlsdGVyO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0uZmlsdGVyID0ge307XG4gICAgICAgICAgICAgICAgICAgICRsb2NhbFN0b3JhZ2UuZmlsdGVyW3RoaXMubmFtZV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ01ldVR1Y2FubycpXG4gICAgICAgIC5zZXJ2aWNlKCdSZXN0JywgZnVuY3Rpb24gKFJlc3Rhbmd1bGFyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGJhc2VVcmw6ICcnLFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmV0b3JuYSB1bWEgbGlzdGEgZG8gcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge0FycmF5fSAgICAgICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZ2V0TGlzdDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChbJ2pvaW4nLCAnZmlsdGVyJywgJ2ZpZWxkcyddLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3ZhbHVlXSA9IEpTT04uc3RyaW5naWZ5KHRoaXNbdmFsdWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlc3Rhbmd1bGFyLmFsbCh0aGlzLmJhc2VVcmwpLmN1c3RvbUdFVChcIlwiLCBwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH0sIFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQnVzY2EgdW0gcmVnaXN0cm8gZGUgcmVjdXJzb1xuICAgICAgICAgICAgICAgICAqIFxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge2ludH0gICAgaWQgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5vbmUodGhpcy5iYXNlVXJsLCBpZCkuZ2V0KCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIENyaWEgdW0gbm92byByZWdpc3RybyBkbyByZWN1cnNvXG4gICAgICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZXN0YW5ndWxhci5hbGwodGhpcy5iYXNlVXJsKS5wb3N0KHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEF0dWFsaXphIHVtIHJlZ2lzdHJvIGRvIHJlY3Vyc29cbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtpbnR9ICAgIGlkICAgICBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oaWQsIHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHRoaXMuYmFzZVVybCwgaWQpLmN1c3RvbVBVVChwYXJhbXMgfHwge30pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBBdHVhbGl6YSBvdSBjcmlhIHVtIHJlZ2lzdHJvIGRvIHJlY3Vyc29cbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHBhcmFtcyBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtpbnR9IGlkICAgICBcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBzYXZlOiBmdW5jdGlvbihwYXJhbXMsIGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlKGlkLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRGVsZXRhIHVtIHJlZ2lzdHJvIGRvIHJlY3Vyc29cbiAgICAgICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtpbnR9ICAgIGlkIFxuICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGVsZXRlOiBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzdGFuZ3VsYXIub25lKHRoaXMuYmFzZVVybCwgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmZhY3RvcnkoJ1RvYXN0ZXJJbnRlcmNlcHRvcicsIFRvYXN0ZXJJbnRlcmNlcHRvcik7XG5cblxuICAgIGZ1bmN0aW9uIFRvYXN0ZXJJbnRlcmNlcHRvcigkcSwgdG9hc3Rlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlamVjdGlvbi5kYXRhLmhhc093blByb3BlcnR5KCdtc2cnKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnZXJyb3InLCBcIkhvdXZlIHVtIHByb2JsZW1hXCIsIHJlamVjdGlvbi5kYXRhLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
