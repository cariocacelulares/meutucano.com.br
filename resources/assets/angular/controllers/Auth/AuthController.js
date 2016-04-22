(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('AuthController', AuthController);

    function AuthController($auth, $http, $state, $rootScope, focus) {
        var vm = this;

        vm.email = localStorage.getItem('lastEmail');
        if (vm.email) {
            focus('password');
        } else {
            focus('email');
        }

        /**
         * Login
         */
        vm.login = function() {
            vm.loading = true;

            localStorage.setItem('lastEmail', vm.email);
            var credentials = {
                email: vm.email,
                password: vm.password
            };

            $auth.login(credentials).then(function() {
                return $http.get('api/authenticate/user');
            }).then(function(response) {
                vm.loading = false;
                var user = JSON.stringify(response.data.user);

                localStorage.setItem('user', user);
                $rootScope.authenticated = true;

                $rootScope.currentUser = response.data.user;
                $state.go('app.dashboard');
            });
        };
    }

})();