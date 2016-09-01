(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('TabsHelper', function() {
            var vm = this;
            vm.tabs = [];
            vm.tab = null;

            return {
                get: function() {
                    return vm.tabs;
                },
                set: function(tab) {
                    var tabs = this.get();

                    for (var i in tabs) {
                        if (tabs[i].name === tab || tabs[i].name === tab.name) {
                            vm.tab = tabs[i];
                            break;
                        }
                    }
                },
                is: function(tab) {
                    return vm.tab.name === tab.name || vm.tab.name === tab;
                },
                register: function(tab) {
                    vm.tabs.push(tab);

                    if (!vm.tab)
                        vm.tab = tab;
                }
            };
        })

        .directive('tabs', function(TabsHelper) {
            return {
                scope: {},
                transclude: true,
                replace: true,
                restrict: 'E',
                templateUrl: 'views/components/tabs.html',
                controller: function() {
                    this.get = function() {
                        return TabsHelper.get();
                    };

                    this.set = function(tab) {
                        TabsHelper.set(tab);
                    };

                    this.is = function(tab) {
                        return TabsHelper.is(tab);
                    };
                },
                controllerAs: 'Tabs'
            };
        })

        .directive('tab', function(TabsHelper) {
            return {
                restrict: 'E',
                scope: {
                    name: '@',
                    title: '@'
                },
                require: '^tabs',
                template: '<div class="tab-item" ng-class="{ \'active\': Tab.is() }" ng-transclude></div>',
                replace: true,
                transclude: true,
                controller: function($scope) {
                    this.tab = { name: $scope.name, title: $scope.title };
                    TabsHelper.register(this.tab);

                    this.is = function(tab) {
                        return TabsHelper.is(this.tab);
                    };
                },
                controllerAs: 'Tab'
            };
        });
})();