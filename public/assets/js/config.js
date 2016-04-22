(function() {
    'use strict';

    angular
        .module('MeuTucano')

        /**
         * Paths
         */
        .constant('apiUrl', 'http://localhost/dev/tucanov3/public/api')

        /**
         * Auth config
         */
        .config(function($authProvider, apiUrl) {
            $authProvider.loginUrl = apiUrl + '/authenticate';
        })

        /**
         * Angular animate config
         */
        .config(function($animateProvider) {
            $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
        })

        /**
         * Get user information before app starts
         */
        .run(function($rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function(event, toState) {
                var user = JSON.parse(localStorage.getItem('user'));

                if (user) {
                    $rootScope.authenticated = true;
                    $rootScope.currentUser = user;

                    if(toState.name === "login") {
                        event.preventDefault();
                        $state.go('app.dashboard');
                    }
                } else if (!user && toState.name !== "login") {
                    event.preventDefault();
                    $state.go('login');
                }
            });
        })

        /**
         * REST
         */
        .config(function(RestangularProvider, apiUrl) {
            RestangularProvider.setBaseUrl(apiUrl);

            RestangularProvider.setResponseExtractor(function(response) {
                return response.data;
            });

            RestangularProvider.setDefaultHeaders({Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")});
        })

        /**
         * REST interceptor
         */
        .run(function(Restangular, $http, $state, apiUrl) {
            Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
                if (response.status === 401) { // Atualiza token expirado
                    $http.get(apiUrl + '/token', {
                        headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")}
                    }).error(function() {
                        localStorage.removeItem('user');
                        $state.go('login');
                    }).then(function(tokenResponse) {
                        localStorage.setItem('satellizer_token', tokenResponse.data.token);
                        $http(response.config).then(responseHandler, deferred.reject);
                    });

                    return false;
                } else if ([400].indexOf(response.status) >= 0) { // Redireciona ao login caso token seja inválido
                    localStorage.removeItem('user');
                    $state.go('login');
                }

                return true;
            });
        })

        /**
         * Handle errors in http requests
         */
        .config(function($httpProvider) {
            $httpProvider.interceptors.push("ToasterInterceptor");
        })

    ;
})();