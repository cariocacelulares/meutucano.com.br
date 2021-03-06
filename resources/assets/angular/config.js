(function() {
    'use strict';

    angular
        .module('MeuTucano')

        .config(function(envServiceProvider) {
            envServiceProvider.config({
                domains: {
                    development:    ['tucano.app'],
                    production :    ['192.168.2.170'],
                    aws        :    ['www.meutucano.com.br', 'meutucano.com.br']
                },
                vars: {
                    development: {
                        apiUrl   : 'http://tucano.app/api',
                        assetUrl : 'http://tucano.app/'
                    },
                    production: {
                        apiUrl   : 'http://192.168.2.170/meutucano/public/index.php/api',
                        assetUrl : 'http://192.168.2.170/meutucano/public/'
                    },
                    aws: {
                        apiUrl  : 'https://www.meutucano.com.br/index.php/api',
                        assetUrl: 'https://meutucano.s3-sa-east-1.amazonaws.com/public/'
                    }
                }
            });

            envServiceProvider.check();
        })

        /**
         * Auth config
         */
        .config(function($authProvider, envServiceProvider) {
            $authProvider.loginUrl = envServiceProvider.read('apiUrl') + '/authenticate';
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
        .run(function($anchorScroll, $rootScope, $state) {
            $anchorScroll.yOffset = 70;

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                var user = JSON.parse(localStorage.getItem('user'));

                if (user) {
                    $rootScope.authenticated = true;
                    $rootScope.currentUser = user;

                    if(toState.name === 'login') {
                        event.preventDefault();
                        $state.go('app.dashboard');
                    }
                } else if (!user && toState.name !== 'login') {
                    event.preventDefault();
                    $state.go('login');
                }
            });
        })

        /**
         * REST
         */
        .config(function(RestangularProvider, envServiceProvider) {
            RestangularProvider.setBaseUrl(envServiceProvider.read('apiUrl'));

            RestangularProvider.setResponseExtractor(function(response) {
                return response.data;
            });

            RestangularProvider.setDefaultHeaders({Authorization: 'Bearer '+ localStorage.getItem('satellizer_token')});
        })

        /**
         * REST interceptor
         */
        .run(function(Restangular, $http, $state, envService, toaster) {
            Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
                if (response.status === 401) { // Atualiza token expirado
                    $http.get(envService.read('apiUrl') + '/token', {
                        headers: {Authorization: 'Bearer '+ localStorage.getItem('satellizer_token')}
                    }).then(
                        function(tokenResponse) {
                            localStorage.setItem('satellizer_token', tokenResponse.data.token);
                            $http(response.config).then(responseHandler, deferred.reject);
                        },
                        function() {
                            localStorage.removeItem('user');
                            $state.go('login');
                        }
                    );

                    return false;
                } else if (response.data.status == 'ValidationFail') { // Erros de Validação
                    toaster.pop('warning', 'Erro de validação', 'Um ou mais campos não foram preenchidos corretamente.');
                } else if ([400].indexOf(response.status) >= 0) { // Redireciona ao login caso token seja inválido
                    localStorage.removeItem('user');
                    $state.go('login');
                } else if ([403].indexOf(response.status) >= 0) { // Acesso negado ao recurso
                    toaster.pop('error', 'Acesso negado', 'Você não possui acesso para concluir essa ação, contate o administrador!');
                } else { // Erros de API
                    if (!response.data.msg) {
                        toaster.pop('error', 'Erro', 'Não foi possível processar a operação, contate o administrador!');
                    } else {
                        toaster.pop('error', 'Erro', response.data.msg);
                    }
                }

                return true;
            });
        })

        /**
         * Handle errors in http requests
         */
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('ToasterInterceptor');
        })

        /**
         * Permissions to routes
         */
        .run(function($rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function(event, toState) {
                if (toState.data && toState.data.roles) {
                    var block = true;
                    angular.forEach(toState.data.roles, function(role) {
                        if (typeof $rootScope.currentUser !== 'undefined' && _.find($rootScope.currentUser.roles, {name: role})) {
                            block = false;
                        }
                    });

                    if (block) {
                        event.preventDefault();
                        $state.go('app.dashboard');
                    }
                }

                return true;
            });
        })

        /**
         * Wysiwig editor config
         *
         * @param  {Array}  $provide
         * @return {Object}
         */
        .config(function($provide) {
            $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
                taOptions.toolbar = [
                    ['h2', 'h3', 'p'],
                    ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                    ['html', 'insertLink']
                ];

                return taOptions;
            }]);
        })
    ;
})();
