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
'use strict';
/* global Morris, jasmine, spyOn */
describe('Component <barChart> directive', function() {
    var $compile,
        scope,
        $rootScope,
        element,
        data,
        xkey,
        ykeys,
        labels,
        colors,
        stacked,
        resize;
    beforeEach(module('angular.morris-chart'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();
        data = '[{ "y": "2006", "a": 100, "b": 90 }]';
        xkey = 'y';
        ykeys = '["a", "b"]';
        labels = '["Serie A", "Serie B"]';
        colors = '["#515fb4","#7580c3","#98a0d3"]';
        stacked = false;
        resize = false;
        spyOn(Morris, 'Bar');
        element = $compile("<div bar-chart bar-data='" + data + "' bar-x='" + xkey + "' bar-y='" + ykeys + "' bar-labels='" + labels + "' bar-colors='" + colors + "' bar-stacked='" + stacked + "' bar-resize='" + resize + "'></div>")(scope);
        $rootScope.$digest();
    }));

    it('Needs to map Morris correctly', function() {
        expect(Morris.Bar).toHaveBeenCalledWith({
            element: jasmine.any(Object),
            data: JSON.parse(data),
            xkey: xkey,
            ykeys: JSON.parse(ykeys),
            labels: JSON.parse(labels),
            barColors: JSON.parse(colors),
            stacked: JSON.parse(stacked),
            resize: JSON.parse(resize),
            xLabelMargin: 2
        });
    });
});