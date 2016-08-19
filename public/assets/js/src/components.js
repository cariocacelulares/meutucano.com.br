(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .component('tableHeader', { 
            bindings: {
                data: '='
            },
            templateUrl: 'views/components/table-header.html'
        })
        .service('TableHeader', ["$localStorage", function($localStorage) {
            var name, vm, pagination;

            return {
                init: function(name, vm, useFilter) {
                    this.name      = name;
                    this.vm        = vm;

                    if (!$localStorage.pagination) $localStorage.pagination = {};

                    if (!$localStorage.pagination.hasOwnProperty(this.name)) {
                        $localStorage.pagination[this.name] = {
                            page:     1,
                            per_page: '20'
                        };
                    } 
                    
                    this.pagination = $localStorage.pagination[this.name];

                    return this;
                },

                prev: function() {
                    if (this.pagination.page === 1) {
                        return false;
                    }

                    this.pagination.page--;
                    this.vm.load();
                },

                next: function() {
                    if (this.pagination.page === this.vm.tableData.last_page) {
                        return false;
                    }

                    this.pagination.page++;
                    this.vm.load();
                },

                changePerPage: function() {
                    this.pagination.page = 1;
                    this.vm.load();
                },

                reset: function() {
                    this.pagination.page = 1;
                    this.vm.load();
                }
            };
        }]);
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlSGVhZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsZUFBQTtZQUNBLFVBQUE7Z0JBQ0EsTUFBQTs7WUFFQSxhQUFBOztTQUVBLFFBQUEsaUNBQUEsU0FBQSxlQUFBO1lBQ0EsSUFBQSxNQUFBLElBQUE7O1lBRUEsT0FBQTtnQkFDQSxNQUFBLFNBQUEsTUFBQSxJQUFBLFdBQUE7b0JBQ0EsS0FBQSxZQUFBO29CQUNBLEtBQUEsWUFBQTs7b0JBRUEsSUFBQSxDQUFBLGNBQUEsWUFBQSxjQUFBLGFBQUE7O29CQUVBLElBQUEsQ0FBQSxjQUFBLFdBQUEsZUFBQSxLQUFBLE9BQUE7d0JBQ0EsY0FBQSxXQUFBLEtBQUEsUUFBQTs0QkFDQSxVQUFBOzRCQUNBLFVBQUE7Ozs7b0JBSUEsS0FBQSxhQUFBLGNBQUEsV0FBQSxLQUFBOztvQkFFQSxPQUFBOzs7Z0JBR0EsTUFBQSxXQUFBO29CQUNBLElBQUEsS0FBQSxXQUFBLFNBQUEsR0FBQTt3QkFDQSxPQUFBOzs7b0JBR0EsS0FBQSxXQUFBO29CQUNBLEtBQUEsR0FBQTs7O2dCQUdBLE1BQUEsV0FBQTtvQkFDQSxJQUFBLEtBQUEsV0FBQSxTQUFBLEtBQUEsR0FBQSxVQUFBLFdBQUE7d0JBQ0EsT0FBQTs7O29CQUdBLEtBQUEsV0FBQTtvQkFDQSxLQUFBLEdBQUE7OztnQkFHQSxlQUFBLFdBQUE7b0JBQ0EsS0FBQSxXQUFBLE9BQUE7b0JBQ0EsS0FBQSxHQUFBOzs7Z0JBR0EsT0FBQSxXQUFBO29CQUNBLEtBQUEsV0FBQSxPQUFBO29CQUNBLEtBQUEsR0FBQTs7Ozs7QUFLQSIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgndGFibGVIZWFkZXInLCB7IFxuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtaGVhZGVyLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgIC5zZXJ2aWNlKCdUYWJsZUhlYWRlcicsIGZ1bmN0aW9uKCRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHZhciBuYW1lLCB2bSwgcGFnaW5hdGlvbjtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbihuYW1lLCB2bSwgdXNlRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSAgICAgID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bSAgICAgICAgPSB2bTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvbikgJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uID0ge307XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb24uaGFzT3duUHJvcGVydHkodGhpcy5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uW3RoaXMubmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyX3BhZ2U6ICcyMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb25bdGhpcy5uYW1lXTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcHJldjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2luYXRpb24ucGFnZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UtLTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0aW9uLnBhZ2UgPT09IHRoaXMudm0udGFibGVEYXRhLmxhc3RfcGFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNoYW5nZVBlclBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
