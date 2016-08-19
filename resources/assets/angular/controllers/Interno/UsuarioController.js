(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('UsuarioController', UsuarioController);

    function UsuarioController($rootScope, Restangular, ngDialog, toaster) {
        var vm = this;

        vm.usuarios = [];
        vm.loading = false;

        $rootScope.$on('upload', function() {
            vm.load();
        });

        $rootScope.$on('loading', function() {
            vm.loading = true;
        });

        $rootScope.$on('stop-loading', function() {
            vm.loading = false;
        });

        /**
         * Load usuarios
         */
        vm.load = function() {
            vm.usuarios = [];
            vm.loading = true;

            Restangular.all('usuarios').getList().then(function(usuarios) {
                vm.usuarios = usuarios;
                vm.loading = false;
            });
        };
        vm.load();

        /**
         * Edit usuario
         */
        vm.editar = function(usuario) {
            ngDialog.open({
                template: 'views/interno/partials/usuario_form.html',
                className: 'ngdialog-theme-default user-form',
                controller: 'UsuarioEditarController',
                controllerAs: 'Form',
                data: {
                    usuario: usuario
                }
            });
        };

        /**
         * Create usuario
         */
        vm.create = function() {
            ngDialog.open({
                template: 'views/interno/partials/usuario_form.html',
                className: 'ngdialog-theme-default user-form',
                controller: 'UsuarioNovoController',
                controllerAs: 'Form'
            });
        };

        /**
         * Delete user
         *
         * @param user_id
         */
        vm.destroy = function(user_id) {
            Restangular.one('usuarios', user_id).customDELETE().then(function() {
                $rootScope.$broadcast('upload');
                toaster.pop('success', 'Sucesso!', 'Usuário deletado com sucesso!');
            });
        };
    }

})();