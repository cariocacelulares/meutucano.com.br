
(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('MinhaSenhaController', MinhaSenhaController);

    function MinhaSenhaController($rootScope, Restangular, ngDialog, toaster, Senha, TableHeader) {
        var vm = this;

        /**
         * Cabeçalho da tabela
         * @type {TableHeader}
         */
        vm.tableHeader = TableHeader.init('senhas', vm);

        vm.load = function() {
            ngDialog.open({
                template: 'views/usuario/senha/form_senha.html'
            }).closePromise.then(function(data) {
                if (data.value !== null) {
                    vm.loading = true;

                    Restangular.one('check-password', $rootScope.currentUser.id).customPOST({ 'password': data.value }).then(function(response) {
                        vm.loading = false;

                        if (response === true) {
                            vm.loading = true;

                            Senha.fromUser($rootScope.currentUser.id, {
                                page:     vm.tableHeader.pagination.page,
                                per_page: vm.tableHeader.pagination.per_page,
                            }).then(function(response) {
                                vm.tableData = response;
                                vm.loading = false;
                            });
                        } else {
                            vm.tableData = {};
                            toaster.pop('error', 'Senhas não conferem!', 'Você não poderá visualizar essas informações!');
                        }
                    });
                }
            });
        };

        vm.load();

        /**
         * Esconde / mostra a senha
         * @param  {int} index indice da senha
         * @return {void}
         */
        vm.toglePassword = function(index) {
            if (vm.tableData.data[index].inputType == 'text') {
                vm.tableData.data[index].inputType = 'password';
            } else {
                vm.tableData.data[index].inputType = 'text';
            }
        };
    }
})();