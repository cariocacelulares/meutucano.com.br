(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .controller('TemplateFormController', TemplateFormController);

    function TemplateFormController($state, $stateParams, toaster, Template) {
        var vm        = this;

        vm.editedId  = parseInt($stateParams.id) || null;

        vm.validationErrors = [];

        /**
         * Load product information
         */
        vm.template = {};
        if (vm.editedId) {
            Template.get(vm.editedId).then(function(template) {
                vm.template = template;
            });
        }

        /**
         * Save the ad
         *
         * @return {void}
         */
        vm.save = function() {
            vm.validationErrors = [];
            Template.save(vm.template, vm.editedId).then(
                function() {
                    toaster.pop('success', 'Sucesso!', 'Template salvo com sucesso!');
                    $state.go('app.produtos.mercadolivre.templates.index');
                },
                function(error) {
                    vm.validationErrors = ValidationErrors.handle(error);
                }
            );
        };

        /**
         * Delete the template
         *
         * @return {void}
         */
        vm.destroy = function() {
            Template.delete(vm.editedId).then(function() {
                toaster.pop('success', 'Sucesso!', 'Template excluido com sucesso!');
                $state.go('app.produtos.mercadolivre.templates.index');
            });
        };
    }
})();
