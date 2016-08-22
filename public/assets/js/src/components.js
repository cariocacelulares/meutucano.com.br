(function() {
    'use strict';

    angular 
        .module('MeuTucano') 
        .component('dropdown', {
            bindings: {
                title: '@'
            },
            transclude: true,
            templateUrl: 'views/components/dropdown.html'
        });

})();
(function() {
    'use strict';

    angular 
        .module('MeuTucano') 
        .component('loading', {
            bindings: {
                icon: '@'
            },
            templateUrl: 'views/components/loading.html'
        });

})();
(function() {
    'use strict';

    angular 
        .module('MeuTucano') 
        .component('pageTitle', {
            bindings: {
                icon: '@',
                title: '@',
                description: '@'
            },
            templateUrl: 'views/components/page-title.html'
        });

})();
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
                    this.name = name;
                    this.vm   = vm;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyb3Bkb3duLmpzIiwiTG9hZGluZy5qcyIsIlBhZ2VUaXRsZS5qcyIsIlRhYmxlSGVhZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsWUFBQTtZQUNBLFVBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxZQUFBO1lBQ0EsYUFBQTs7OztBQ1ZBLENBQUEsV0FBQTtJQUNBOztJQUVBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsV0FBQTtZQUNBLFVBQUE7Z0JBQ0EsTUFBQTs7WUFFQSxhQUFBOzs7O0FDVEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxhQUFBO1lBQ0EsVUFBQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsYUFBQTs7WUFFQSxhQUFBOzs7O0FDWEEsQ0FBQSxXQUFBO0lBQ0E7O0lBRUE7U0FDQSxPQUFBO1NBQ0EsVUFBQSxlQUFBO1lBQ0EsVUFBQTtnQkFDQSxNQUFBOztZQUVBLGFBQUE7O1NBRUEsUUFBQSxpQ0FBQSxTQUFBLGVBQUE7WUFDQSxJQUFBLE1BQUEsSUFBQTs7WUFFQSxPQUFBO2dCQUNBLE1BQUEsU0FBQSxNQUFBLElBQUEsV0FBQTtvQkFDQSxLQUFBLE9BQUE7b0JBQ0EsS0FBQSxPQUFBOztvQkFFQSxJQUFBLENBQUEsY0FBQSxZQUFBLGNBQUEsYUFBQTs7b0JBRUEsSUFBQSxDQUFBLGNBQUEsV0FBQSxlQUFBLEtBQUEsT0FBQTt3QkFDQSxjQUFBLFdBQUEsS0FBQSxRQUFBOzRCQUNBLFVBQUE7NEJBQ0EsVUFBQTs7OztvQkFJQSxLQUFBLGFBQUEsY0FBQSxXQUFBLEtBQUE7O29CQUVBLE9BQUE7OztnQkFHQSxNQUFBLFdBQUE7b0JBQ0EsSUFBQSxLQUFBLFdBQUEsU0FBQSxHQUFBO3dCQUNBLE9BQUE7OztvQkFHQSxLQUFBLFdBQUE7b0JBQ0EsS0FBQSxHQUFBOzs7Z0JBR0EsTUFBQSxXQUFBO29CQUNBLElBQUEsS0FBQSxXQUFBLFNBQUEsS0FBQSxHQUFBLFVBQUEsV0FBQTt3QkFDQSxPQUFBOzs7b0JBR0EsS0FBQSxXQUFBO29CQUNBLEtBQUEsR0FBQTs7O2dCQUdBLGVBQUEsV0FBQTtvQkFDQSxLQUFBLFdBQUEsT0FBQTtvQkFDQSxLQUFBLEdBQUE7OztnQkFHQSxPQUFBLFdBQUE7b0JBQ0EsS0FBQSxXQUFBLE9BQUE7b0JBQ0EsS0FBQSxHQUFBOzs7OztBQUtBIiwiZmlsZSI6ImNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhciBcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJykgXG4gICAgICAgIC5jb21wb25lbnQoJ2Ryb3Bkb3duJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9kcm9wZG93bi5odG1sJ1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhciBcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJykgXG4gICAgICAgIC5jb21wb25lbnQoJ2xvYWRpbmcnLCB7XG4gICAgICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgICAgIGljb246ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9sb2FkaW5nLmh0bWwnXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyIFxuICAgICAgICAubW9kdWxlKCdNZXVUdWNhbm8nKSBcbiAgICAgICAgLmNvbXBvbmVudCgncGFnZVRpdGxlJywge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpY29uOiAnQCcsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3BhZ2UtdGl0bGUuaHRtbCdcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnTWV1VHVjYW5vJylcbiAgICAgICAgLmNvbXBvbmVudCgndGFibGVIZWFkZXInLCB7IFxuICAgICAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvdGFibGUtaGVhZGVyLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgIC5zZXJ2aWNlKCdUYWJsZUhlYWRlcicsIGZ1bmN0aW9uKCRsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHZhciBuYW1lLCB2bSwgcGFnaW5hdGlvbjtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbihuYW1lLCB2bSwgdXNlRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0gICA9IHZtO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGxvY2FsU3RvcmFnZS5wYWdpbmF0aW9uKSAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb24gPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvbi5oYXNPd25Qcm9wZXJ0eSh0aGlzLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYWxTdG9yYWdlLnBhZ2luYXRpb25bdGhpcy5uYW1lXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogJzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbiA9ICRsb2NhbFN0b3JhZ2UucGFnaW5hdGlvblt0aGlzLm5hbWVdO1xuIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcHJldjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2luYXRpb24ucGFnZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UtLTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdpbmF0aW9uLnBhZ2UgPT09IHRoaXMudm0udGFibGVEYXRhLmxhc3RfcGFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLnBhZ2UrKztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNoYW5nZVBlclBhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24ucGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudm0ubG9hZCgpO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbi5wYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52bS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
