(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Rest', function (Restangular) {
            return {
                baseUrl:   '',

                /**
                 * Retorna uma lista do recurso
                 * 
                 * @param  {Object} params 
                 * @return {Array}        
                 */
                getList: function(params) {
                    if (params) {
                        angular.forEach(['join', 'filter', 'fields'], function(value) {
                            if (this.hasOwnProperty(value)) {
                                this[value] = JSON.stringify(this[value]);
                            }
                        }, params);
                    }

                    return Restangular.all(this.baseUrl).customGET("", params || {});
                }, 

                /**
                 * Busca um registro de recurso
                 * 
                 * @param  {int}    id 
                 * @return {Object}    
                 */
                get: function(id) {
                    return Restangular.one(this.baseUrl, id).get();
                },

                /**
                 * Cria um novo registro do recurso
                 * 
                 * @param  {Object} params 
                 * @return {Object}
                 */
                create: function(params) {
                    return Restangular.all(this.baseUrl).post(params);
                },

                /**
                 * Atualiza um registro do recurso
                 * 
                 * @param  {int}    id     
                 * @param  {Object} params 
                 * @return {Object}       
                 */
                update: function(id, params) {
                    return Restangular.one(this.baseUrl, id).customPUT(params || {});
                },

                /**
                 * Atualiza ou cria um registro do recurso
                 * 
                 * @param  {Object} params 
                 * @param  {int} id     
                 * @return {Object}        
                 */
                save: function(params, id) {
                    if (id) {
                        return this.update(id, params);
                    } else {
                        return this.create(params);
                    }
                },

                /**
                 * Deleta um registro do recurso
                 * 
                 * @param  {int}    id 
                 * @return {Object}    
                 */
                delete: function(id) {
                    return Restangular.one(this.baseUrl, id).remove();
                }
            };
    });
})();
