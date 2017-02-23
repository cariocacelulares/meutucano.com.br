(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('ProductStock', ProductStockModel);

        function ProductStockModel(Rest, Restangular) {
            var rest = angular.copy(Rest);
            rest.baseUrl = 'produto-estoque';

            angular.extend(rest, {
                /**
                 * Lista os estoques associados ao slug
                 *
                 * @param  {int} slug
                 * @return {Object}
                 */
                listBySlug: function(slug, params) {
                    params = this.parseParams(params);

                    return Restangular.all(rest.baseUrl + '/slug/').customGET(slug, params || {});
                },

                /**
                 * Lista os estoques associados ao sku
                 *
                 * @param  {int} sku
                 * @return {Object}
                 */
                listBySku: function(sku) {
                    return Restangular.one(rest.baseUrl + '/list/').customGET(sku);
                },

                /**
                 * Envia as informações de entrada do produto
                 *
                 * @param  {int} data informacoes da entrada
                 * @return {Object}
                 */
                entry: function(data) {
                    return Restangular.one(rest.baseUrl + '/entry').customPOST(data);
                },

                /**
                 * Atualiza as inforamcoes do product stock
                 *
                 * @param  {int} productStocks informacoes da entrada
                 * @return {Object}
                 */
                refresh: function(productStocks) {
                    return Restangular.one(rest.baseUrl + '/refresh').customPOST(productStocks);
                },

                /**
                 * Returns a list of transfer options to the giver product stock
                 *
                 * @param  {int} id
                 * @return {Object}
                 */
                transferOptions: function(id) {
                    return Restangular.one(rest.baseUrl + '/transferencia', id).customGET();
                },

                /**
                 * Transfer stock values from to
                 *
                 * @param  {int}   from   id of productStock
                 * @param  {int}   to     id of productStock
                 * @param  {int}   qty    quantity to transfer
                 * @param  {array} values imeis to transfer
                 * @return {Object}
                 */
                transfer: function(from, to, qty, imeis) {
                    return Restangular.one(rest.baseUrl + '/transferencia').customPOST({
                        from : from,
                        to   : to,
                        qty  : qty,
                        imeis: imeis
                    });
                }
            });

            return rest;
        }
})();
