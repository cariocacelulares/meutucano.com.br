(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('EntradaEstoqueFormController', EntradaEstoqueFormController);

    function EntradaEstoqueFormController($state, envService, toaster, ValidationErrors, Upload, Cep, StockEntry) {
        var vm = this;

        vm.validationErrors = [];
        vm.searchAddress    = true;

        vm.modified = false;
        vm.loading  = false;
        vm.entry    = {
            supplier: {},
            invoice : {},
            products: []
        };

        /**
         * If not set, search supplier by cnpj
         */
        vm.cnpjChanged = function() {
            if ((typeof vm.entry.supplier.id == 'undefined' || !vm.entry.supplier) && vm.entry.supplier.cnpj.length === 14) {
                Supplier.search(vm.entry.supplier.cnpj).then(function(supplier) {
                    vm.entry.supplier = supplier;
                });
            }
        }

        /**
         * If can, search address by cep
         */
        vm.cepChanged = function() {
            if (vm.searchAddress && vm.entry.supplier.cep.length === 8) {
                Cep.getAddress(vm.entry.supplier.cep).then(function(address) {
                    vm.entry.supplier.neighborhood = address.bairro;
                    vm.entry.supplier.cep          = address.cep;
                    vm.entry.supplier.city         = address.cidade;
                    vm.entry.supplier.complement   = address.complemento;
                    vm.entry.supplier.number       = address.numero;
                    vm.entry.supplier.street       = address.rua;
                    vm.entry.supplier.uf           = address.uf;
                    vm.entry.supplier.country      = 'Brasil';
                });
            }
        }

        /**
         * Upload entry invoice
         * @param  {array} files
         */
        vm.upload = function(files) {
            if (files.length && typeof files[0] !== 'undefined') {
                var file = files[0];
            } else {
                toaster.pop('error', 'Arquivo inválido!', 'Não foi possível importar o arquivo');
                return;
            }

            if (file) {
                vm.loading = true;

                Upload.upload({
                    url: envService.read('apiUrl') + '/estoque/entrada/nota/upload',
                    headers: {Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")},
                    data: {
                        file: file
                    }
                }).success(function(response) {
                    vm.loading = false;

                    if (!response.error) {
                        vm.entry.invoice  = response.object.invoice || null;
                        vm.entry.products = response.object.products || null;
                        vm.entry.supplier = response.object.supplier || null;

                        vm.searchAddress = false;
                        console.log(vm.entry);
                    }
                }).error(function() {
                    toaster.pop('error', 'Erro no upload!', 'Erro ao enviar arquivos, tente novamente!');
                });
            }
        };

        vm.save = function() {
            vm.validationErrors = [];

            StockEntry.save(vm.entry).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Entrada salva com sucesso!');
                    $state.go('app.estoque.entrada.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };
    }
})();
