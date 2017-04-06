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
                 * @param  {int} id              invoice id
                 * @param  {string} delete_note  observation
                 * @param  {boolean} returnStock if order products returns to stock
                 * @return {Object}
                 */
                delete: function(id, delete_note, returnStock) {
                    var params = '?delete_note=' + delete_note +
                        '&return_stock=' + returnStock;

                    return Restangular.one(this.baseUrl + '/' + id + params).customDELETE('');
                }
            });

            return rest;
        }
})();
