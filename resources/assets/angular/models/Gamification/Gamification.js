(function() {
    'use strict';

    angular
        .module('MeuTucano')
        .service('Gamification', GamificationModel);

        function GamificationModel(Restangular) {
            var baseUrl = 'gamification';

            return {
                get: function(id) {
                    return Restangular.one(baseUrl, id || null).get();
                },

                perfil: function(usuario_id) {
                    return Restangular.one(baseUrl + '/perfil', usuario_id || null).customGET();
                },

                ranking: function(mes) {
                    var string = '';

                    if (typeof mes !== 'undefined') {
                        string = '?mes=' + mes;
                    }

                    return Restangular.one(baseUrl + '/ranking' + string).customGET();
                },

                rankInfo: function() {
                    return Restangular.one(baseUrl + '/rank-info').customGET();
                },

                avatar: function(gamification_id, avatar) {
                    return Restangular.one(baseUrl + '/avatar', gamification_id).customPOST({
                        avatar: avatar
                    });
                }
            };
        }
})();
