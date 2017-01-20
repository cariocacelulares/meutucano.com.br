(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Nota', NotaModel);

        function NotaModel(Rest, Restangular) {
            var rest     = angular.copy(Rest);
            rest.baseUrl = 'notas';

            angular.extend(rest, {
                /**
                 * Deleta um registro do recurso
                 *
                 * @param  {int}    id
                 * @return {Object}
                 */
                delete: function(id, delete_note) {
                    return Restangular.one(this.baseUrl, id).customDELETE('', {
                        delete_note: delete_note
                    });
                }
            });

            return rest;
        }
})();
