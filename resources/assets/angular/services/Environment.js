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
