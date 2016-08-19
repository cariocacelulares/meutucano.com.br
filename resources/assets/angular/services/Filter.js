(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Filter', function ($rootScope, $timeout, $localStorage) {
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
    });
})();
