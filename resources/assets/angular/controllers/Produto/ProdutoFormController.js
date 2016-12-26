(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('ProdutoFormController', ProdutoFormController);

    function ProdutoFormController($state, $stateParams, SweetAlert, toaster, TabsHelper, PedidoHelper, Produto, Linha, Marca, Atributo) {
        var vm       = this;
        var original = {
            linha_id: null,
            attrs   : null
        };

        vm.produto = {
            sku    : $stateParams.sku || null,
            unidade: 'un',
            ativo  : '1',
            estado : '0'
        };

        vm.sku = {
            original: vm.produto.sku,
            gerado  : false
        };

        vm.linhas = {};
        vm.marcas = {};

        vm.tabsHelper   = TabsHelper;
        vm.pedidoHelper = PedidoHelper;

        vm.load = function() {
            vm.loading = true;

            Produto.get(vm.produto.sku).then(function(produto) {
                vm.produto = produto;

                if (!vm.produto.unidade)
                    vm.produto.unidade = 'un';

                if (vm.produto.ativo === null)
                    vm.produto.ativo = '1';

                if (vm.produto.estado === null)
                    vm.produto.estado = '0';

                if (vm.produto.linha_id)
                    original.linha_id = vm.produto.linha_id;

                if (vm.produto.linha_id && vm.produto.atributos) {
                    original.attrs = vm.produto.atributos;
                }

                if (vm.produto.linha_id)
                    vm.loadAtributos();

                vm.loading = false;
            });
        };

        vm.loadLinhas = function() {
            vm.loading = true;

            Linha.getList().then(function(linhas) {
                vm.linhas = linhas;
                vm.loading = false;
            });
        };

        vm.loadMarcas = function() {
            vm.loading = true;

            Marca.getList().then(function(marcas) {
                vm.marcas = marcas;
                vm.loading = false;
            });
        };

        vm.loadAtributos = function() {
            vm.loading = true;

            Atributo.fromLinha(vm.produto.linha_id).then(function(atributos) {
                vm.loading = false;

                if (vm.produto.linha_id == original.linha_id && original.attrs) {
                    var mergedAttrs = original.attrs;

                    for (var i in atributos) {
                        for (var j in original.attrs) {
                            if (original.attrs[j] && atributos[i]) {
                                if (original.attrs[j].id === atributos[i].id) {
                                    atributos[i] = original.attrs[j];
                                }
                            }
                        }
                    }
                }

                vm.produto.atributos = atributos;
            });
        };

        if (vm.produto.sku)
            vm.load();

        vm.loadLinhas();
        vm.loadMarcas();

        /*
         * Recarrega os atributos e seta o ncm padrão ao alterar
         */
        vm.linhaChange = function() {
            vm.produto.linha_id = vm.produto.linha.id;

            Linha.get(vm.produto.linha_id).then(function(linha) {
                vm.produto.linha = linha;

                if (linha.ncm_padrao) {
                    SweetAlert.swal({
                        type: 'info',
                        title: '',
                        html: true,
                        text: 'O código NCM padrão desta linha é: <b>' + linha.ncm_padrao + '</b><br/>Deseja utilizá-lo?',
                        showCancelButton: true,
                        cancelButtonText: 'Não',
                        confirmButtonColor: '#40D9CA',
                        confirmButtonText: 'Sim'
                    }, function(isConfirm) {
                        if (isConfirm) {
                            vm.produto.ncm = linha.ncm_padrao;
                        }
                    });
                }
            });

            vm.loadAtributos();
        };

        /*
         * Recarrega os atributos e seta o ncm padrão ao alterar
         */
        vm.marcaChange = function() {
            vm.produto.marca_id = vm.produto.marca.id;
        };

        /*
         * Retona um novo SKU para o produto
         */
        vm.generateSku = function() {
            function generate() {
                Produto.generateSku(vm.sku.original).then(function(product) {
                    vm.produto.sku = product.sku;
                    $state.go('app.produtos.form', {sku: product.sku}, {notify: false});
                    vm.sku.gerado = true;

                    toaster.pop('success', 'Sucesso!', 'Um novo SKU foi gerado para este produto!');

                    for (var i in vm.produto.atributos) {
                        if (vm.produto.atributos[i] && typeof vm.produto.atributos[i] == 'object' && vm.produto.atributos[i].id) {
                            if (!vm.produto.atributos[i].pivot)
                                vm.produto.atributos[i].pivot = {};

                            vm.produto.atributos[i].pivot.produto_sku = product.sku;
                        }
                    }
                });
            }

            if (!vm.produto.sku) {
                generate();
            } else {
                SweetAlert.swal({
                    title: "Tem certeza?",
                    text: "Esta ação não poderá ser desfeita!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "Não",
                    confirmButtonColor: "#F55752",
                    confirmButtonText: "Sim!"
                }, function(isConfirm) {
                    if (isConfirm) {
                        generate();
                    }
                });
            }
        };

        /**
         * Salva o produto
         *
         * @return {void}
         */
        vm.save = function() {
            function save() {
                Produto.save(vm.produto, ((vm.sku.gerado) ? vm.produto.sku : vm.sku.original)).then(function() {
                    toaster.pop('success', 'Sucesso!', 'Produto salvo com sucesso!');
                    $state.go('app.produtos.index');
                });
            }

            if (vm.sku.gerado || vm.sku.original == vm.produto.sku) {
                save();
            } else {
                Produto.checkSku(vm.produto.sku).then(function(response) {
                    if (response.exists) {
                        toaster.pop('error', 'SKU existente!', 'Impossível cadastrar produto! Utilize outro SKU!');
                    } else {
                        save();
                    }
                });
            }
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
    }
})();
