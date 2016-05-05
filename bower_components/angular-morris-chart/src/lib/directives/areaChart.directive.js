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