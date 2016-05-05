/**
 * angular-morris-chart provides morris.js directives for angular 1.x
 * 
 * Software licensed under MIT, maintained by @stewones. Feel free to open an issue or make a PR.
 * Check out documentation and full list of contributors in http://angular-morris-chart.stpa.co
 *
 * Copyright © 2014 Stewan Pacheco <talk@stpa.co>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";
(function() {
    angular.module('angular.morris-chart', [])
        // Utility functions
        .factory('morrisChartService', /*@ngInject*/function($injector) {
            var s = {
                /**
                 * Takes a morris.js option key and converts it to an attribute name.
                 * @param prefix {string}
                 * @param key {string}
                 * @returns {string}
                 */
                keyToAttr: function(prefix, key) {
                    return prefix + key.substring(0, 1).toUpperCase() + key.substring(1);
                },

                /**
                 * Populates a directive scope definition object from a given set of option keys
                 * @param scopeDefinition {object}
                 * @param prefix {string}
                 * @param optionKeys {string[]}
                 * @param [atKey] {string}
                 * @returns {object}
                 */
                populateScopeDefinition: function(scopeDefinition, prefix, optionKeys, atKey) {
                    angular.forEach(optionKeys, function(key) {
                        // Prefix the option key
                        scopeDefinition[s.keyToAttr(prefix, key)] = key === atKey ? '@' : '=';
                    });
                    return scopeDefinition;
                },

                /**
                 * Populates an options object for a Morris chart using a set of option keys and a scope object.
                 * @param options {object}
                 * @param optionKeys {string[]}
                 * @param prefix {string}
                 * @param scope {object}
                 * @returns {object}
                 */
                populateOptions: function(options, optionKeys, prefix, scope) {
                    // Apply known optons from morris.js doco
                    angular.forEach(optionKeys, function(key) {
                        var attrKey = s.keyToAttr(prefix, key);
                        if (scope.hasOwnProperty(attrKey) && typeof scope[attrKey] !== 'undefined') {
                            options[key] = scope[attrKey];
                        }
                    });
                    return options;
                },

                /**
                 * Tries to apply certain options as names for angular filters
                 * @param filterKeys {string[]}
                 * @param options {object}
                 */
                processFilterOptions: function(filterKeys, options) {
                    angular.forEach(filterKeys, function(key) {
                        // If the formatter is a string, check for a matching filter
                        if (typeof options[key] === 'string' && $injector.has(options[key] + 'Filter')) {
                            var filter = $injector.get(options[key] + 'Filter');
                            options[key] = function (input) {
                                return filter.call(this, input);
                            };
                        }
                    });
                }
            };
            return s;
        });
})();
/**
 * angular-morris-chart provides morris.js directives for angular 1.x
 * 
 * Software licensed under MIT, maintained by @stewones. Feel free to open an issue or make a PR.
 * Check out documentation and full list of contributors in http://angular-morris-chart.stpa.co
 *
 * Copyright © 2014 Stewan Pacheco <talk@stpa.co>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";
/* global Morris */
(function() {
    angular.module("angular.morris-chart").directive('areaChart',
        /*@ngInject*/function(morrisChartService) {
            // List of known option keys for areaChart according to morris.js docs:
            // http://morrisjs.github.io/morris.js/lines.html
            var OPTION_KEYS = [
                'data', 'xkey', 'ykeys', 'labels', 'lineColors', 'lineWidth', 'pointSize',
                'pointFillColors', 'pointStrokeColors', 'ymax', 'ymin', 'smooth', 'hideHover',
                'hoverCallback', 'parseTime', 'units', 'postUnits', 'preUnits', 'dateFormat',
                'xLabels', 'xLabelFormat', 'xLabelAngle', 'yLabelFormat', 'goals', 'goalStrokeWidth',
                'goalLineColors', 'events', 'eventStrokeWidth', 'eventLineColors', 'continuousLine',
                'axes', 'grid', 'gridTextColor', 'gridTextSize', 'gridTextFamily', 'gridTextWeight',
                'fillOpacity', 'resize', 'behaveLikeLine'
            ];

            return {
                restrict: 'A',
                scope: morrisChartService.populateScopeDefinition({lineColors: '='}, 'area', OPTION_KEYS, 'xkey'),
                link: function(scope, elem) {
                    scope.$watch('areaData', function() {
                        if (scope.areaData) {
                            if (typeof scope.areaData === 'string')
                                scope.areaData = JSON.parse(scope.areaData);
                            if (typeof scope.areaYkeys === 'string')
                                scope.areaYkeys = JSON.parse(scope.areaYkeys);
                            if (typeof scope.areaLabels === 'string')
                                scope.areaLabels = JSON.parse(scope.areaLabels);
                            if (typeof scope.lineColors === 'string')
                                scope.lineColors = JSON.parse(scope.lineColors);

                            if (!scope.areaInstance) {
                                // Generate Morris chart options
                                var options = morrisChartService.populateOptions({
                                    element: elem,
                                    lineColors: scope.lineColors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed']
                                }, OPTION_KEYS, 'area', scope);

                                // Checks if there are angular filters available for certain options
                                morrisChartService.processFilterOptions(['dateFormat', 'xLabelFormat', 'yLabelFormat'], options);

                                scope.areaInstance = new Morris.Area(options);
                            } else {
                                scope.areaInstance.setData(scope.areaData);
                            }
                        }
                    });
                }
            }
        });
})();
/**
 * angular-morris-chart provides morris.js directives for angular 1.x
 * 
 * Software licensed under MIT, maintained by @stewones. Feel free to open an issue or make a PR.
 * Check out documentation and full list of contributors in http://angular-morris-chart.stpa.co
 *
 * Copyright © 2014 Stewan Pacheco <talk@stpa.co>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";
/* global Morris */
(function() {
    angular.module("angular.morris-chart").directive('barChart', /*@ngInject*/function(morrisChartService) {
        // List of known option keys for barChart according to morris.js docs:
        // http://morrisjs.github.io/morris.js/bars.html
        var OPTION_KEYS = [
            'data', 'xkey', 'ykeys', 'labels', 'barColors', 'stacked', 'hideHover',
            'hoverCallback', 'axes', 'grid', 'gridTextColor', 'gridTextSize', 'gridTextFamily',
            'gridTextWeight', 'resize'
        ];

        return {
            restrict: 'A',
            scope: morrisChartService.populateScopeDefinition({barColors: '=', barX: '@', barY: '='}, 'bar', OPTION_KEYS),
            link: function(scope, elem) {
                scope.$watch('barData', function() {
                    if (scope.barData) {
                        if (typeof scope.barY === 'string')
                            scope.barY = JSON.parse(scope.barY);
                        if (typeof scope.barLabels === 'string')
                            scope.barLabels = JSON.parse(scope.barLabels);
                        if (typeof scope.barData === 'string')
                            scope.barData = JSON.parse(scope.barData);
                        if (typeof scope.barColors === 'string')
                            scope.barColors = JSON.parse(scope.barColors);
                        if (typeof scope.barStacked === 'string')
                            scope.barStacked = JSON.parse(scope.barStacked);
                        if (typeof scope.barResize === 'string')
                            scope.barResize = JSON.parse(scope.barResize);


                        if (!scope.barInstance) {
                            // Default options
                            var options = morrisChartService.populateOptions({
                                element: elem,
                                barColors: scope.barColors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                                stacked: false,
                                resize: false,
                                xkey: scope.barX,
                                ykeys: scope.barY,
                                xLabelMargin: 2
                            }, OPTION_KEYS, 'bar', scope);

                            scope.barInstance = new Morris.Bar(options);
                        } else {
                            scope.barInstance.setData(scope.barData);
                        }
                    }
                })
            }
        }
    })
})();
/**
 * angular-morris-chart provides morris.js directives for angular 1.x
 * 
 * Software licensed under MIT, maintained by @stewones. Feel free to open an issue or make a PR.
 * Check out documentation and full list of contributors in http://angular-morris-chart.stpa.co
 *
 * Copyright © 2014 Stewan Pacheco <talk@stpa.co>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";
/* global Morris */
(function() {
    angular.module("angular.morris-chart").directive('donutChart', /*@ngInject*/function(morrisChartService) {
        // List of known option keys for donutChart according to morris.js docs:
        // http://morrisjs.github.io/morris.js/donuts.html
        var OPTION_KEYS = ['data', 'colors', 'formatter', 'resize'];

        return {
            restrict: 'A',
            scope: morrisChartService.populateScopeDefinition({}, 'donut', OPTION_KEYS),
            link: function(scope, elem) {
                scope.$watch('donutData', function() {
                    if (scope.donutData) {
                        if (typeof scope.donutData === 'string')
                            scope.donutData = JSON.parse(scope.donutData);

                        if (typeof scope.donutColors === 'string')
                            scope.donutColors = JSON.parse(scope.donutColors);

                        if (!scope.donutInstance) {
                            // Generate Morris chart options
                            var options = morrisChartService.populateOptions({
                                element: elem,
                                colors: ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed']
                            }, OPTION_KEYS, 'donut', scope);

                            // Checks if there are angular filters available for certain options
                            morrisChartService.processFilterOptions(['formatter'], options);

                            scope.donutInstance = new Morris.Donut(options);
                        } else {
                            scope.donutInstance.setData(scope.donutData);
                        }
                    }
                })
            }
        }
    })
})();
/**
 * angular-morris-chart provides morris.js directives for angular 1.x
 * 
 * Software licensed under MIT, maintained by @stewones. Feel free to open an issue or make a PR.
 * Check out documentation and full list of contributors in http://angular-morris-chart.stpa.co
 *
 * Copyright © 2014 Stewan Pacheco <talk@stpa.co>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";
/* global Morris */
(function() {
    angular.module("angular.morris-chart").directive('lineChart',
        /*@ngInject*/function(morrisChartService) {
            // List of known option keys for lineChart according to morris.js docs:
            // http://morrisjs.github.io/morris.js/lines.html
            var OPTION_KEYS = [
                'data', 'xkey', 'ykeys', 'labels', 'lineColors', 'lineWidth', 'pointSize',
                'pointFillColors', 'pointStrokeColors', 'ymax', 'ymin', 'smooth', 'hideHover',
                'hoverCallback', 'parseTime', 'units', 'postUnits', 'preUnits', 'dateFormat',
                'xLabels', 'xLabelFormat', 'xLabelAngle', 'yLabelFormat', 'goals', 'goalStrokeWidth',
                'goalLineColors', 'events', 'eventStrokeWidth', 'eventLineColors', 'continuousLine',
                'axes', 'grid', 'gridTextColor', 'gridTextSize', 'gridTextFamily', 'gridTextWeight',
                'fillOpacity', 'resize'
            ];

            return {
                restrict: 'A',
                scope: morrisChartService.populateScopeDefinition({lineColors: '=', parseTime: '='}, 'line', OPTION_KEYS, 'xkey'),
                link: function(scope, elem) {
                    scope.$watch('lineData', function() {
                        if (scope.lineData) {
                            if (typeof scope.lineData === 'string')
                                scope.lineData = JSON.parse(scope.lineData);
                            if (typeof scope.lineYkeys === 'string')
                                scope.lineYkeys = JSON.parse(scope.lineYkeys);
                            if (typeof scope.lineYkeys === 'string')
                                scope.lineYkeys = JSON.parse(scope.lineYkeys);
                            if (typeof scope.lineLabels === 'string')
                                scope.lineLabels = JSON.parse(scope.lineLabels);
                            if (typeof scope.lineColors === 'string')
                                scope.lineColors = JSON.parse(scope.lineColors);
                            if (typeof scope.parseTime === 'boolean')
                                scope.parseTime = JSON.parse(scope.parseTime);

                            if (!scope.lineInstance) {
                                // Default options
                                var options = morrisChartService.populateOptions({
                                    element: elem,
                                    lineColors: scope.lineColors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
                                    parseTime: scope.parseTime
                                }, OPTION_KEYS, 'line', scope);

                                // Checks if there are angular filters available for certain options
                                morrisChartService.processFilterOptions(['dateFormat', 'xLabelFormat', 'yLabelFormat'], options);

                                scope.lineInstance = new Morris.Line(options);
                            } else {
                                scope.lineInstance.options.xkey = scope.lineXkey;
                                scope.lineInstance.options.ykeys = scope.lineYkeys;
                                scope.lineInstance.options.labels = scope.lineLabels;
                                scope.lineInstance.options.parseTime = scope.parseTime;
                                scope.lineInstance.options.lineColors = scope.lineColors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'];
                                scope.lineInstance.setData(scope.lineData);
                            }
                        }
                    });
                }
            }
        }
    )
})();