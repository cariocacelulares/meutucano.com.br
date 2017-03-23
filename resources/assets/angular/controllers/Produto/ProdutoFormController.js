(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoFormController', ProdutoFormController);

    function ProdutoFormController($state, $stateParams, ngDialog, SweetAlert,
            toaster, Produto, Linha, Marca, Atributo, ValidationErrors,
            ProductStock, Upload, envService, $httpParamSerializer) {

        var vm        = this;
        var original  = {
            linha_id : null,
            attrs    : null
        };

        vm.editedSku = parseInt($stateParams.sku) || null;
        vm.produto = {
            sku         : vm.editedSku,
            estado      : '0'
        };

        vm.imeis = {};

        vm.linhas = {};
        vm.marcas = {};

        vm.validationErrors = [];
        vm.productStocks    = [];

        vm.loadProductStocks = function() {
            ProductStock.listBySku(vm.produto.sku).then(function (response) {
                vm.productStocks = response;
            });
        };

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(produto) {
                vm.produto = produto;
                vm.loading = false;

                vm.loadProductStocks();
            });
        };

        if (vm.produto.sku)
            vm.load();

        vm.loadLinhas = function() {
            Linha.all().then(function(linhas) {
                vm.linhas = linhas;
                console.log(vm.linhas);
            });
        }();

        vm.loadMarcas = function() {
            Marca.all().then(function(marcas) {
                vm.marcas = marcas;
            });
        }();

        /**
         * Salva o produto
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Produto.save(Object.assign({}, vm.produto, { originalSku : vm.editedSku }), vm.editedSku).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Produto salvo com sucesso!');
                    $state.go('app.produtos.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Exclui o produto
         *
         * @return {void}
         */
        vm.destroy = function() {
            Produto.delete(vm.produto.sku).then(function() {
                toaster.pop('success', 'Sucesso!', 'Produto excluido com sucesso!');
                $state.go('app.produtos.index');
            });
        };

        /**
         * Open form to add new imeis
         */
        vm.openImeiForm = function() {
            ngDialog.open({
                template       : 'views/produto/entrada-produto.html',
                controller     : 'EntradaProdutoFormController',
                controllerAs   : 'EntradaProdutoForm',
                closeByDocument: false,
                data: {
                    sku: vm.produto.sku
                }
            }).closePromise.then(function(data) {
                vm.load();
            });
        };

        /**
         * Open transfer modal
         *
         * @param  {object} productStock
         */
        vm.transfer = function(productStock) {
            ngDialog.open({
                template       : 'views/estoque/transferir.html',
                controller     : 'TransferirEstoqueController',
                controllerAs   : 'TransferirEstoque',
                closeByDocument: false,
                data: {
                    productStock: productStock
                }
            }).closePromise.then(function(data) {
                vm.loadProductStocks();
            });
        };

        /**
         * Open add product stock modal
         */
        vm.addProductStock = function() {
            ngDialog.open({
                template       : 'views/estoque/adicionar-estoque.html',
                controller     : 'AdicionarEstoqueController',
                controllerAs   : 'AdicionarEstoque',
                closeByDocument: false,
                data: {
                    sku: vm.produto.sku
                }
            }).closePromise.then(function(data) {
                vm.loadProductStocks();
            });
        };

        /**
         * Upload notas
         *
         * @param files
         */
        vm.imageErrors = [];
        vm.produto.images = [];
        vm.uploadLoading = false;
        vm.upload = function(files) {
            if (files && files.length) {
                vm.uploadLoading = true;

                Upload.upload({
                    url: envService.read('apiUrl') + '/produtos/upload',
                    headers: {
                        Authorization: 'Bearer '+ localStorage.getItem("satellizer_token")
                    },
                    data: {
                        files: files
                    }
                }).success(function(response) {
                    vm.imageErrors = [];
                    vm.uploadLoading  = false;

                    vm.produto.images = vm.produto.images.concat(
                        (response.data.hasOwnProperty('success')) ? response.data.success : []
                    );

                    vm.imageErrors = vm.imageErrors.concat(
                        (response.data.hasOwnProperty('error')) ? response.data.error : []
                    );
                }).error(function() {
                    toaster.pop('error', "Erro no upload!", "Erro ao enviar arquivos, tente novamente!");
                });
            }
        };

        vm.getImageSrc = function(image) {
            var auth = {
                token: localStorage.getItem("satellizer_token")
            }

            return envService.read('apiUrl') + '/storage/produto/' + image.file + '?' + $httpParamSerializer(auth)
        }
    }
})();
