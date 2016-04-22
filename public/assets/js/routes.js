(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'AuthController as Auth'
                })

                .state('app', {
                    url: '/app',
                    templateUrl: 'views/layouts/app.html',
                    controller: 'AppController as App'
                })

                .state('app.dashboard', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard.html',
                    controller: 'DashboardController as Dashboard'
                })

                /**
                 * Atendimento
                 */
                .state('app.atendimento', {
                    url: '/atendimento',
                    templateUrl: 'views/layouts/default.html'
                })

                .state('app.atendimento.rastreio', {
                    url: '/rastreio',
                    templateUrl: 'views/atendimento/rastreio.html',
                    controller: 'RastreioController as Rastreio'
                })

            ;
        });
})();