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
        .service('TableHeader', function($localStorage) {
            var name, vm, pagination;

            return {
                init: function(name, vm, useFilter) {
                    this.name = name;
                    this.vm   = vm;

                    console.log(this.vm);

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
        });
})();
